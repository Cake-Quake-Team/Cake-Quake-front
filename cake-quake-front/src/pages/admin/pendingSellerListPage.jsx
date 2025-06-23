import { useSearchParams } from "react-router";
import { getpendingSellerList } from "../../api/adminApi";
import PendingSellerListComponent from "../../components/member/admin/pendingSellerListComponent";


const PendingSellerListPage = () => {

    const [searchParams] = useSearchParams()
    const pageStr = searchParams.get("page") || "1"
    const sizeStr = searchParams.get("size") || "10"
    // 검색 처리 추가 필요

    try {
        const {isFetching, isError, error} = useQuery({
            queryKey: ['pendingSellerList', pageStr, sizeStr],
            queryFn: async() => {
                console.log("---------------query run-------------------")
                // await new Promise(resolve => setTimeout(resolve, 2000)); // 로딩 확인용
    
                const res = await getpendingSellerList(pageStr, sizeStr)
                return res
            },
            staleTime: 10 * 60 * 1000, // 적절한가
            retry: false
        })
        
    } catch (error) {
        
    }

    return (
        <PendingSellerListComponent />
    )
}

export default PendingSellerListPage;