import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSellerOrderStatus } from "../../../api/sellerOrderApi";
import { Link } from "react-router";
import { useParams } from "react-router";

// 주문 상태 옵션 상수
const ORDER_STATUS_OPTIONS = [
    { value: "RESERVATION_PENDING", label: "예약 확인 중" },
    { value: "RESERVATION_CONFIRMED", label: "예약 확정" },
    { value: "PREPARING", label: "준비 중" }, // DTO에 있다면 추가
    { value: "READY_FOR_PICKUP", label: "픽업 준비 완료" }, // DTO에 있다면 추가
    { value: "PICKUP_COMPLETED", label: "픽업 완료" },
    { value: "RESERVATION_CANCELLED", label: "주문 취소" },
    { value: "NO_SHOW", label: "노쇼" },
];

const formatPrice = (price) => `${price?.toLocaleString()}원`;

const SellerOrderItem = ({ order }) => {
    const queryClient = useQueryClient();
    const { shopId } = useParams(); // shopId를 URL 파라미터에서 가져옵니다.

    const updateStatusMutation = useMutation({
        mutationFn: ({ orderId, status }) => updateSellerOrderStatus(shopId, orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries(["sellerOrders", shopId]);
        },
        onError: (error) => {
            alert(`상태 변경 실패: ${error.response?.data?.message || "오류 발생"}`);
        }
    });

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;

        const confirmChange = confirm(`정말로 상태를 '${newStatus}'로 변경하시겠습니까?`);
        if (!confirmChange) return;

        updateStatusMutation.mutate({ orderId: order.orderId, status: newStatus });
    };

    const formattedPickupDateTime = `${order.pickupDate} ${order.pickupTime}`;

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500">주문 번호: {order.orderNumber}</p>
                    <p className="font-bold text-lg">상품명: {order.cname} ({order.productCnt}개)</p>
                    <p className="text-blue-600 font-semibold mt-1">픽업 시간: {formattedPickupDateTime}</p>
                </div>
                <div className="flex flex-col items-end">
                    <p className="font-bold text-xl">{formatPrice(order.orderTotalPrice)}</p>
                    <select
                        value={order.status}
                        onChange={handleStatusChange}
                        disabled={
                            updateStatusMutation.isPending ||
                            order.status === "픽업 완료" ||
                            order.status === "주문 취소" ||
                            order.status === "노쇼"
                        }
                        className="mt-2 p-2 border rounded-md disabled:bg-gray-100 disabled:text-gray-500"
                    >
                        <option disabled value="">-- 상태 선택 --</option>
                        {ORDER_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    {updateStatusMutation.isPending && (
                        <p className="text-sm text-blue-500 mt-1">상태 변경 중...</p>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold">주문 상품: {order.cname}</h4>
                <div className="flex items-center mt-2">
                    {order.thumbnailImageUrl && (
                        <div className="w-16 h-16 mr-3 flex-shrink-0">
                            <img src={order.thumbnailImageUrl} alt={order.cname} className="w-full h-full object-cover rounded-full" />
                        </div>
                    )}
                    <div>
                        <p className="text-sm text-gray-700">수량: {order.productCnt}개</p>
                        <p className="text-sm text-gray-700">단가: {formatPrice(order.orderTotalPrice / order.productCnt)}</p>
                    </div>
                </div>

                <div className="text-right mt-2">
                    <Link
                        to={`/shops/${shopId}/orders/${order.orderId}`}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                        주문 상세 보기
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SellerOrderItem;