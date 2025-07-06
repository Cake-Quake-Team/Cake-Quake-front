// src/pages/PaymentPage.jsx
import React, { useState } from 'react';
import {createPayment} from "../../api/paymentApi.jsx";


export default function PaymentPage({ orderId, amount }) {
    const [loading, setLoading] = useState(false);

    const handlePay = async (provider) => {
        try {
            setLoading(true);
            const data = await createPayment({ orderId, provider, amount });

            if (provider === 'KAKAO') {
                // 카카오페이는 redirectUrl 로 리다이렉트
                window.location.href = data.redirectUrl;
            } else {
                // 토스페이는 SDK 모달 호출
                window.TossPayments.requestPayment('카드', {
                    amount: data.amount,
                    orderId: data.transactionId,      // toss 에선 transactionId = paymentKey
                    orderName: `Order#${orderId}`,
                    successUrl: `${window.location.origin}/toss/success`,
                    failUrl: `${window.location.origin}/toss/fail`,
                });
            }
        } catch (err) {
            console.error(err);
            alert('결제 요청 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={() => handlePay('KAKAO')} disabled={loading}>
                카카오페이로 결제
            </button>
            <button onClick={() => handlePay('TOSS')} disabled={loading}>
                토스페이로 결제
            </button>
        </div>
    );
}