import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { approveTossPayment } from '../../api/paymentApi';

export default function TossSuccessPage() {
    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const qs = new URLSearchParams(search);
        const paymentKey = qs.get('paymentKey');
        const orderId    = qs.get('orderId');

        if (!paymentKey || !orderId) {
            alert('잘못된 콜백 파라미터입니다.');
            return;
        }

        approveTossPayment({ paymentKey, orderId })
            .then(data => {
                // 승인 처리 후 리다이렉트
                navigate(`/buyer/payments/${data.paymentId}`);
            })
            .catch(err => {
                console.error(err);
                alert('토스페이 승인 처리 중 오류가 발생했습니다.');
            });
    }, [search, navigate]);

    return <p>토스페이 결제 성공 처리 중…</p>;
}
