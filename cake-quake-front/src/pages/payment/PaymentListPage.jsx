// src/pages/payment/PaymentListPage.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { listMyPayments } from '../../api/paymentApi'

export default function PaymentListPage() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const data = await listMyPayments({ page: 1, size: 10 })
                // API가 배열을 직접 던져주든, content 프로퍼티로 감싸서 주든 대응
                const list = Array.isArray(data) ? data : data.content || []
                setPayments(list)
            } catch (err) {
                console.error('결제 목록 조회 실패', err)
            } finally {
                setLoading(false)
            }
        }
        fetchPayments()
    }, [])

    if (loading) {
        return <div className="p-6 text-center">로딩 중…</div>
    }
    if (payments.length === 0) {
        return <div className="p-6 text-center">조회된 결제가 없습니다.</div>
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-6">결제 내역</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {payments.map(p => (
                    <div
                        key={p.paymentId}
                        onClick={() => navigate(`/buyer/payments/${p.paymentId}`)}
                        className="bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-shadow duration-200"
                    >
                        {/* 상단: 매장 이름과 결제 수단 */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">{p.storeName}</h3>
                            <p className="text-sm text-gray-500">결제 수단: {p.provider}</p>
                        </div>
                        {/* 하단: 금액과 상태 */}
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-bold">
                                {p.amount.toLocaleString()}원
                            </p>
                            {p.status === 'APPROVED' && (
                                <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                  승인
                </span>
                            )}
                            {p.status === 'READY' && (
                                <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  대기
                </span>
                            )}
                            {p.status === 'CANCELLED' && (
                                <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                  취소
                </span>
                            )}
                            {p.status === 'REFUNDED' && (
                                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                  환불
                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
