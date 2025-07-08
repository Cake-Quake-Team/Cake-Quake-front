import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function OrderDetail({
                                        order,
                                        onCancel,
                                        onBack,
                                        onPay,
                                        hasApprovedPayment, // 승인 여부
                                        isPaying
                                    }) {
    const [isCancelling, setIsCancelling] = useState(false);
    const navigate = useNavigate();

    // 주문 상태 한글화 맵 (기존과 동일)
    const orderStatusMap = {
        RESERVATION_PENDING: '예약 확인 중',
        RESERVATION_CONFIRMED: '예약 확정',
        PREPARING: '준비 중',
        READY_FOR_PICKUP: '픽업 준비 완료',
        PICKUP_COMPLETED: '픽업 완료',
        RESERVATION_CANCELLED: '예약 취소',
        NO_SHOW: '노쇼',
    };

    const handleCancel = async () => {
        const confirmed = window.confirm('정말로 이 주문을 취소하시겠습니까?');
        if (!confirmed) return;

        setIsCancelling(true);
        try {
            await onCancel(order.orderId);
        } catch (_err) {
            console.error('❌ 주문 취소 실패:', _err);
            alert('주문 취소 중 오류가 발생했습니다.');
        } finally {
            setIsCancelling(false);
        }
    };

    const handleWriteReview = () => {
        const firstCakeId = order.items && order.items.length > 0 ? order.items[0].cakeId : null;

        navigate(`/buyer/reviews/create/${order.orderId}`, {
            state: { cakeId: firstCakeId }
        });
    };

    const formatReservedAt = (reservedAtString) => {
        if (!reservedAtString) return '정보 없음';
        try {
            const dateTime = new Date(reservedAtString);
            if (isNaN(dateTime.getTime())) return '유효하지 않은 날짜';

            const date = dateTime.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const time = dateTime.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            return `${date} ${time}`;
        } catch (e) {
            return '날짜 파싱 오류';
        }
    };

    if (!order) return <div className="p-4 text-center">로딩 중…</div>;

    // 주문 상태에 따른 버튼 가시성 로직 재조정
    let showCancelButton = false;
    let showReviewButton = false;

    switch (order.status) {
        case 'RESERVATION_PENDING': // 예약 확인 중

            showCancelButton = true;  // 주문 취소하기 버튼 보임
            break;
        case 'RESERVATION_CONFIRMED': // 예약 확정
            // 결제는 이미 진행되었거나 이전에 진행했으므로 "결제하기"는 숨김
            showCancelButton = true;  // 주문 취소하기 버튼 보임
            break;
        case 'PREPARING':       // 준비 중
            showCancelButton = true;  // 주문 취소하기 버튼 보임
            break;
        case 'READY_FOR_PICKUP': // 픽업 준비 완료
            // 이 시점에서는 취소 불가능한 것으로 가정하고 숨김
            break;
        case 'PICKUP_COMPLETED': // 픽업 완료
            showReviewButton = true;  // "리뷰 쓰기" 보임
            break;
        case 'RESERVATION_CANCELLED': // 이미 취소됨
        case 'NO_SHOW':          // 노쇼
            // 모든 액션 버튼 숨김
            break;
        default:
            // 그 외 알 수 없는 상태는 모두 숨김
            break;
    }

    // 주문 취소 버튼의 비활성화 상태
    const isCancelButtonDisabled = isCancelling;

    // 주문 상태를 한국어로 표시
    const displayStatus = orderStatusMap[order.status] || order.status;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">주문 상세 #{order.orderNumber ?? order.orderId}</h2>

            <div className="mb-6 space-y-1 text-gray-800">
                <p><strong>주문 상태:</strong> {displayStatus}</p>
                <p><strong>픽업 일시:</strong> {formatReservedAt(order.reservedAt)}</p>
                <p><strong>요청 사항:</strong> {order.orderNote || '없음'}</p>
            </div>

            <div className="border-t pt-4">
                <h3 className="text-xl font-semibold mb-2">주문 케이크 목록</h3>
                {order.items && order.items.length > 0 ? (
                    order.items.map(item => (
                        <div key={item.orderItemId || `${item.cname}-${item.productCnt}`} className="flex py-2 border-b items-center">
                            {item.thumbnailImageUrl && (
                                <div className="w-24 h-24 mr-4 flex-shrink-0">
                                    <img
                                        src={item.thumbnailImageUrl}
                                        alt={item.cname || "케이크 이미지"}
                                        className="w-full h-full object-cover rounded-md"
                                        onError={(e) => { e.target.onerror = null; e.target.src="/default-cake-image.jpg"; }}
                                    />
                                </div>
                            )}
                            <div className="flex-grow">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                                    <span className="font-semibold text-lg">{item.cname}</span>
                                    <span className="text-gray-600 sm:ml-auto">{item.productCnt}개</span>
                                </div>
                                {/* ⭐⭐ 옵션 정보 표시 추가 (여기서 옵션이 보이도록 수정합니다) ⭐⭐ */}
                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                    <div className="text-sm text-gray-500 mt-1 pl-2 border-l border-gray-200">
                                        {/* 옵션들의 총 가격을 계산 (화면 표시용) */}
                                        {(() => {
                                            let totalOptionsPrice = 0;
                                            const optionDetails = item.selectedOptions.map((option, idx) => {
                                                totalOptionsPrice += (option.price || 0) * (option.count || 1);
                                                return (
                                                    <p key={idx} className="m-0">
                                                        {/* optionGroup 필드는 OptionType의 typeName에서 왔다고 가정 */}
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
                                {/* ⭐⭐ 옵션 정보 표시 끝 ⭐⭐ */}
                                <div className="text-right mt-1">
                                    {/* 이 price는 itemSubTotalPrice가 아니라 단가이므로, itemSubTotalPrice를 표시하는 것이 맞습니다. */}
                                    <span className="text-lg font-bold">₩{(item.itemSubTotalPrice ?? 0).toLocaleString()}원</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">주문된 케이크가 없습니다.</p>
                )}
            </div>

            {/* ⭐⭐ 가격 정보 표시 추가 ⭐⭐ */}
            <div className="mt-6 text-right space-y-1">
                <p className="text-lg text-gray-700">
                    기존 주문 금액: ₩{(order.totalPrice ?? 0).toLocaleString()}원
                </p>
                {order.discountAmount > 0 && ( // 할인 금액이 0보다 클 때만 표시
                    <p className="text-lg text-red-600 font-semibold">
                        포인트 할인: -₩{(order.discountAmount ?? 0).toLocaleString()}원
                    </p>
                )}
                <p className="text-xl font-bold text-blue-800 mt-2 pt-2 border-t border-gray-300">
                    최종 결제 금액: ₩{(order.finalPaymentAmount ?? 0).toLocaleString()}원
                </p>
            </div>

            {/* 버튼 영역: 재조정된 로직에 따라 동적으로 렌더링 */}
            <div className="mt-6 flex justify-end gap-4">
                {/* ④ 결제내역 보기 or 결제하기 버튼 */}
                <button
                    onClick={onPay}
                    disabled={isPaying}
                    className={`px-4 py-2 rounded-md text-white font-semibold transition-colors
            ${hasApprovedPayment
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : !isPaying
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    {hasApprovedPayment
                        ? '결제 내역 보기'
                        : isPaying
                            ? '결제 진행 중...'
                            : '결제하기'
                    }
                </button>

                {showCancelButton && ( // 조건부 렌더링
                    <button
                        onClick={handleCancel}
                        disabled={isCancelButtonDisabled} // 취소 진행 중일 때 비활성화
                        className={`px-4 py-2 rounded ${isCancelButtonDisabled
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600'}`}
                    >
                        {isCancelling ? '취소 중...' : '주문 취소하기'}
                    </button>
                )}

                {showReviewButton && ( // 조건부 렌더링
                    <button
                        onClick={handleWriteReview}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        리뷰 쓰기
                    </button>
                )}

                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                    뒤로가기
                </button>
            </div>
        </div>
    );
}