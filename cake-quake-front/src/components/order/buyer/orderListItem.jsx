import React from 'react';
import { Link } from 'react-router';
// import OrderListPage from "../../../pages/order/buyer/orderListPage.jsx";

export default function OrderListItem({ order }) {
    // 날짜 및 가격 형식화 (OrderList 컴포넌트나 공통 유틸에서 가져올 수 있음)
    const formatPrice = (price) => `${price?.toLocaleString()}원`;

    // 픽업일시 형식화
    const formatPickupDateTime = (date, time) => {
        if (!date || !time) return '날짜 정보 없음';
        try {
            const dateTime = new Date(`${date}T${time}`);
            return dateTime.toLocaleString('ko-KR', {
                month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return '날짜 오류';
        }
    };

    // 주문 상태 한글화 함수 (OrderDetail에서 가져오거나 공통 유틸로 빼기)
    const getStatusKorean = (status) => {
        switch (status) {
            case 'RESERVATION_PENDING': return '예약 확인 중';
            case 'RESERVATION_CONFIRMED': return '예약 확정';
            case 'PREPARING': return '준비 중';
            case 'READY_FOR_PICKUP': return '픽업 준비 완료';
            case 'PICKUP_COMPLETED': return '픽업 완료';
            case 'RESERVATION_CANCELLED': return '주문 취소';
            case 'NO_SHOW': return '노쇼';
            default: return status;
        }
    };

    return (
        <div className="bg-white border rounded-lg shadow-sm mb-4 p-4">
            {/* 주문일시 - order.regDate나 order.createdAt 필드가 OrderListItem에 있어야 함 */}
            {/* <p className="text-sm text-gray-500 mb-2">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</p> */}

            <h3 className="text-xl font-bold mb-2">주문번호: {order.orderNumber}</h3>
            <p className="text-gray-700 mb-1">가게: {order.shopName || '정보 없음'}</p>
            <p className="text-gray-700 mb-1">상태: {getStatusKorean(order.status)}</p>
            <p className="text-gray-700 mb-2">픽업일시: {formatPickupDateTime(order.pickupDate, order.pickupTime)}</p>

            {/* 각 주문 아이템 (상품) 목록 */}
            <div className="border-t pt-2 mt-2">
                <h4 className="font-semibold mb-2">주문 상품</h4>
                {order.items && order.items.length > 0 ? (
                    order.items.map((item, itemIndex) => (
                        // OrderItemOption DTO에 고유 ID가 없다면, key로 index나 cname + productCnt 조합 사용
                        // `key={item.orderItemId}`가 가장 좋음. 없으면 `${order.orderId}-${itemIndex}` 와 같이 조합
                        <div key={`${order.orderId}-${itemIndex}`} className="flex items-center py-2 border-b last:border-b-0">
                            {/* 썸네일 이미지 */}
                            {item.thumbnailImageUrl && (
                                <div className="w-16 h-16 mr-4 flex-shrink-0">
                                    <img
                                        src={item.thumbnailImageUrl}
                                        alt={item.cname || "상품 이미지"}
                                        className="w-full h-full object-cover rounded-md"
                                        onError={(e) => { e.target.onerror = null; e.target.src="/default-cake-image.jpg"; }}
                                    />
                                </div>
                            )}
                            {/* 상품명, 수량, 옵션, 가격 */}
                            <div className="flex-grow">
                                <p className="font-medium">{item.cname}</p>
                                <p className="text-sm text-gray-600">수량: {item.productCnt}개</p>

                                {/* ⭐⭐ [수정] 옵션 표시 (List<CreateOrder.SelectedOptionDetail> selectedOptions 사용) ⭐⭐ */}
                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                    <div className="text-sm text-gray-600 pl-2 border-l border-gray-300 mt-1">
                                        {/* 옵션들의 총 가격을 계산하여 표시하기 위함 (여기서는 디스플레이용으로만 계산) */}
                                        {(() => {
                                            let totalOptionsPrice = 0;
                                            const optionDetails = item.selectedOptions.map((option, optIdx) => {
                                                totalOptionsPrice += (option.price || 0) * (option.count || 1);
                                                return (
                                                    <p key={optIdx} className="m-0">
                                                        {option.optionGroup && `${option.optionGroup}: `}
                                                        {option.optionName}
                                                        {option.count > 1 && ` (${option.count}개)`}
                                                        {option.price > 0 && ` (+${option.price.toLocaleString()}원)`}
                                                    </p>
                                                );
                                            });
                                            return (
                                                <>
                                                    {optionDetails}
                                                    {totalOptionsPrice > 0 && (
                                                        <p className="m-0 font-semibold mt-1">
                                                            옵션 추가 금액: +{totalOptionsPrice.toLocaleString()}원
                                                        </p>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                                {/* ⭐⭐ 옵션 표시 끝 ⭐⭐ */}

                                <p className="text-right font-bold">{formatPrice(item.price * item.productCnt)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">주문된 상품이 없습니다.</p>
                )}
            </div>

            {/* ⭐⭐ 최종 가격 정보 표시 섹션 ⭐⭐ */}
            <div className="text-right mt-4 space-y-1">
                <p className="text-lg text-gray-700">
                    총 주문 금액: {formatPrice(order.orderTotalPrice)}
                </p>
                {/* discountAmount가 0보다 클 때만 포인트 할인 금액 표시 */}
                {order.discountAmount > 0 && (
                    <p className="text-lg text-red-600 font-semibold">
                        포인트 할인: -{formatPrice(order.discountAmount)}
                    </p>
                )}
                <p className="text-2xl font-bold text-blue-800 mt-2 pt-2 border-t border-gray-300">
                    최종 결제 금액: {formatPrice(order.finalPaymentAmount)}
                </p>
            </div>

            <div className="mt-4 text-right">
                {/* 주문 상세 페이지로 이동 링크 */}
                <Link
                    to={`/buyer/orders/${order.orderId}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    상세보기
                </Link>
            </div>
        </div>
    );
}