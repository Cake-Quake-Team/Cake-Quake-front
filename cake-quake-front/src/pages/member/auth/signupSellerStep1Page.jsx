import { useState } from "react";
import { useNavigate } from "react-router";
import { sellerSignupStep1DTO } from "../../../dto/memberdto/signup.dto";
import SellerSignupStep1Component from "../../../components/member/auth/SignupSellerStep1Component";
import ResultModal from "../../../components/common/resultModal";
import { verifyBusiness } from "../../../api/memberApi";
import VerifyModal from "../../../components/member/modal/VerifyModal";
import { postSellerSignupStep1 } from "../../../api/memberApi";


const SignupSellersStep1Page = () => {

    const navigate = useNavigate()

    const [form, setForm] = useState({
        userId: "",
        uname: "",
        password: "",
        verifyPassword: "",
        phoneNumber: "",
        businessNumber: "",
        bossName: "",
        openingDate: "",
        shopName: "",
        joinType: 'basic',
        publicInfo: false,
        businessCertificate: "",
    })

    const [file, setFile] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [modalMsg, setModalMsg] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [modalType, setModalType] = useState(null)

    const [isVerified, setIsVerified] = useState(false) // 휴대전화 인증 여부
    const [isVerifyModalOpen, setVerifyModalOpen] = useState(false)
    const [isBusinessVerified, setIsBusinessVerified] = useState(false) // 사업자 조회 여부

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
        const { userId, password, verifyPassword, uname, phoneNumber, publicInfo, shopName, businessCertificate } = form

        const userIdRegex = /^[a-zA-Z0-9]{4,20}$/
        const unameRegex = /^(?=.*[가-힣a-zA-Z])([가-힣a-zA-Z0-9]{1,19})$/
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-])[A-Za-z\d!@#$%^&*()_+=-]{8,20}$/
        const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/
        
        if (!userIdRegex.test(userId)) return "아이디는 영문 또는 숫자 4~20자여야 합니다."
        if (!unameRegex.test(uname)) return "이름은 한글 또는 영어 포함 1~19자여야 합니다."
        if (!passwordRegex.test(password)) return "비밀번호는 문자, 숫자, 특수문자 포함 8~20자여야 합니다."
        if (password !== verifyPassword) return "비밀번호가 일치하지 않습니다."
        if (!phoneRegex.test(phoneNumber)) return "전화번호는 010-1234-5678 형식이어야 합니다."
        if (!publicInfo) return "개인정보 수집 및 이용에 동의해야 합니다."
        if (!isVerified) return "휴대폰 인증을 완료해주세요."
        if (!shopName || shopName.length > 50) return "상호명은 1~50자 사이여야 합니다."
        if (!businessCertificate) return "사업자 등록증 파일을 첨부해주세요."

        return null
    }

    /* 휴대전화 인증 모달 */
    const openVerifyModal = () => setVerifyModalOpen(true)
    const closeVerifyModal = () => setVerifyModalOpen(false)

    const handleVerificationSuccess = () => {
        setIsVerified(true)
        closeVerifyModal()
    }

    /* 사업자 등록 진위여부 결과 모달 */
    const handleVerifyBusiness = async () => {
        const { businessNumber, bossName, openingDate } = form

        const businessNumberRegex = /^\d{10}$/;
        const bossNameRegex = /^[가-힣a-zA-Z]+$/;
        const openingDateRegex = /^\d{8}$/; // YYYYMMDD

        // 기본 유효성 검사 (빈 값 체크)
        if (!businessNumber || !bossName || !openingDate) {
            setErrorMessage("사업자 등록번호, 대표자명, 개업일자를 모두 입력해주세요.")
            return
        }
        if (!businessNumberRegex.test(businessNumber)) return "사업자 등록번호는 10자리 숫자여야 합니다."
        if (!bossNameRegex.test(bossName)) return "대표자명은 한글 또는 영문만 입력 가능합니다."
        if (!openingDateRegex.test(openingDate)) return "개업일자는 YYYYMMDD 형식의 8자리 숫자여야 합니다."

        const businessData = {
            businessNumber,
            bossName,
            openingDate
        }

        try {
            const res = await verifyBusiness(businessData)
            console.log("businessData: ", businessData)

            // 성공 응답 처리
            setModalMsg(res.message)
            setModalType("businessCheck")
            setShowModal(true)
            setIsBusinessVerified(true)
        } catch (error) {
            const msg = error?.response?.data?.message || "사업자 진위여부 확인 중 오류가 발생했습니다."
            setErrorMessage(msg)
            console.error("사업자 진위여부 확인 실패", error)
        }
    }

    const handleBusinessFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setForm((prev) => ({
            ...prev,
            businessCertificate: file,
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

        //  파일 전송을 위해 form을 formData로 변환.
        const formData = new FormData()

        formData.append("userId", form.userId)
        formData.append("password", form.password)
        formData.append("uname", form.uname)
        formData.append("phoneNumber", form.phoneNumber)
        formData.append("businessNumber", form.businessNumber)
        formData.append("bossName", form.bossName)
        formData.append("openingDate", form.openingDate)
        formData.append("shopName", form.shopName)
        formData.append("joinType", form.joinType ?? "basic")

        if (form.businessCertificate) {
            formData.append("businessCertificate", form.businessCertificate)
        }

        try {

            console.log("formData: ", formData)
            const res = await postSellerSignupStep1(formData)

            // 회원가입 성공 시 모달 표시
            setModalMsg(res.message)
            setModalType("signupSuccess")
            setShowModal(true)
        } catch (err) {
            const msg = err?.response?.data?.message || "회원가입 중 오류가 발생했습니다."
            setErrorMessage(msg)
            console.error("회원 가입 실패", err)
        }
    }

    const closeResultModal = () => {
        setShowModal(false)

        if (modalType === "signupSuccess") {
            navigate("/auth/signin")
        }

        // businessCheck일 경우에는 페이지 이동 없음
        setModalType(null); // 상태 초기화
    }

    return (
        <div>
            <SellerSignupStep1Component
                form={form}
                errorMessage={errorMessage}
                handleChange={handleChange}
                handlePhoneNumberChange={handlePhoneNumberChange}
                handleVerifyBusiness={handleVerifyBusiness}
                handleBusinessFileChange={handleBusinessFileChange}
                handleSubmit={handleSubmit}
                openVerifyModal={openVerifyModal}
                isVerified={isVerified}
                isBusinessVerified={isBusinessVerified}
            />
            {isVerifyModalOpen  && (
                <VerifyModal
                    phoneNumber={form.phoneNumber}
                    type={"SIGNUP"}
                    onClose={closeVerifyModal}
                    onSuccess={handleVerificationSuccess}
                />
            )}
            <ResultModal show={showModal} closeResultModal={closeResultModal} msg={modalMsg} />
        </div>
    );

}

export default SignupSellersStep1Page;