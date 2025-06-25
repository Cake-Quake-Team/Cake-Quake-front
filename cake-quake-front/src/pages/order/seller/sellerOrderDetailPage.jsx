import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSellerOrderDetail, updateSellerOrderStatus } from "../../../api/sellerOrderApi.jsx";
import SellerOrderDetail from "../../../components/order/seller/sellerOrderDetail.jsx";

const SellerOrderDetailPage = () => {
    // ✅ shopId와 orderId를 모두 useParams로 가져옴
    const { shopId, orderId } = useParams();
    const queryClient = useQueryClient();

    const { data: order, isLoading, error } = useQuery({ // ✅ error 상태 추가
        queryKey: ["sellerOrderDetail", shopId, orderId], // ✅ queryKey에 shopId 포함
        queryFn: async () => {
            // ✅ shopId와 orderId가 유효할 때만 API 호출
            if (!shopId || !orderId) {
                // shopId 또는 orderId가 없으면 쿼리 실행을 막고 에러를 던짐
                throw new Error("가게 ID 또는 주문 ID가 유효하지 않습니다.");
            }
            // ✅ getSellerOrderDetail 호출 시 shopId와 orderId를 모두 전달
            return getSellerOrderDetail(shopId, orderId);
        },
        enabled: !!shopId && !!orderId, // ✅ shopId와 orderId가 있을 때만 쿼리 활성화
    });

    const mutation = useMutation({
        // ✅ mutationFn에서 shopId, orderId, status를 받아서 updateSellerOrderStatus에 전달
        mutationFn: ({ orderId: id, status }) => updateSellerOrderStatus(shopId, id, status), // shopId를 여기에 전달
        onSuccess: () => {
            queryClient.invalidateQueries(["sellerOrderDetail", shopId, orderId]); // ✅ queryKey에 shopId 포함
        },
        onError: (mutationError) => { // ✅ 에러 객체 이름을 명확히
            console.error("❌ 주문 상태 변경 실패:", mutationError);
            alert(`상태 변경 중 오류가 발생했습니다: ${mutationError.response?.data?.message || mutationError.message}`);
        }
    });

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        // ✅ mutation.mutate 호출 시 orderId와 status를 정확히 전달
        mutation.mutate({ orderId: orderId, status: newStatus });
    };

    // 로딩 상태 처리
    if (isLoading) return <p>주문 정보를 불러오는 중...</p>;

    // 에러 상태 처리
    if (error) return <p className="text-red-500">오류가 발생했습니다: {error.message}</p>;

    // 데이터가 아직 없으면 (로딩 완료 & 에러 없음에도)
    if (!order) return <p>주문 정보를 찾을 수 없습니다.</p>;


    return (
        <div className="max-w-3xl mx-auto p-4">
            <SellerOrderDetail
                order={order}
                onStatusChange={handleStatusChange}
                isUpdating={mutation.isPending} // ✅ isPending으로 변경
            />
        </div>
    );
};

export default SellerOrderDetailPage;