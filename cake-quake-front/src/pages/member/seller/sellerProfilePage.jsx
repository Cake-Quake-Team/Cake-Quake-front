import SellerProfileComponent from "../../../components/member/seller/sellerProfileComponent";
import { getSellerProfile } from "../../../api/memberApi";
import { useAuth } from "../../../store/AuthContext";
import { useQuery } from '@tanstack/react-query';
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useMemberStore from "../../../store/useMemberStore";
import LoadingSpinner from "../../../components/common/loadingSpinner";


const SellerProfilePage = () => {

    // 스크롤 제일 위로 이동
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { user } = useAuth() // 로그인한 유저 정보
    const navigate = useNavigate()
    const { setSellerProfile } = useMemberStore()

    const {data: sellerData, isLoading, isError, error} = useQuery({
        queryKey: ['sellerProfile'],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 로딩 확인용

            console.log("---------------query run-------------------")

            const res = await getSellerProfile()
            return res.data // ApiResponseDTO → data
        },
        enabled: !!user && !!user.userId,
        staleTime: 10 * 60 * 1000,
        retry: false // 기본은 3회 재 호출
    })

    useEffect(() => {
        if (sellerData) {
            setSellerProfile(sellerData) // zustand로 저장
            console.log("zustand에 sellerData 저장")
        }
    }, [sellerData])

    const handleModifyProfile = () => {
        navigate(`/seller/profile/modify/${sellerData.uid}`)
    }

    return (
        <div>
            {isLoading && <LoadingSpinner />} {/* 로딩 스피너 */}
            {isError && <div className="text-red-500">오류 발생: {error.message}</div>} {/* 오류 메시지 */}
            {!isLoading && !isError && sellerData && (
                <SellerProfileComponent
                    isLoading={isLoading}
                    errorMessage={isError ? "판매자 정보를 불러오는 데 실패했습니다." : ''}
                    sellerData={sellerData}
                    handleModifyProfile={handleModifyProfile}
                />
            )}
        </div>
    )

}

export default SellerProfilePage;