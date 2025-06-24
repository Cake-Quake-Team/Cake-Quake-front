import React from 'react';
import { Link } from 'react-router';

export default function OrderList({ orders, isLoading, error }) {
    const formatPickup = (date, time) => {
        return new Date(`${date}T${time}`).toLocaleString('ko-KR', {
            month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
            hour12: true
        });
    };

    const formatPrice = (price) => `${price.toLocaleString()}원`;

    if (isLoading) {
        return <div className="p-4 text-center">로딩 중…</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">주문 목록을 불러오지 못했습니다.</div>;
    }

    if (!orders || orders.length === 0) {
        return <p className="text-center py-8">주문 내역이 없습니다.</p>;
    }

    return (
        <table className="w-full table-auto border-collapse">
            <thead>
            <tr className="bg-gray-100">
                <th className="p-2 border">주문 일시</th>
                <th className="p-2 border">주문 상태</th>
                <th className="p-2 border">픽업 시간</th>
                <th className="p-2 border">총 금액</th>
                <th className="p-2 border">상세 보기</th>
            </tr>
            </thead>
            <tbody>
            {orders.map(order => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="p-2 border">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="p-2 border">{order.status}</td>
                    <td className="p-2 border">{formatPickup(order.pickupDate, order.pickupTime)}</td>
                    <td className="p-2 border text-right">{formatPrice(order.orderTotalPrice)}</td>
                    <td className="p-2 border text-center">
                        <Link
                            to={`/buyer/orders/${order.orderId}`}
                            className="text-blue-500 hover:underline"
                        >
                            주문 상세
                        </Link>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
