import { useState } from "react";
import ChangePasswordComponent from "../../../components/member/auth/changePasswordComponent";
import { useNavigate } from "react-router";
import { changePassword } from "../../../api/authApi";
import { PasswordChangeDTO } from "../../../dto/member/member.dto";
import ResultModal from "../../../components/common/resultModal";

const ChangePasswordPage = () => {

    // 결과 모달 창
    const [showModal, setShowModal] = useState(false)
    const [modalMsg, setModalMsg] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        verifyPassword: "",
    })

    const validateInputs = () => {
        const { currentPassword, newPassword, verifyPassword } = form

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-])[A-Za-z\d!@#$%^&*()_+=-]{8,20}$/

        if (!passwordRegex.test(currentPassword)) return "비밀번호는 문자, 숫자, 특수문자 포함 8~20자여야 합니다."
        if (!passwordRegex.test(newPassword)) return "비밀번호는 문자, 숫자, 특수문자 포함 8~20자여야 합니다."
        if (newPassword !== verifyPassword) return "새 비밀번호와 비밀번호 확인이 일치하지 않습니다."

        return null
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")

        const error = validateInputs()
        if (error) {
            setErrorMessage(error)
            return
        }

        try {
            setIsLoading(true)
            const pwData = PasswordChangeDTO(form) // form → DTO 변환

            // console.log("pwData: ", pwData)
            const res = await changePassword(pwData)

            setModalMsg(res.message)
            setShowModal(true)
        } catch (error) {
            let errorMessage
            if (error?.response?.data?.message === "비밀번호가 조건에 불충족할 경우") {
                errorMessage = "비밀번호가 틀렸습니다."
            } else {
                errorMessage = "비밀번호 변경 실패"
            }
            setErrorMessage(errorMessage)
        } finally{
            setIsLoading(false) // 성공/실패 관계없이 로딩 종료
        }
    }

    const closeResultModal = () => {
        setShowModal(false)
        navigate("/buyer/profile/details")
    }
    

    return(
        <div className="p-4">
            <ChangePasswordComponent
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                errorMessage={errorMessage}
                isLoading={isLoading}
            />
            <ResultModal show={showModal} closeResultModal={closeResultModal} msg={modalMsg} />
        </div>
    )
}

export default ChangePasswordPage;