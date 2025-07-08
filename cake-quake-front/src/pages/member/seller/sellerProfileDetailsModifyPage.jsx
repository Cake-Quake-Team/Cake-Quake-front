import { useNavigate, useParams } from "react-router";
import SellerProfileDetailsModifyComponent from "../../../components/member/seller/sellerProfileDetailsModifyComponent";
import useMemberStore from "../../../store/useMemberStore";
import { useEffect, useRef, useState } from "react";
import { getSellerProfile, modifySellerProfile } from "../../../api/memberApi";
import { useAuth } from "../../../store/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../../components/common/loadingSpinner";
import VerifyModal from "../../../components/member/modal/VerifyModal";
import ResultModal from "../../../components/common/resultModal";



const SellerProfileDetailsModifyPage = () => {

    // 스크롤 제일 위로 이동
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const navigate = useNavigate()
    const { user } = useAuth() // 로그인한 유저 정보
    const { uid } = useParams()
    const { profile, setProfile, clearProfile } = useMemberStore()
    const queryClient = useQueryClient()

    const [initialPhoneNumber, setInitialPhoneNumber] = useState("") // 최초 전화번호

    const [form, setForm] = useState({
        uname: "",
        phoneNumber: "",
    })

    // profile이 없을 경우 API 호출
    const { data: sellerData, isLoading, isError, error } = useQuery({
        queryKey: ['sellerProfile'],
        queryFn: async () => {
            console.log("---------------query run 판매자 마이페이지 조회-------------------")
            const res = await getSellerProfile()
            return res.data
        },
        enabled: !profile && !!user && !!user.userId,
        staleTime: 10 * 60 * 1000,
        retry: false
    })

    // sellerData가 있을 때 상태 업데이트
    useEffect(() => {
        if (sellerData) {
            setProfile(sellerData)
            setForm({
                uname: sellerData.uname,
                phoneNumber: sellerData.phoneNumber
            })
            setInitialPhoneNumber(sellerData.phoneNumber) // 최초 전화번호 저장
        }
    }, [sellerData, setProfile])

    const [showModal, setShowModal] = useState(false)
    const [modalMsg, setModalMsg] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [buttonLoading, setButtonLoading] = useState(false)

    const [isVerified, setIsVerified] = useState(false) // 휴대전화 인증 여부
    const [isVerifyModalOpen, setVerifyModalOpen] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prevData) => ({
            ...prevData,
            [name]: value
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

    // 유효성 검사 때 에러가 나왔을 때 input 상자 포커스 용
    const inputRefs = {
        userId: useRef(null),
        uname: useRef(null),
        phoneNumber: useRef(null),
    }

    const validateInputs = () => {
        const { uname, phoneNumber } = form

        const unameRegex = /^(?=.*[가-힣a-zA-Z])([가-힣a-zA-Z0-9]{1,20})$/
        const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/
        
        if (!unameRegex.test(uname)) {
            inputRefs.uname.current?.focus()
            return "이름은 한글 또는 영어 포함 20자 이내여야 합니다."
        }
        if (!phoneRegex.test(phoneNumber)) {
            inputRefs.phoneNumber.current?.focus()
            return "전화번호는 010-XXX(X)-XXXX 형식이어야 합니다."
        } 
        // 전화번호가 변경된 경우에만 인증 여부 확인
        if (phoneNumber !== initialPhoneNumber && !isVerified) {
            inputRefs.phoneNumber.current?.focus()
            return "변경된 전화번호에 대한 인증을 완료해주세요."
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


    // 수정 완료 핸들러
    const handleModify = async (e) => {
        e.preventDefault()
        setErrorMessage("")

        const error = validateInputs()
        if (error) {
            setErrorMessage(error)
            return
        }

        // console.log(form)
        try {
            setButtonLoading(true)
            
            const res = await modifySellerProfile(uid, form)

            setModalMsg(res.message)
            setShowModal(true)
        } catch (error) {
            console.error("수정 오류:", error)
            const msg = err?.response?.data?.message || "프로필 수정에 실패했습니다."
            setErrorMessage(msg)
        } finally {
            setButtonLoading(false)
        }
    }

    const closeResultModal = () => {
        setShowModal(false)
        // page에 수정 반영을 위해 React Query 캐시 무효화
        queryClient.invalidateQueries(['buyerProfile'])
        clearProfile() // store 상태 초기화
        navigate("/seller/profile/details")
    }
    

    return(
        <div>
            {isLoading && <LoadingSpinner />} {/* 로딩 스피너 */}
            {isError && <div className="text-red-500">오류 발생: {error.message}</div>} {/* 오류 메시지 */}
            {!isLoading && !isError && sellerData && (
                <SellerProfileDetailsModifyComponent
                    sellerProfile={profile}
                    form={form}
                    buttonLoading={buttonLoading}
                    errorMessage={errorMessage}
                    handleChange={handleChange}
                    handlePhoneNumberChange={handlePhoneNumberChange}
                    handleModify={handleModify}
                    openVerifyModal={openVerifyModal}
                    isVerified={isVerified}
                    inputRefs={inputRefs}
                />
            )}
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
    )

}

export default SellerProfileDetailsModifyPage;