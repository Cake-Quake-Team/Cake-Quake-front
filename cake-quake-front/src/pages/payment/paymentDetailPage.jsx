// src/pages/payment/PaymentDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getPaymentDetail } from '../../api/paymentAPI';
// import { getOrderDetail } from '../../api/orderAPI'; // TODO: 주문 API 준비되면 활성화

export default function PaymentDetailPage() {
    const { paymentId } = useParams();
    const [payment, setPayment] = useState(null);
    const [order, setOrder]       = useState(null);
    const [loading, setLoading]   = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                // 1) 결제 정보 조회
                const pay = await getPaymentDetail(paymentId);
                setPayment(pay);

                // 2) TODO: 실제 주문 API 준비되면 아래 코드로 대체
                // if (pay.orderId) {
                //   const ord = await getOrderDetail(pay.orderId);
                //   setOrder(ord);
                // }

                // 임시 하드코딩된 주문 데이터
                setOrder({
                    items: [
                        {
                            product: {
                                name: '테스트 상품명',
                                imageUrl: '/cakeImage/default-cake.png',
                            }
                        }
                    ]
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [paymentId]);

    if (loading) return <div className="p-6 text-center">로딩 중...</div>;
    if (!payment) return <div className="p-6 text-center">결제 정보를 찾을 수 없습니다.</div>;

    const product = order.items[0].product;
    const date    = new Date(payment.regDate);
    const dateStr = date.toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' });
    const timeStr = date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm text-gray-500 hover:underline"
            >
                &larr; 뒤로가기
            </button>

            <div className="max-w-md mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                {/* 상단 날짜/시간 바 */}
                <div className="bg-blue-900 text-white text-center py-4">
                    <p className="text-sm">{dateStr} | {timeStr}</p>
                </div>

                {/* 영수증 내용 */}
                <div className="p-6 divide-y divide-gray-200">
                    {/* 상품명 & 카드 정보 */}
                    <div className="pb-4 text-center">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg mb-3 mx-auto"
                        />
                        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                        <p className="text-xs text-gray-500 mt-1">결제수단: {payment.provider}</p>
                    </div>

                    {/* 결제 금액 */}
                    <div className="py-4 text-center">
                        <p className="text-4xl font-bold text-gray-900">{payment.amount.toLocaleString()}원</p>
                    </div>

                    {/* 추가 정보들 */}
                    <div className="pt-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">결제 구분</span>
                            <span className="text-gray-800">일시불</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">카드 소지자</span>
                            <span className="text-gray-800">본인</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">승인번호</span>
                            <span className="text-gray-800">{payment.transactionId || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">승인상태</span>
                            <span className="text-gray-800 capitalize">{payment.status.toLowerCase()}</span>
                        </div>
                    </div>
                </div>

                {/* 하단 티켓 톱니 장식 */}
                <div
                    className="h-4 bg-white"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
                    }}
                />
            </div>
        </div>
    );
}
