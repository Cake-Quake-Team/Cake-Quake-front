// src/pages/payment/PaymentStartPage.jsx
import React, { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getOrderDetail } from '../../api/buyerOrderApi'
import { createPayment } from '../../api/paymentApi'
import { HiShoppingCart } from 'react-icons/hi'
import AlertModal from '../../components/common/AlertModal'

export default function PaymentStartPage() {
    const [searchParams] = useSearchParams()
    const rawOrderId = searchParams.get('orderId')
    const rawAmount  = searchParams.get('amount')
    const orderId    = rawOrderId ? Number(rawOrderId) : null
    const amount     = rawAmount  ? Number(rawAmount)  : null

    // AlertModal 상태 & helper
    const [alertProps, setAlertProps] = useState({
        show: false,
        message: '',
        type: 'error'
    })
    const showAlert = (message, type = 'error') => {
        setAlertProps({ show: true, message, type })
        setTimeout(() => setAlertProps(a => ({ ...a, show: false })), 3000)
    }

    // 주문 상세 다시 조회
    const {
        data: order,
        isLoading: loadingOrder,
        isError: errorOrder,
        error: orderError
    } = useQuery({
        queryKey: ['orderDetail', orderId],
        queryFn: () => getOrderDetail(orderId),
        enabled: !!orderId,
        staleTime: 5 * 60 * 1000,
        retry: 1,
        onError: err => {
            console.error('주문 정보 로딩 실패:', err)
            showAlert('주문 정보를 불러오는 데 실패했습니다.', 'error')
        }
    })

    const [provider, setProvider] = useState('KAKAO')
    const mutation = useMutation({
        mutationFn: () => createPayment({ orderId, provider, amount }),
        onSuccess: ({ redirectUrl, paymentUrl }) => {
            if (provider === 'KAKAO') {
                window.location.href = redirectUrl
            } else {
                const qrUrl = paymentUrl.replace('/web/mobile', '/web/desktop')
                window.location.href = qrUrl
            }
        },
        onError: err => {
            console.error('결제 시작 실패', err)
            showAlert('결제 시작에 실패했습니다.')
        }
    })

    if (!orderId || !amount) {
        return <Navigate to="/" replace />
    }
    if (loadingOrder) {
        return <div className="p-6 text-center text-gray-600">주문 정보 로딩 중…</div>
    }
    if (errorOrder || !order) {
        return (
            <div className="p-6 text-center text-red-500">
                주문 정보를 불러오는 데 실패했습니다.
                {orderError?.message && (
                    <div className="mt-2 text-sm text-red-400">{orderError.message}</div>
                )}
            </div>
        )
    }

    return (
        <>
            <AlertModal
                message={alertProps.message}
                type={alertProps.type}
                show={alertProps.show}
            />

            <div className="p-6 flex justify-center">
                <div className="w-full max-w-md bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-100 px-6 py-4 flex items-center">
                        <HiShoppingCart className="text-2xl mr-2 text-gray-600" />
                        <h1 className="text-lg font-semibold">결제하기</h1>
                    </div>

                    {/* Body: 주문 번호, 총 금액, 상품 내역 */}
                    <div className="p-6 space-y-4 font-mono text-sm leading-relaxed">
                        <div className="flex justify-between">
                            <span>주문 번호</span>
                            <span className="font-medium">{order.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>총 결제 금액</span>
                            <span className="font-medium">
                                ₩{order.finalPaymentAmount.toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <span className="block mb-2 font-semibold">상품 내역</span>
                            {order.items.map(item => (
                                <div
                                    key={item.orderItemId}
                                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={item.thumbnailImageUrl}
                                            alt={item.cname}
                                            className="w-12 h-12 rounded mr-3 object-cover"
                                        />
                                        <div>
                                            <div className="font-medium">{item.cname}</div>
                                            <div className="text-gray-500 text-xs">
                                                수량: {item.productCnt}개
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-medium">
                                        ₩{(item.price * item.productCnt).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed border-gray-300" />

                    {/* 결제 수단 선택 & 결제 버튼 */}
                    <form
                        onSubmit={e => { e.preventDefault(); mutation.mutate() }}
                        className="p-6"
                    >
                        <div className="flex justify-between mb-6">
                            {['KAKAO', 'TOSS'].map(key => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setProvider(key)}
                                    className={`
                                        flex-1 text-center py-2 rounded-l-lg last:rounded-r-lg
                                        ${provider === key
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                                        ${key === 'TOSS' ? 'ml-1' : ''}
                                    `}
                                >
                                    {key === 'KAKAO' ? '카카오페이' : '토스페이'}
                                </button>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isLoading}
                            className="
                                w-full flex justify-center items-center
                                px-4 py-2 bg-blue-600 text-white font-medium rounded
                                disabled:opacity-50 disabled:cursor-not-allowed
                                hover:bg-blue-700 transition
                            "
                        >
                            {mutation.isLoading ? '처리 중…' : '결제 시작'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
