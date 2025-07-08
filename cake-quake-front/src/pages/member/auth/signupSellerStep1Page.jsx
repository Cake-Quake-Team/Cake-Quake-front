import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import ResultModal from "../../../components/common/resultModal";
import VerifyModal from "../../../components/member/modal/VerifyModal";
import SellerSignupStep1Component from "../../../components/member/auth/signupSellerStep1Component";
import { verifyBusiness, postSellerSignupStep1 } from "../../../api/authApi";


const SignupSellersStep1Page = () => {

    // 스크롤 제일 위로 이동
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

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

    // 유효성 검사 때 에러가 나왔을 때 input 상자 포커스 용
    const inputRefs = {
        userId: useRef(null),
        uname: useRef(null),
        password: useRef(null),
        phoneNumber: useRef(null),
        businessNumber: useRef(null),
        shopName: useRef(null),
        isBusinessVerified: useRef(null),
        publicInfo: useRef(null),
        businessCertificate: useRef(null),
    }

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

    // 전화번호 입력 받을 때 '-' 하이픈 자동 추가
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
        const unameRegex = /^(?=.*[가-힣a-zA-Z])([가-힣a-zA-Z0-9]{1,20})$/
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-])[A-Za-z\d!@#$%^&*()_+=-]{8,20}$/
        const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/
        
        if (!userIdRegex.test(userId)) {
            inputRefs.userId.current?.focus()
            return "아이디는 영문 또는 숫자 4~20자여야 합니다."
        }
        if (!unameRegex.test(uname)) {
            inputRefs.uname.current?.focus()
            return "이름은 한글 또는 영어 포함 20자 이내여야 합니다."
        } 
        if (!passwordRegex.test(password)) {
            inputRefs.password.current?.focus()
            return "비밀번호는 문자, 숫자, 특수문자 포함 8~20자여야 합니다."
        } 
        if (password !== verifyPassword) return "비밀번호가 일치하지 않습니다."
        if (!phoneRegex.test(phoneNumber)) {
            inputRefs.phoneNumber.current?.focus()
            return "전화번호는 010-XXXX-XXXX 형식이어야 합니다."
        } 
        if (!publicInfo) return "개인정보 수집 및 이용에 동의해야 합니다."
        if (!isVerified) {
            inputRefs.phoneNumber.current?.focus()
            return "휴대폰 인증을 완료해주세요."
        }
        if (!shopName || shopName.length > 50) {
            inputRefs.shopName.current?.focus()
            return "상호명은 1~50자 사이여야 합니다."
        }
        if (!isBusinessVerified) {
            inputRefs.isBusinessVerified.current?.focus()
            return "사업자 등록 조회가 필요합니다."
        }
        if (!businessCertificate) {
            inputRefs.businessCertificate.current?.focus()
            return "사업자 등록증 파일을 첨부해주세요."
        }
        if (!publicInfo) {
            inputRefs.publicInfo.current?.focus()
            return "개인정보 수집 및 이용에 동의해야 합니다."
        }

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
        if (!businessNumberRegex.test(businessNumber)) {
            setErrorMessage("사업자 등록번호는 '-', 공백 없이 10자리 숫자여야 합니다.")
            return
        }
        if (!bossNameRegex.test(bossName)) {
            setErrorMessage("대표자명은 한글 또는 영문만 입력 가능합니다.")
            return
        }
        if (!openingDateRegex.test(openingDate)) {
            setErrorMessage("개업일자는 YYYYMMDD 형식의 8자리 숫자여야 합니다.")
            return
        }

        const businessData = {
            businessNumber,
            bossName,
            openingDate
        }

        try {
            setIsLoading(true)
            const res = await verifyBusiness(businessData)
            // console.log("businessData: ", businessData)

            if (res.success) {
                // 진위여부 확인 성공
                setModalMsg(res.message || "사업자 등록 정보가 확인되었습니다.")
                setModalType("businessCheck")
                setShowModal(true)
                setIsBusinessVerified(true)
            } else {
                // 확인 실패: 사용자에게 안내
                setModalMsg("확인 실패: 사업자 등록 정보를 다시 확인해 주세요.")
                setModalType("businessCheckFailed")
                setShowModal(true)
                setIsBusinessVerified(false) // 이전 상태를 초기화
            }
        } catch (error) {
            const msg = error?.response?.data?.message || "사업자 진위여부 확인 중 오류가 발생했습니다."
            setErrorMessage(msg)
            console.error("사업자 진위여부 확인 실패", error)
        } finally {
            setIsLoading(false)
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
            setIsLoading(true)
            // console.log("FormData 내부 확인:")
            // formData.forEach((value, key) => {
            //     console.log(`${key}:`, value)
            // })
            const res = await postSellerSignupStep1(formData)

            sessionStorage.setItem("tempSellerId", res.data) // 서버 응답에서 받은 tempSellerId 세션 스토리지에 저장.

            // 회원가입 1단계 성공 시 모달 표시
            setModalMsg(res.message)
            setModalType("signupSuccess")
            setShowModal(true)
        } catch (err) {
            const msg = err?.response?.data?.message || "회원가입 중 오류가 발생했습니다."
            setErrorMessage(msg)
            console.error("회원 가입 실패", err)
        } finally {
            setIsLoading(false)
        }
    }

    const closeResultModal = () => {
        setShowModal(false)

        if (modalType === "signupSuccess") {
            navigate("/auth/signup/seller-step2")
        } else if (modalType === "businessCheckFailed") {
            // 실패 시 포커스를 사업자 번호 입력으로 이동하게
            inputRefs.businessNumber.current?.focus()
        }
        // businessCheck일 경우에는 페이지 이동 없음
        setModalType(null); // 상태 초기화
    }

    return (
        <div>
            <SellerSignupStep1Component
                form={form}
                isLoading={isLoading}
                errorMessage={errorMessage}
                handleChange={handleChange}
                handlePhoneNumberChange={handlePhoneNumberChange}
                handleVerifyBusiness={handleVerifyBusiness}
                handleBusinessFileChange={handleBusinessFileChange}
                handleSubmit={handleSubmit}
                openVerifyModal={openVerifyModal}
                isVerified={isVerified}
                isBusinessVerified={isBusinessVerified}
                inputRefs={inputRefs}
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