import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TossSuccessPage() {
    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const qs = new URLSearchParams(search);
        const paymentKey = qs.get('paymentKey');
        const orderId    = qs.get('orderId');

        fetch(
            `${import.meta.env.VITE_API_BASE_URL}/payments/toss/success` +
            `?paymentKey=${paymentKey}&orderId=${orderId}`,
            { credentials: 'include' }
        )
            .then(res => res.json())
            .then(data => {
                navigate(`/buyer/payments/${data.paymentId}`);
            })
            .catch(err => {
                console.error(err);
                alert('토스페이 승인 중 오류가 발생했습니다.');
            });
    }, [search, navigate]);

    return <p>토스페이 결제 성공 처리 중…</p>;
}
