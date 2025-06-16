/* Updated PaymentListPage.jsx to use hardcoded product data until orderAPI is ready */

// src/pages/payment/PaymentListPage.jsx
import React, { useEffect, useState } from 'react';
import { getMyPaymentList } from '../../api/paymentAPI';
import { useNavigate } from 'react-router';

export default function PaymentListPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPayments() {
            try {
                const data = await getMyPaymentList({ page: 1, size: 20 });
                const list = Array.isArray(data) ? data : data.content;
                const enriched = list.map(p => ({
                    ...p,
                    productName: '테스트 상품명',
                    productImageUrl: '/cakeImage/default-cake.png',
                }));
                setPayments(enriched);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchPayments();
    }, []);

    if (loading) return <div className="p-6 text-center">로딩 중...</div>;
    if (payments.length === 0) return <div className="p-6 text-center">조회된 결제가 없습니다.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-center relative mb-6">
                결제 내역
                <span  className="absolute bottom-0 left-1/2 w-[100px] h-0.5 bg-black -translate-x-1/2"></span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
                {payments.map(p => (
                    <div
                        key={p.paymentId}
                        onClick={() => navigate(`/payments/${p.paymentId}`)}
                        className="bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-shadow duration-200"
                    >
                        {/* 상단: 이미지와 상품명 */}
                        <div className="flex items-start justify-between mb-4">
                            <img
                                //src={`http://localhost:8080${p.productImageUrl}`}
                                src={p.productImageUrl}
                                alt={p.productName}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="text-right ml-4 flex-1">
                                <h2 className="text-lg font-semibold text-gray-800">{p.productName}</h2>
                                <p className="text-sm text-gray-500">결제 수단: {p.provider}</p>
                            </div>
                        </div>
                        {/* 하단: 금액과 상태 */}
                        <div className="flex items-center justify-end space-x-4">
                            <p className="text-xl font-bold text-gray-900">{p.amount.toLocaleString()}원</p>
                            {p.status === 'APPROVED' && <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">승인</span>}
                            {p.status === 'READY'    && <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">대기</span>}
                            {p.status === 'CANCELLED'&& <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">취소</span>}
                            {p.status === 'REFUNDED' && <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">환불</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
