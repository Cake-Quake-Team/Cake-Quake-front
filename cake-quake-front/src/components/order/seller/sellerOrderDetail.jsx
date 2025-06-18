import React from "react";

// 주문 상태 옵션 상수
const ORDER_STATUS_OPTIONS = [
    { value: "RESERVATION_PENDING", label: "예약 확인 중" },
    { value: "RESERVATION_CONFIRMED", label: "예약 확정" },
    { value: "RESERVATION_CANCELLED", label: "주문 취소" },
    { value: "NO_SHOW", label: "노쇼" },
    { value: "PICKUP_COMPLETED", label: "주문 픽업 완료" },
];

// 가격 포맷 함수
const formatPrice = (price) => `${price.toLocaleString()}원`;

const SellerOrderDetail = ({ order, onStatusChange, isUpdating }) => {
    if (!order) {
        return <div className="p-6">주문 정보를 찾을 수 없습니다.</div>;
    }

    const formattedPickupTime = new Date(order.pickupDatetime).toLocaleString("ko-KR");

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {/* 주문 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-6">
                <div>
                    <h2 className="font-semibold text-lg mb-2">주문자 정보</h2>
                    <p><strong>주문 번호:</strong> {order.orderId}</p>
                    <p><strong>주문자:</strong> {order.ordererName}</p>
                    <p><strong>연락처:</strong> {order.ordererPhone}</p>
                </div>
                <div>
                    <h2 className="font-semibold text-lg mb-2">픽업 및 결제 정보</h2>
                    <p><strong>픽업 시간:</strong> {formattedPickupTime}</p>
                    <p><strong>결제 금액:</strong> <span className="font-bold text-blue-600">{formatPrice(order.totalPrice)}</span></p>
                </div>
            </div>

            {/* 주문 상태 변경 */}
            <div className="mb-6">
                <label htmlFor="status-select" className="font-semibold text-lg mb-2 block">주문 상태 변경</label>
                <select
                    id="status-select"
                    value={order.status}
                    onChange={onStatusChange}
                    disabled={isUpdating}
                    className="w-full md:w-1/3 p-2 border rounded-md"
                >
                    <option disabled value="">-- 상태를 선택해주세요 --</option>
                    {ORDER_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                {isUpdating && <p className="text-sm text-blue-500 mt-1 animate-pulse">상태 변경 중...</p>}
            </div>

            {/* 주문 상품 목록 */}
            <div>
                <h2 className="font-semibold text-lg mb-2">주문 상품</h2>
                <div className="flex flex-col gap-2">
                    {order.orderItems.map((item) => (
                        <div key={item.orderItemId} className="p-3 bg-gray-50 rounded-md">
                            <p className="font-semibold">{item.cakeName} (x{item.quantity})</p>
                            {item.customOptions && Object.keys(item.customOptions).length > 0 && (
                                <div className="text-sm text-gray-600 pl-2">
                                    {Object.entries(item.customOptions).map(([key, value]) => (
                                        <p key={key}>- {key}: {value}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SellerOrderDetail;
