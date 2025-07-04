import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSellerOrderStatus } from "../../../api/sellerOrderApi";
import { Link } from "react-router";
import { useParams } from "react-router";

// 주문 상태 옵션 상수 (label을 한국어로 변경)
const ORDER_STATUS_OPTIONS = [
    { value: "RESERVATION_PENDING", label: "예약 확인 중" },
    { value: "RESERVATION_CONFIRMED", label: "예약 확정" },
    { value: "PREPARING", label: "준비 중" },
    { value: "READY_FOR_PICKUP", label: "픽업 준비 완료" },
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
        const newStatusValue = e.target.value; // 변경될 Enum 값 (예: "RESERVATION_CONFIRMED")

        // newStatusValue에 해당하는 한국어 label 찾기
        const newStatusLabel = ORDER_STATUS_OPTIONS.find(
            option => option.value === newStatusValue
        )?.label || newStatusValue; // 찾지 못하면 그냥 value 표시

        // confirm 메시지를 한국어로 변경하고, 변경될 상태의 한국어 label 사용
        const confirmChange = confirm(`정말로 상태를 '${newStatusLabel}'(으)로 변경하시겠습니까?`); //
        if (!confirmChange) return;

        updateStatusMutation.mutate({ orderId: order.orderId, status: newStatusValue });
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
                    {/* ⭐⭐ 기존 주문 금액 (할인 전) ⭐⭐ */}
                    <p className="font-bold text-xl text-gray-700">{formatPrice(order.orderTotalPrice)}</p>

                    {/* ⭐⭐ 포인트 할인 금액 (0보다 클 때만 표시) ⭐⭐ */}
                    {order.discountAmount > 0 && (
                        <p className="text-sm text-red-600 font-semibold">
                            할인: -{formatPrice(order.discountAmount)}
                        </p>
                    )}

                    {/* ⭐⭐ 최종 결제 금액 ⭐⭐ */}
                    <p className="font-bold text-xl text-blue-800 mt-1">
                        최종: {formatPrice(order.finalPaymentAmount)}
                    </p>

                    <select
                        value={order.status}
                        onChange={handleStatusChange}
                        disabled={
                            updateStatusMutation.isPending ||
                            // Enum 값과 직접 비교하도록 수정
                            order.status === "PICKUP_COMPLETED" ||
                            order.status === "RESERVATION_CANCELLED" ||
                            order.status === "NO_SHOW"
                        }
                        className="mt-2 p-2 border rounded-md disabled:bg-gray-100 disabled:text-gray-500"
                    >
                        <option disabled value="">-- 상태 선택 --</option>
                        {ORDER_STATUS_OPTIONS.map((option) => (
                            // label을 UI에 표시
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
                            <img src={order.thumbnailImageUrl} alt={order.cname}
                                 className="w-full h-full object-cover rounded-full"/>
                        </div>
                    )}
                    <div>
                        <p className="text-sm text-gray-700">수량: {order.productCnt}개</p>
                        {/* 단가 계산 시 orderTotalPrice가 0이 아닐 때만 나누기 수행 */}
                        <p className="text-sm text-gray-700">단가: {order.orderTotalPrice && order.productCnt ? formatPrice(order.orderTotalPrice / order.productCnt) : formatPrice(0)}</p>
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