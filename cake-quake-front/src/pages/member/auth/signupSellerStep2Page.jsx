import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ResultModal from "../../../components/common/resultModal";
import SignupSellerStep2Component from "../../../components/member/auth/signupSellerStep2Component";
import PostcodePopup from "../../../components/common/postcodePopup";
import { postSellerSignupStep2 } from "../../../api/authApi";


const SignupSellersStep2Page = () => {

    // 스크롤 제일 위로 이동
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const [form, setForm] = useState({
        shopAddress: "",    // 도로명 + 건물명
        shopAddressDetail: "", // 상세 주소 (101동 1001호 등)
        shopPhoneNumber: "",
        openTime: "",
        closeTime: "",
        mainProductDescription: "",
        shopImage: null,
        sanitationCertificate: null,
    })

    const [tempSellerId, setTempSellerId] = useState(null)

    const [showModal, setShowModal] = useState(false)
    const [modalMsg, setModalMsg] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [modalType, setModalType] = useState(null)

    const [previewUrl, setPreviewUrl] = useState(null)

    useEffect(() => {
        const tempSellerId = sessionStorage.getItem("tempSellerId")

        if (!tempSellerId) {
            // alert("1단계 정보가 없습니다. 처음부터 다시 진행해 주세요.")
            setModalMsg("1단계 정보가 없습니다. 처음부터 다시 진행해 주세요.")
            setModalType("SellerIdNotFound")
            setShowModal(true)
            navigate("/auth/signup/seller-step1")
        }else {
            // console.log("tempSellerId: ", tempSellerId)
            setTempSellerId(tempSellerId)
        }
    }, []);

    const closeResultModal = () => {
        setShowModal(false)

        // 가입 완료 후 tempSellerId 초기화
        sessionStorage.removeItem("tempSellerId")
        console.log("tempSellerId 세션 삭제 확인: ", tempSellerId)

        if (modalType === "SellerIdNotFound") {
            navigate("/auth/signup/seller-step1")
        } else {
            navigate("/auth/signin")
        }
        
        setModalType(null); // 상태 초기화
    }

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target
        const newValue = type === "checkbox" ? checked : value

        setForm((prev) => ({
            ...prev,
            [name]: newValue,
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        const name = e.target.name

        if (!file) return

        // 첨부한 이미지 미리보기용
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)

        setForm((prev) => ({
            ...prev,
            [name]: file,
        }))
    }

    useEffect(() => {
        return () => {
            if (previewUrl) {
                // console.log("미리보기 URL 해제", previewUrl)
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    const validateInputs = () => {
        const { shopAddress, shopPhoneNumber, openTime, closeTime, mainProductDescription } = form

        const phoneRegex = /^\d{2,4}-\d{3,4}-\d{4}$/ // 02-123-4567, 051-1234-5678 등
        
        if (!shopAddress || shopAddress.length < 10 || shopAddress.length > 100)
            return "매장 주소는 10자 이상 100자 이하로 입력해주세요."
        if (shopPhoneNumber && !phoneRegex.test(shopPhoneNumber)) return "전화번호는 XX(X)-XXX(X)-XXXX 형식이어야 합니다."
        if (!openTime) return "영업 시작 시간을 선택해주세요."
        if (!closeTime) return "영업 종료 시간을 선택해주세요."
        if (!mainProductDescription || mainProductDescription.length < 10 || mainProductDescription.length > 200)
            return "주요 제품 설명은 10자 이상 200자 이하로 입력해주세요."

        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")

        const error = validateInputs()
        if (error) {
            setErrorMessage(error)
            return
        }

        // 파일 전송을 위해 form을 formData로 변환.
        const formData = new FormData()

        formData.append("tempSellerId", tempSellerId)
        formData.append("shopAddress", `${form.shopAddress} ${form.shopAddressDetail}`.trim())
        formData.append("shopPhoneNumber", form.shopPhoneNumber)
        formData.append("openTime", form.openTime)
        formData.append("closeTime", form.closeTime)
        formData.append("mainProductDescription", form.mainProductDescription)

        if (form.shopImage) {
            formData.append("shopImage", form.shopImage)
        }
        if (form.sanitationCertificate) {
            formData.append("sanitationCertificate", form.sanitationCertificate)
        }

        try {
            setIsLoading(true)
            // console.log("FormData 내부 확인:")
            // formData.forEach((value, key) => {
            //     console.log(`${key}:`, value)
            // })
            const res = await postSellerSignupStep2(formData)

            // 회원가입 성공 시 모달 표시
            setModalMsg(res.message)
            setModalType("signupSuccess")
            setShowModal(true)
        } catch (err) {
            const msg = err?.response?.data?.message || "회원가입 중 오류가 발생했습니다."
            setErrorMessage(msg)
            console.error("회원 가입 실패", err)
        } finally{
            setIsLoading(false) // 성공/실패 관계없이 로딩 종료
        }
    }
    

    return (
        <>
            <SignupSellerStep2Component
                form={form}
                isLoading={isLoading}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
                errorMessage={errorMessage}
                previewUrl={previewUrl}
                AddressPopupButton={ // 다음 주소 검색 서비스의 버튼 넘기기
                    <PostcodePopup
                        onComplete={(address) =>
                            setForm((prev) => ({
                                ...prev,
                                shopAddress: address,
                                shopAddressDetail: '', // 새 주소 선택 시 기존 상세주소 초기화
                            }))
                        }
                    />
                }
            />
            <ResultModal show={showModal} closeResultModal={closeResultModal} msg={modalMsg} />
        </>
    );
}

export default SignupSellersStep2Page;