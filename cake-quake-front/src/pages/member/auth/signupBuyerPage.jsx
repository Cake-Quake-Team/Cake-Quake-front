import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ResultModal from "../../../components/common/resultModal";
import SignupBuyerComponent from "../../../components/member/auth/signupBuyerComponent";
import { createBuyerSignupDTO } from "../../../dto/member/member.dto";
import VerifyModal from "../../../components/member/modal/VerifyModal";
import { singup } from "../../../api/authApi";

const SignupBuyerPage = () => {

    // 스크롤 제일 위로 이동
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [isLoading, setIsLoading] = useState(false)

    const [form, setForm] = useState({
        userId: "",
        password: "",
        verifyPassword: "",
        uname: "",
        phoneNumber: "",
        publicInfo: false,
        alarm: false,
        joinType: "basic",
    })

    // 결과 모달 창
    const [showModal, setShowModal] = useState(false)
    const [modalMsg, setModalMsg] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    // 휴대 전화 인증 여부, 인증 받는 모달 창
    const [isVerified, setIsVerified] = useState(false)
    const [isVerifyModalOpen, setVerifyModalOpen] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target
        const newValue = type === "checkbox" ? checked : value

        setForm((prev) => ({
            ...prev,
            [name]: newValue,
        }))
    }

    // 전화번호에 - 하이픈 자동 추가
    const handlePhoneNumberChange = (e) => {
        // 숫자만 추출
        const rawValue = e.target.value.replace(/\D/g, "")

        let formatted = ""
        if (rawValue.length < 4) {
            formatted = rawValue
        } else if (rawValue.length < 7) {
            formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`
        } else if (rawValue.length <= 11) {
            formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`
        } else {
            formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7, 11)}`
        }

        setForm((prev) => ({
            ...prev,
            phoneNumber: formatted,
        }))
    }

    const validateInputs = () => {
        const { userId, password, verifyPassword, uname, phoneNumber, publicInfo } = form

        const userIdRegex = /^[a-zA-Z0-9]{4,20}$/
        const unameRegex = /^(?=.*[가-힣a-zA-Z])([가-힣a-zA-Z0-9]{1,20})$/
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-])[A-Za-z\d!@#$%^&*()_+=-]{8,20}$/
        const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/

        if (!userIdRegex.test(userId)) return "아이디는 영문 또는 숫자 4~20자여야 합니다."
        if (!unameRegex.test(uname)) return "이름은 한글 또는 영어 포함 20자이내여야 합니다."
        if (!passwordRegex.test(password)) return "비밀번호는 문자, 숫자, 특수문자 포함 8~20자여야 합니다."
        if (password !== verifyPassword) return "비밀번호가 일치하지 않습니다."
        if (!phoneRegex.test(phoneNumber)) return "전화번호는 010-1234-5678 형식이어야 합니다."
        if (!publicInfo) return "개인정보 수집 및 이용에 동의해야 합니다."
        if (!isVerified) return "휴대폰 인증을 완료해주세요."

        return null
    }

    const openVerifyModal = () => setVerifyModalOpen(true)
    const closeVerifyModal = () => setVerifyModalOpen(false)

    const handleVerificationSuccess = () => {
        setIsVerified(true)
        closeVerifyModal()
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
            const signupData = createBuyerSignupDTO(form) // form → DTO 변환

            // console.log("signupData: ", signupData)
            const res = await singup(signupData)
            // 회원가입 성공 시 모달 표시
            setModalMsg(res.message)
            setShowModal(true)
        } catch (err) {
            const msg = err?.response?.data?.message || "회원가입 중 오류가 발생했습니다."
            setErrorMessage(msg)
            console.error("회원 가입 실패", err)
        } finally{
            setIsLoading(false) // 성공/실패 관계없이 로딩 종료
        }
    }

    const closeResultModal = () => {
        setShowModal(false)
        navigate("/auth/signin")
    }

    return (
        <div className="p-4">
            <SignupBuyerComponent
                form={form}
                isLoading={isLoading}
                errorMessage={errorMessage}
                handleChange={handleChange}
                handlePhoneNumberChange={handlePhoneNumberChange}
                handleSubmit={handleSubmit}
                openVerifyModal={openVerifyModal}
                isVerified={isVerified}
            />
            {isVerifyModalOpen  && (
                <VerifyModal
                    phoneNumber={form.phoneNumber}
                    type={"SIGNUP"}
                    onClose={closeVerifyModal}
                    onSuccess={handleVerificationSuccess}
                />
            )}
            {/* 모달 */}
            <ResultModal show={showModal} closeResultModal={closeResultModal} msg={modalMsg} />
        </div>
    );
}

export default SignupBuyerPage;