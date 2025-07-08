import { useNavigate, useParams } from "react-router"
import { getBuyerProfile, modifyBuyerAlarmSettings } from "../../../api/memberApi"
import { useAuth } from "../../../store/AuthContext"
import useMemberStore from "../../../store/useMemberStore"
import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import BuyerProfileDetailsAlarmComponent from "../../../components/member/buyer/buyerProfileDetailsAlarmComponent"
import ResultModal from "../../../components/common/resultModal"

const BuyerProfileDetailsAlarmPage = () => {

    // 스크롤 제일 위로 이동
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const navigate = useNavigate()
    const { user } = useAuth() // 로그인한 유저 정보
    const { uid } = useParams()
    const { profile, setProfile, clearProfile } = useMemberStore()
    const queryClient = useQueryClient()

    const [form, setForm] = useState({
        allAlarm: false
    })

    // profile이 없을 경우 API 호출
    const { data: buyerData, isLoading, isError, error } = useQuery({
        queryKey: ['buyerProfile'],
        queryFn: async () => {
            console.log("---------------query run 판매자 마이페이지 조회-------------------")
            const res = await getBuyerProfile()
            return res.data
        },
        enabled: !profile && !!user && !!user.userId,
        staleTime: 10 * 60 * 1000,
        retry: false
    })

    // buyerData 있을 때 상태 업데이트
    useEffect(() => {
        if (buyerData) {
            setProfile(buyerData)
            setForm({
                allAlarm: buyerData.alarm
            })
        }
    }, [buyerData, setProfile])

    const [showModal, setShowModal] = useState(false)
    const [modalMsg, setModalMsg] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [buttonLoading, setButtonLoading] = useState(false)

    const handleChange = (e) => {
        const { name, checked } = e.target
        setForm(prev => ({
            ...prev,
            [name]: checked,
        }))
    }

    // 수정 완료 핸들러
    const handleModify = async (e) => {
        e.preventDefault()
        setErrorMessage("")

        // console.log(form)
        try {
            setButtonLoading(true)
            
            const res = await modifyBuyerAlarmSettings(uid, form)

            setModalMsg(res.message)
            setShowModal(true)
        } catch (error) {
            console.error("수정 오류:", error)
            const msg = err?.response?.data?.message || "알람 설정 변경에 실패했습니다."
            setErrorMessage(msg)
        } finally {
            setButtonLoading(false)
        }
    }

    const closeResultModal = () => {
        setShowModal(false)
        // React Query 캐시 무효화
        queryClient.invalidateQueries(['buyerProfile'])
        clearProfile() // store 상태 초기화
        navigate("/buyer/profile/details")
    }


    return(
        <div>
            {isLoading && <LoadingSpinner />} {/* 로딩 스피너 */}
            {isError && <div className="text-red-500">오류 발생: {error.message}</div>} {/* 오류 메시지 */}
            {!isLoading && !isError && buyerData && (
                <BuyerProfileDetailsAlarmComponent
                    buyerProfile={profile}
                    form={form}
                    buttonLoading={buttonLoading}
                    errorMessage={errorMessage}
                    handleChange={handleChange}
                    handleModify={handleModify}
                />
            )}
            {/* 모달 */}
            <ResultModal show={showModal} closeResultModal={closeResultModal} msg={modalMsg} />
        </div>
    )
}

export default BuyerProfileDetailsAlarmPage;