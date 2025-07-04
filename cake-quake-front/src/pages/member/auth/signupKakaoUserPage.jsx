import { useEffect, useState } from "react";
import SignupKakaoUserComponent from "../../../components/member/auth/signupKakaoUserComponent";
import useKakaoSignupStore from "../../../store/useKakaoSignupStore";
import { useNavigate } from "react-router";
import { getSigninUserInfo, singupKakao } from "../../../api/authApi";
import VerifyModal from "../../../components/member/modal/VerifyModal";
import ResultModal from "../../../components/common/resultModal";
import { useAuth } from "../../../store/AuthContext";

// 카카오 유저 회원 가입 페이지
const SignupKakaoUserPage = () => {

    // 스크롤 제일 위로 이동
        useEffect(() => {
            window.scrollTo(0, 0)
        }, [])

    // 스토어에 저장된 정보 가져오기 = 카카오 유저 정보
    const { kakaoInfo, reset } = useKakaoSignupStore() // 이거 어디서 쓰지
    // console.log(kakaoInfo.email, kakaoInfo.nickname)
    
    const { setUser } = useAuth()

    const [isLoading, setIsLoading] = useState(false)
    
    const [form, setForm] = useState({
        userId: "",
        uname: "",
        phoneNumber: "",
        publicInfo: false,
        alarm: false,
        joinType: "kakao",
    })

    useEffect(() => {
        if (kakaoInfo) {
            setForm((prev) => ({
            ...prev,
            userId: kakaoInfo.email || "",
            uname: kakaoInfo.nickname || "",
            }))
        }
    }, [kakaoInfo])

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
        const { uname, phoneNumber, publicInfo } = form

        const unameRegex = /^(?=.*[가-힣a-zA-Z])([가-힣a-zA-Z0-9]{1,20})$/
        const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/

        if (!unameRegex.test(uname)) return "이름은 한글 또는 영어 포함 20자이내여야 합니다."
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

            const res = await singupKakao(form)

            // 토큰을 파싱한 사용자 정보를 받아와서 전역 상태로 저장
            const user = await getSigninUserInfo()
            setUser(user)

            // 회원가입 성공 시 모달 표시
            setModalMsg(res.message)
            setShowModal(true)
        } catch (err) {
            const msg = err?.response?.data?.message || "카카오 유저 회원가입 중 오류가 발생했습니다."
            setErrorMessage(msg)
            console.error("카카오 유저 회원 가입 실패", err)
        } finally{
            setIsLoading(false) // 성공/실패 관계없이 로딩 종료
        }
    }

    // 회원 가입 완료 후 결과 모달 창 -> 구매자 홈으로 이동.
    const closeResultModal = () => {
        setShowModal(false)
        navigate("/buyer")
    }

    return (
        <div>
            <SignupKakaoUserComponent
                form={form}
                handleChange={handleChange}
                handlePhoneNumberChange={handlePhoneNumberChange}
                handleSubmit={handleSubmit}
                errorMessage={errorMessage}
                openVerifyModal={openVerifyModal}
                isLoading={isLoading}
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

export default SignupKakaoUserPage;