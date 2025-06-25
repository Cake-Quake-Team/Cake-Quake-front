import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function OrderDetail({
                                        order,
                                        onCancel, // 이 props는 주문 취소 로직을 상위 컴포넌트에서 처리할 때 사용
                                        onBack,
                                        onPay,    // ⭐ 추가: 결제하기 버튼 클릭 핸들러 ⭐
                                        isPaying  // ⭐ 추가: 결제 진행 중 상태 ⭐
                                    }) {
    const [isCancelling, setIsCancelling] = useState(false);
    const navigate = useNavigate();

    const handleCancel = async () => {
        const confirmed = window.confirm('정말로 이 주문을 취소하시겠습니까?');
        if (!confirmed) return;

        setIsCancelling(true);
        try {
            await onCancel(order.orderId);
        } catch (err) {
            console.error('❌ 주문 취소 실패:', err);
            alert('주문 취소 중 오류가 발생했습니다.');
        } finally {
            setIsCancelling(false);
        }
    };

    const handleWriteReview = () => {
        const firstCakeId = order.items && order.items.length > 0 && order.items[0].cakeItem ? order.items[0].cakeItem.cakeId : null;

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

    // 주문 취소 불가능한 상태 정의
    const nonCancellableStatuses = [
        'RESERVATION_CONFIRMED', // 예약 확정 (결제 후)
        'PREPARING',             // 준비 중
        'READY_FOR_PICKUP',      // 픽업 준비 완료
        'PICKUP_COMPLETED',      // 픽업 완료
        'RESERVATION_CANCELLED', // 이미 취소됨
        'NO_SHOW'                // 노쇼
    ];

    // 주문 취소 버튼 활성화 여부
    const isCancelButtonDisabled = nonCancellableStatuses.includes(order.status) || isCancelling;

    // ⭐ 결제하기 버튼 활성화 여부 ⭐
    // 'RESERVATION_PENDING' (예약 확인 중) 상태일 때만 결제 가능
    const isPayButtonActive = order.status === "RESERVATION_PENDING";

    // 리뷰 쓰기 버튼 활성화 여부 (일반적으로 픽업 완료 후 가능)
    const isReviewButtonVisible = order.status === 'PICKUP_COMPLETED'; // 'PICKUP_CONFIRMED'는 결제 후 상태이므로, 픽업 완료 시에만 리뷰를 쓰는 것이 일반적.

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">주문 상세 #{order.orderNumber ?? order.orderId}</h2>

            <div className="mb-6 space-y-1 text-gray-800">
                <p><strong>주문 상태:</strong> {order.status}</p>
                <p><strong>픽업 일시:</strong> {formatReservedAt(order.reservedAt)}</p>
                <p><strong>요청사항:</strong> {order.orderNote || '없음'}</p>
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
                                <div className="text-right mt-1">
                                    <span className="text-lg font-bold">₩{(item.price ?? 0) * (item.productCnt ?? 0).toLocaleString()}원</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">주문된 케이크가 없습니다.</p>
                )}
            </div>

            <div className="mt-6 text-right font-bold text-lg">
                총 결제 금액: ₩{(order.totalPrice ?? 0).toLocaleString()}원
            </div>

            <div className="mt-6 flex justify-end gap-4">
                {/* ⭐ 결제하기 버튼 ⭐ */}
                <button
                    onClick={onPay} // 상위 컴포넌트에서 전달받은 onPay 핸들러 연결
                    disabled={!isPayButtonActive || isPaying} // 활성화 조건 및 결제 로딩 상태 연결
                    className={`px-4 py-2 rounded-md text-white font-semibold transition-colors
                        ${isPayButtonActive && !isPaying
                        ? 'bg-blue-600 hover:bg-blue-700' // 활성화 시 파란색
                        : 'bg-gray-400 text-gray-700 cursor-not-allowed' // 비활성화 시 회색
                    }`}
                >
                    {isPaying ? '결제 진행 중...' : '결제하기'}
                </button>

                {/* 주문 취소 버튼 */}
                <button
                    onClick={handleCancel}
                    className={`px-4 py-2 rounded ${isCancelButtonDisabled ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
                    disabled={isCancelButtonDisabled}
                >
                    주문 취소하기
                </button>

                {/* 리뷰 쓰기 버튼 */}
                {isReviewButtonVisible && (
                    <button
                        onClick={handleWriteReview}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        리뷰 쓰기
                    </button>
                )}

                {/* 뒤로가기 버튼 */}
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