import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function OrderDetail({
                                        order,
                                        onCancel, // 이 props는 주문 취소 로직을 상위 컴포넌트에서 처리할 때 사용
                                        onBack
                                    }) {
    const [isCancelling, setIsCancelling] = useState(false);
    const navigate = useNavigate();

    const handleCancel = async () => { // async 추가 (onCancel이 비동기일 수 있으므로)
        const confirmed = window.confirm('정말로 이 주문을 취소하시겠습니까?');
        if (!confirmed) return;

        setIsCancelling(true); // 취소 요청 시작 시 버튼 비활성화
        try {
            await onCancel(order.orderId); // 상위 컴포넌트의 onCancel 함수 호출
            // 취소 성공 후 필요한 추가 로직 (예: 상태 업데이트, 메시지)은 onCancel 내부에서 처리되거나
            // 이 컴포넌트에서 직접 주문 상태를 업데이트할 수도 있습니다.
            // 여기서는 onCancel이 이미 상위에서 처리해줄 것으로 가정합니다.
        } catch (err) {
            console.error('❌ 주문 취소 실패:', err);
            alert('주문 취소 중 오류가 발생했습니다.');
        } finally {
            setIsCancelling(false); // 취소 요청 완료 시 버튼 활성화
        }
    };



    // ⭐ 리뷰 쓰기 버튼 클릭 핸들러 수정 ⭐
    const handleWriteReview = () => {
        const firstCakeId = order.items && order.items.length > 0 && order.items[0].cakeItem ? order.items[0].cakeItem.cakeId : null;

        navigate(`/buyer/reviews/create/${order.orderId}`, {
            state: { cakeId: firstCakeId } // firstCakeId를 state로 전달
        });
    };

    // // 리뷰 쓰기 버튼 클릭 핸들러 (나중에 페이지 이동 로직 추가)
    // const handleWriteReview = () => {
    //     // 나중에 여기에 리뷰 작성 페이지로 이동하는 로직을 추가합니다.
    //     // 예: navigate(`/review/write/${order.orderId}`);
    //     alert('리뷰 쓰기 페이지로 이동 예정');
    //     console.log(`리뷰 작성: 주문 ID ${order.orderId}`);
    // };

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

    // 주문 취소 불가능한 상태 정의 (백엔드 주문 상태 값과 정확히 일치해야 함)
    const nonCancellableStatuses = [
        'NO_SHOW',             // 노쇼
        'RESERVATION_CANCELLED', // 주문 취소
        'READY_FOR_PICKUP', // 픽업 확정
        'PICKUP_COMPLETED'  // 만약 'PICKUP_COMPLETED'가 확정 완료를 의미한다면 여기에 추가
    ];

    // 주문 취소 버튼 활성화 여부
    const isCancelButtonDisabled = nonCancellableStatuses.includes(order.status) || isCancelling;

    // 리뷰 쓰기 버튼 활성화 여부 (일반적으로 픽업 완료 후 가능)
    const isReviewButtonVisible = order.status === 'PICKUP_COMPLETED' || order.status === 'PICKUP_CONFIRMED'; // 픽업이 완료되었을 때만 리뷰 가능하다고 가정

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
                                        onError={(e) => { e.target.onerror = null; e.target.src="/default-cake-image.jpg"; }} // 기본 이미지 경로 확인 및 설정 필요
                                    />
                                </div>
                            )}
                            <div className="flex-grow">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                                    <span className="font-semibold text-lg">{item.cname}</span>
                                    <span className="text-gray-600 sm:ml-auto">{item.productCnt}개</span>
                                </div>
                                <div className="text-right mt-1">
                                    <span className="text-lg font-bold">{(item.price ?? 0) * (item.productCnt ?? 0).toLocaleString()}원</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">주문된 케이크가 없습니다.</p>
                )}
            </div>

            <div className="mt-6 text-right font-bold text-lg">
                총 결제 금액: {(order.totalPrice ?? 0).toLocaleString()}원
            </div>

            <div className="mt-6 flex justify-end gap-4"> {/* 버튼들을 오른쪽으로 정렬 */}
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
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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