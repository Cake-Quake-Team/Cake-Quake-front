// src/pages/payment/PaymentDetailPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getPaymentDetail } from '../../api/paymentApi';
import { HiArrowLeft } from 'react-icons/hi';

export default function PaymentDetailPage() {
    const { paymentId } = useParams();
    const navigate = useNavigate();

    const { data: payment, isLoading, isError, error } = useQuery({
        queryKey: ['paymentDetail', paymentId],
        queryFn: () => getPaymentDetail(paymentId),
        enabled: Boolean(paymentId),
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div className="animate-pulse space-y-2 w-full max-w-4xl">
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-center text-red-600">
                <p className="mb-2">⚠️ 결제 정보를 불러오는 중 오류가 발생했습니다.</p>
                <p className="text-sm text-red-500">{error.message}</p>
            </div>
        );
    }

    // 상태별 한글 레이블
    const statusLabel = {
        APPROVED: '승인',
        READY: '대기',
        CANCELLED: '취소',
        REFUNDED: '환불',
    }[payment.status] || payment.status;

    return (
        <div className="p-6 w-full max-w-lg mx-auto">
            <button
                onClick={() => navigate('/buyer/payments')}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
                <HiArrowLeft className="mr-1" /> 목록으로
            </button>

            <div className="bg-white shadow-md border border-gray-300 rounded-lg p-6 font-mono text-sm leading-relaxed">
                {/* 영수증 헤더 */}
                <div className="text-center mb-4">
                    <h1 className="text-xl font-bold tracking-widest">영수증</h1>
                    <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                        <span>가맹점</span>
                        <span>{payment.storeName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>주문 번호</span>
                        <span>{payment.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>결제 ID</span>
                        <span>{payment.paymentId}</span>
                    </div>
                </div>

                <div className="border-t border-dashed border-gray-400 my-4" />

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                        <span>결제 수단</span>
                        <span>{payment.provider}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>결제 금액</span>
                        <span>₩{payment.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>결제 상태</span>
                        <span>{statusLabel}</span>
                    </div>
                    {payment.approvedAt && (
                        <div className="flex justify-between">
                            <span>승인 일시</span>
                            <time dateTime={payment.approvedAt}>
                                {new Date(payment.approvedAt).toLocaleString()}
                            </time>
                        </div>
                    )}
                </div>

                <div className="border-t border-dashed border-gray-400 my-4" />

                <div className="text-center text-xs text-gray-500">
                    감사합니다!
                    <br />
                    문의: cakequake@cakequake.com
                </div>
            </div>
        </div>
    );
}
