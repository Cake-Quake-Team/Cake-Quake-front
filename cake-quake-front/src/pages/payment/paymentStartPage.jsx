import React, { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { createPayment } from '../../api/paymentApi'

export default function PaymentStartPage() {
    const [searchParams] = useSearchParams()
    const rawOrderId = searchParams.get('orderId')
    const rawAmount  = searchParams.get('amount')
    const orderId = rawOrderId ? Number(rawOrderId) : null
    const amount  = rawAmount  ? Number(rawAmount)  : null

    if (!orderId || !amount) {
        return <Navigate to="/" replace />
    }

    const [provider, setProvider] = useState('KAKAO')
    const mutation = useMutation({
        mutationFn: () => createPayment({ orderId, provider, amount }),
        onSuccess: async ({ redirectUrl, paymentUrl }) => {
            if (provider === 'KAKAO') {
                // 카카오페이는 URL 리다이렉트
                window.location.href = redirectUrl
            } else {

                window.location.href = paymentUrl;
            }
        },
        onError: err => {
            console.error('결제 시작 실패', err)
            alert('결제 시작에 실패했습니다.')
        }
    })

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">결제하기</h1>
            <p>주문번호: {orderId}</p>
            <p>결제금액: ₩{amount.toLocaleString()}원</p>

            <form
                onSubmit={e => { e.preventDefault(); mutation.mutate() }}
                className="mt-4 space-y-4"
            >
                <div>
                    <label className="mr-4">
                        <input
                            type="radio"
                            value="KAKAO"
                            checked={provider==='KAKAO'}
                            onChange={() => setProvider('KAKAO')}
                        /> 카카오페이
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="TOSS"
                            checked={provider==='TOSS'}
                            onChange={() => setProvider('TOSS')}
                        /> 토스페이
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={mutation.isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    {mutation.isLoading ? '처리 중…' : '결제 시작'}
                </button>
            </form>
        </div>
    )
}
