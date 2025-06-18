import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "../../../api/sellerOrderApi";

const SellerOrderItemPage = ({ order }) => {
    const queryClient = useQueryClient();

    const updateStatusMutation = useMutation({
        mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
        onSuccess: () => {
            // 주문 목록 쿼리를 무효화하여 화면을 새로고침
            queryClient.invalidateQueries(["shopOrders"]);
        },
        onError: (error) => {
            alert(`상태 변경 실패: ${error.response.data.message}`);
        }
    });

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        updateStatusMutation.mutate({ orderId: order.orderId, status: newStatus });
    };

    // 서버에서 받은 pickup_datetime을 보기 좋게 포맷
    const formattedPickupTime = new Date(order.pickupDatetime).toLocaleString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500">주문 번호: {order.orderId}</p>
                    <p className="font-bold text-lg">주문자: {order.ordererName}</p>
                    <p className="text-gray-700">연락처: {order.ordererPhone}</p>
                    <p className="text-blue-600 font-semibold mt-1">픽업 시간: {formattedPickupTime}</p>
                </div>
                <div className="flex flex-col items-end">
                    <p className="font-bold text-xl">{order.totalPrice.toLocaleString()}원</p>
                    <select
                        value={order.status}
                        onChange={handleStatusChange}
                        className="mt-2 p-2 border rounded-md"
                    >
                        <option value="CONFIRMED">신규 주문</option>
                        <option value="PREPARING">제작 중</option>
                        <option value="READY_FOR_PICKUP">픽업 대기</option>
                        <option value="COMPLETED">픽업 완료</option>
                        <option value="CANCELLED">주문 취소</option>
                    </select>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold">주문 상품</h4>
                {order.orderItems.map(item => (
                    <div key={item.orderItemId} className="text-sm mt-1">
                        - {item.cakeName} (수량: {item.quantity})
                        <p className="pl-4 text-xs text-gray-500">레터링: "{item.customOptions.lettering}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerOrderItemPage;