import { useSearchParams } from "react-router";
import { approvePendingSeller, getpendingSellerList } from "../../api/adminApi";
import PendingSellerListComponent from "../../components/member/admin/pendingSellerListComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/loadingSpinner";


const PendingSellerListPage = () => {

    const [searchParams] = useSearchParams()
    const pageStr = searchParams.get("page") || "1"
    const sizeStr = searchParams.get("size") || "10"
    // 검색 처리 추가 필요(type, keyword로 사용 가능)

    const queryClient = useQueryClient()

    // 승인 mutation
    const approveMutation = useMutation({
        mutationFn: approvePendingSeller,
        onSuccess: () => {
            alert("판매자 승인이 완료되었습니다.")
            // 목록 새로고침
            queryClient.invalidateQueries(['pendingSellerList', pageStr, sizeStr])
        },
        onError: (err) => {
            alert("승인 중 오류가 발생했습니다.")
            console.error("승인 오류:", err)
        }
    })
 
    // 리스트 호출
    const query = useQuery({
        queryKey: ['pendingSellerList', pageStr, sizeStr],
        queryFn: async() => {
            console.log("---------------query run-------------------")
            // await new Promise(resolve => setTimeout(resolve, 2000)) // 로딩 확인용

            try {
                const res = await getpendingSellerList(pageStr, sizeStr)
                if (!res || !res.data) {
                    // 데이터가 없을 경우 빈 객체 반환
                    return { content: [], hasNext: false, totalCount: 0 }
                }
                return res.data// 정상적으로 데이터를 반환
            } catch (error) {
                console.error("API 호출 오류:", error)
                // 오류 발생 시 빈 객체 반환
                return { content: [], hasNext: false, totalCount: 0 }
            }
        },
        staleTime: 10 * 60 * 1000, // 적절한가
        retry: false
    })
   
    const { isFetching, data, error } = query;
    console.log("page data: ", data)

    // 승인 버튼 클릭 핸들러
    const handleApprove = (tempSellerId) => {
        approveMutation.mutate(tempSellerId)
    }

    return (
        <div>
            {isFetching && <LoadingSpinner />} {/* 로딩 스피너 */}
            {error && <div className="text-red-500">오류 발생: {error.message}</div>} {/* 오류 메시지 */}
            {!isFetching && !error && data && (
                <PendingSellerListComponent
                    data={data}
                    isFetching={isFetching}
                    error={error}
                    handleApprove={handleApprove}
                />
            )}
        </div>
    )
}

export default PendingSellerListPage;