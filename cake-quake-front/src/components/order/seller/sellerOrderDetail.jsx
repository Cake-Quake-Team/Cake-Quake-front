import React from "react";

const ORDER_STATUS_OPTIONS = [
    { value: "RESERVATION_PENDING", label: "예약 확인 중" },
    { value: "RESERVATION_CONFIRMED", label: "예약 확정" },
    { value: "PREPARING", label: "준비 중" }, // ✅ OrderStatus Enum에 있다면 추가
    { value: "READY_FOR_PICKUP", label: "픽업 준비 완료" }, // ✅ OrderStatus Enum에 있다면 추가
    { value: "PICKUP_COMPLETED", label: "픽업 완료" },
    { value: "RESERVATION_CANCELLED", label: "주문 취소" },
    { value: "NO_SHOW", label: "노쇼" },
];

// 가격 포맷 함수
const formatPrice = (price) => `${price?.toLocaleString()}원`;

const SellerOrderDetail = ({ order, onStatusChange, isUpdating }) => {
    if (!order) {
        return <div className="p-6">주문 정보를 찾을 수 없습니다.</div>;
    }

    // ✅ DTO의 pickupDate와 pickupTime 필드를 사용
    const formattedPickupDateTime = `${order.pickupDate} ${order.pickupTime}`;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {/* 주문 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-6">
                <div>
                    <h2 className="font-semibold text-lg mb-2">주문자 정보</h2>
                    {/* ✅ DTO의 buyer 객체 사용 (ordererName, ordererPhone 필드 없음) */}
                    <p><strong>주문 번호:</strong> {order.orderNumber}</p> {/* ✅ orderNumber 사용 */}
                    <p><strong>주문자:</strong> {order.buyer?.uname || '정보 없음'}</p> {/* ✅ order.buyer.uname 사용 */}
                    <p><strong>연락처:</strong> {order.buyer?.phoneNumber || '정보 없음'}
                    </p> {/* ✅ order.buyer.phoneNumber 사용 */}
                    <p className="text-gray-600">요청사항: <span className="font-medium">{order.orderNote || '없음'}</span></p>
                </div>
                <div>
                    <h2 className="font-semibold text-lg mb-2">픽업 및 결제 정보</h2>
                    {/* ✅ DTO의 pickupDate와 pickupTime 필드 사용 */}
                    <p><strong>픽업 시간:</strong> {formattedPickupDateTime}</p>
                    {/* ⭐⭐ 가격 정보 표시 추가 ⭐⭐ */}
                    <p><strong>총 주문 금액:</strong> <span className="font-bold text-gray-700">{formatPrice(order.orderTotalPrice)}</span></p>
                    {order.discountAmount > 0 && ( // 할인 금액이 0보다 클 때만 표시
                        <p><strong>포인트 할인:</strong> <span className="font-bold text-red-600"> -{formatPrice(order.discountAmount)}</span></p>
                    )}
                    <p><strong>최종 결제 금액:</strong> <span className="font-bold text-blue-600">{formatPrice(order.finalPaymentAmount)}</span></p>
                </div>
            </div>

            {/* 주문 상태 변경 */}
            <div className="mb-6">
                <label htmlFor="status-select" className="font-semibold text-lg mb-2 block">주문 상태 변경</label>
                <select
                    id="status-select"
                    value={order.status} // ✅ DTO에서 넘어온 한글 상태명
                    onChange={onStatusChange} // ✅ onChange 핸들러는 그대로 사용
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
                    {/*  order.products 사용 (DTO에 orderItems 대신 products 필드) */}
                    {order.products && order.products.length > 0 ? (
                        order.products.map((product) => ( //  item 대신 product 사용
                            //  key prop에 고유 ID가 없다면 product.name과 product.quantity 조합
                            <div key={product.name + product.quantity} className="p-3 bg-gray-50 rounded-md flex items-center gap-4">
                                {/* 썸네일 이미지 */}
                                {product.thumbnailImageUrl && (
                                    <div className="w-20 h-20 flex-shrink-0">
                                        <img src={product.thumbnailImageUrl} alt={product.name} className="w-full h-full object-cover rounded-md" />
                                    </div>
                                )}
                                <div>
                                    {/*  product.name, product.quantity 사용 */}
                                    <p className="font-semibold">{product.name} (x{product.quantity})</p>
                                    {/*  customOptions 대신 product.options 사용 (Map<String, Integer> 타입) */}
                                    {/* Map의 키와 값을 순회하며 표시 */}
                                    {product.options && Object.keys(product.options).length > 0 && (
                                        <div className="text-sm text-gray-600 pl-2">
                                            {Object.entries(product.options).map(([key, value]) => (
                                                <p key={key}>- {key}: {value}</p>
                                            ))}
                                        </div>
                                    )}
                                    {/*  단가 * 수량 (subTotalPrice) 표시  */}
                                    <p className="text-sm text-gray-700">단가: {formatPrice(product.unitPrice)}</p>
                                    <p className="text-sm text-gray-700">소계: {formatPrice(product.subTotalPrice)}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">주문된 상품이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerOrderDetail;