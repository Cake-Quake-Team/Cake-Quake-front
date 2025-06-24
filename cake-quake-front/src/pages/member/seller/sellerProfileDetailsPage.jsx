import SellerProfileDetailsComponent from "../../../components/member/seller/sellerProfileDetailsComponent";

import { useAuth } from "../../../store/AuthContext";
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useMemberStore from "../../../store/useMemberStore";
import LoadingSpinner from "../../../components/common/loadingSpinner";
import WithdrawConfirmModal from "../../../components/member/modal/withdrawConfirmModal";
import { getSellerProfile } from "../../../api/memberApi";



const SellerProfileDetailsPage = () => {

    // 스크롤 제일 위로 이동
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { user } = useAuth() // 로그인한 유저 정보
    const navigate = useNavigate()
    const { setProfile } = useMemberStore()

    const {data: sellerData, isLoading, isError, error} = useQuery({
        queryKey: ['sellerProfile'],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 로딩 확인용

            console.log("---------------query run getSellerProfile()-------------------")

            const res = await getSellerProfile()
            return res.data // ApiResponseDTO → data
        },
        enabled: !!user && !!user.userId,
        staleTime: 10 * 60 * 1000,
        retry: false // 기본은 3회 재 호출
    })

    useEffect(() => {
        if (sellerData) {
            setProfile(sellerData) // zustand로 저장
            console.log("zustand에 sellerData 저장")
        }
    }, [sellerData])

    // 회원 탈퇴 모달용
    const [isWithdrawConfirmModalOpen, setWithdrawConfirmModalOpen] = useState(false)

    // 정보 수정
    const handleModifyProfile = () => {
        navigate(`/seller/profile/details/modify/${sellerData.uid}`)
    }

    // 비밀번호 확인 후 탈퇴 처리 모달 불러오기
    const handleWithdraw = () => {
        setWithdrawConfirmModalOpen(true)
    }

    const closeWithdrawConfirmModal = () => {
        setWithdrawConfirmModalOpen(false)
    }

    return (
        <div>
            {isLoading && <LoadingSpinner />} {/* 로딩 스피너 */}
            {isError && <div className="text-red-500">오류 발생: {error.message}</div>} {/* 오류 메시지 */}
            {!isLoading && !isError && sellerData && (
                <SellerProfileDetailsComponent
                    isLoading={isLoading}
                    errorMessage={isError ? "판매자 정보를 불러오는 데 실패했습니다." : ''}
                    sellerData={sellerData}
                    handleModifyProfile={handleModifyProfile}
                    handleWithdraw={handleWithdraw}
                />
            )}
            {isWithdrawConfirmModalOpen  && (
                <WithdrawConfirmModal
                    isOpen={isWithdrawConfirmModalOpen}
                    onClose={closeWithdrawConfirmModal}
                />
            )}
        </div>
    )

}

export default SellerProfileDetailsPage;