// src/pages/payment/paymentDetailPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getPaymentDetail } from '../../api/paymentApi';

export default function PaymentDetailPage() {
    const { paymentId } = useParams();
    console.log('🤔 useParams paymentId:', paymentId);
    const navigate = useNavigate();

    const {
        data: payment,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['paymentDetail', paymentId],
        queryFn: () => {                         // 중괄호 블록 쓰실 거면…
            console.log('🛰️ fetching detail for', paymentId);
                 return getPaymentDetail(paymentId);    // ← 반드시 return!
        },
        // 또는 이처럼 한 줄로!
        // queryFn: () => getPaymentDetail(paymentId),
        enabled: Boolean(paymentId),
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
        return <div className="p-6 text-center">결제 정보 로딩 중…</div>;
    }
    if (isError) {
        return (
            <div className="p-6 text-center text-red-500">
                결제 정보를 불러오는 중 오류가 발생했습니다. <br/>
                {error.message}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">결제 상세 #{payment.paymentId}</h2>
            <p><strong>주문 번호:</strong> {payment.orderId}</p>
            <p><strong>결제 금액:</strong> ₩{payment.amount.toLocaleString()}</p>
            <p><strong>결제 수단:</strong> {payment.provider}</p>
            <p><strong>결제 상태:</strong> {payment.status}</p>
            <button
                onClick={() => navigate(-1)}
                className="mt-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
                뒤로가기
            </button>
        </div>
    );
}
