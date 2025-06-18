import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderDetail, cancelMyOrder } from '../../../api/buyerOrderApi';

export default function OrderDetail() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await getOrderDetail(orderId);
                setOrder(data);
            } catch (err) {
                console.error('주문 상세 불러오기 실패', err);
            }
        })();
    }, [orderId]);

    const handleCancelOrder = async () => {
        const confirmed = window.confirm('정말로 이 주문을 취소하시겠습니까?');
        if (!confirmed) return;

        try {
            await cancelMyOrder(order.id);
            alert('주문이 취소되었습니다.');
            const updated = await getOrderDetail(orderId);
            setOrder(updated);
        } catch (err) {
            console.error('주문 취소 실패', err);
            alert('주문 취소 중 오류가 발생했습니다.');
        }
    };

    if (!order) return <div className="p-4 text-center">로딩 중…</div>;

    const isCancellable = order.status === 'RESERVATION_PENDING' || order.status === 'RESERVATION_CONFIRMED';

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">주문 상세 #{order.id}</h2>

            <div className="mb-6 space-y-1">
                <p><strong>주문 상태:</strong> {order.status}</p>
                <p><strong>픽업 일시:</strong> {order.pickupDate} {order.pickupTime}</p>
                {order.orderNote && <p><strong>요청사항:</strong> {order.orderNote}</p>}
            </div>

            <div className="border-t pt-4">
                <h3 className="text-xl font-semibold mb-2">주문 케이크</h3>
                {order.items.map(item => (
                    <div key={item.cakeItemId} className="flex justify-between py-2 border-b">
                        <span>{item.name}</span>
                        <span>{item.count}개</span>
                        <span>{(item.price * item.count).toLocaleString()}원</span>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-right font-bold text-lg">
                총 결제 금액: {order.totalPrice.toLocaleString()}원
            </div>

            {isCancellable && (
                <div className="mt-6 text-right">
                    <button
                        onClick={handleCancelOrder}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        주문 취소하기
                    </button>
                </div>
            )}
        </div>
    );
}
