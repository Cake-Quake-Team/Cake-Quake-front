import BuyerProfileDetailsComponent from "../../../components/member/buyer/buyerProfileDetailsComponent";
import { useAuth } from "../../../store/AuthContext";
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useMemberStore from "../../../store/useMemberStore";
import LoadingSpinner from "../../../components/common/loadingSpinner";
import { getBuyerProfile } from "../../../api/memberApi";
import ResultModal from "../../../components/common/resultModal";
import WithdrawConfirmModal from "../../../components/member/modal/withdrawConfirmModal";


const BuyerProfileDetailsPage = () => {

    // 스크롤 제일 위로 이동
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { user } = useAuth() // 로그인한 유저 정보
    // console.log("---BuyerProfileDetailsPage---user: ", user.uid)
    const navigate = useNavigate()
    const { setProfile } = useMemberStore()

    const {data: buyerData, isLoading, isError, error} = useQuery({
        queryKey: ['buyerProfile'],
        queryFn: async () => {
            // await new Promise(resolve => setTimeout(resolve, 2000)); // 로딩 확인용
            console.log("---------------query run-------------------")

            const res = await getBuyerProfile()
            return res.data // ApiResponseDTO → data
        },
        enabled: !!user && !!user.userId,
        staleTime: 10 * 60 * 1000,
        retry: false // 기본은 3회 재 호출
    })

    useEffect(() => {
        if (buyerData) {
            setProfile(buyerData) // zustand로 저장
            console.log("zustand에 buyerData 저장")
        }
    }, [buyerData])

    // ResultModal용
    const [showModal, setShowModal] = useState(false)
    const [modalMsg, setModalMsg] = useState("")
    // 회원 탈퇴 모달용
    const [isWithdrawConfirmModalOpen, setWithdrawConfirmModalOpen] = useState(false)


    // 정보 수정
    const handleModifyProfile = () => {
        navigate(`/buyer/profile/details/modify/${buyerData.uid}`)
    }

    // 비밀번호 변경
    const handleChangePw = () => {
        navigate(`/auth/password`)
    }

    // 알람 설정
    const handleAlarmSettings = () => {
        navigate(`/buyer/profile/details/alarmsettings/${buyerData.uid}`)
    }

    // 비밀번호 확인 후 탈퇴 처리 모달 불러오기
    const handleWithdraw = () => {
        setWithdrawConfirmModalOpen(true)
    }

    const closeResultModal = () => {
        setShowModal(false)
        navigate("/buyer/profile/details")
    }

    const closeWithdrawConfirmModal = () => {
        setWithdrawConfirmModalOpen(false)
    }

    return (
        <div>
            {isLoading && <LoadingSpinner />} {/* 로딩 스피너 */}
            {isError && <div className="text-red-500">오류 발생: {error.message}</div>} {/* 오류 메시지 */}
            {!isLoading && !isError && buyerData && (
                <BuyerProfileDetailsComponent
                    isLoading={isLoading}
                    errorMessage={isError ? "판매자 정보를 불러오는 데 실패했습니다." : ''}
                    buyerData={buyerData}
                    handleModifyProfile={handleModifyProfile}
                    handleAlarmSettings={handleAlarmSettings}
                    handleWithdraw={handleWithdraw}
                    handleChangePw={handleChangePw}
                />
            )}
            {isWithdrawConfirmModalOpen  && (
                <WithdrawConfirmModal
                    isOpen={isWithdrawConfirmModalOpen}
                    onClose={closeWithdrawConfirmModal}
                />
            )}
            <ResultModal show={showModal} closeResultModal={closeResultModal} msg={modalMsg} />
        </div>
    )

}

export default BuyerProfileDetailsPage;