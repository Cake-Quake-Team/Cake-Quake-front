import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { listMyPayments } from '../../api/paymentApi';

export default function PaymentListPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const data = await listMyPayments({ page: 1, size: 10 });
                const list = Array.isArray(data) ? data : data.content || [];
                setPayments(list);
            } catch (err) {
                console.error('결제 목록 조회 실패', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-full">
                <div className="animate-pulse space-y-4 w-full max-w-4xl">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (payments.length === 0) {
        return (
            <div className="p-6 text-center">
                <img src="/images/empty-state.svg" alt="No payments" className="mx-auto mb-4 w-40 h-40" />
                <p className="text-gray-600">조회된 결제가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-extrabold text-center mb-6">결제 내역</h2>

            {/* Payment Cards */}
            <div className="grid gap-6 sm:grid-cols-2">
                {payments.map(p => (
                    <button
                        key={p.paymentId}
                        onClick={() => navigate(`/buyer/payments/${p.paymentId}`)}
                        className="relative bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between text-left transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <div>
                            <h3 className="text-lg font-semibold mb-1">{p.storeName}</h3>
                            <p className="text-sm text-gray-500">결제 수단: {p.provider}</p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-xl font-bold">
                                {p.amount.toLocaleString()}원
                            </p>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${{
                                APPROVED: 'bg-green-100 text-green-800',
                                READY: 'bg-yellow-100 text-yellow-800',
                                CANCELLED: 'bg-red-100 text-red-800',
                                REFUNDED: 'bg-blue-100 text-blue-800',
                            }[p.status]}`}>{{
                                APPROVED: '승인',
                                READY: '대기',
                                CANCELLED: '취소',
                                REFUNDED: '환불',
                            }[p.status]}</span>
                        </div>

                        <time
                            dateTime={p.regDate}
                            className="absolute top-4 right-4 text-xs text-gray-400"
                        >
                            {new Date(p.regDate).toLocaleDateString('ko-KR', {
                                year: 'numeric', month: '2-digit', day: '2-digit'
                            })}
                        </time>
                    </button>
                ))}
            </div>
        </div>
    );
}
