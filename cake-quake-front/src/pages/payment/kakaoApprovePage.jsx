// src/pages/buyer/KakaoApprovePage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { approveKakaoPayment } from '../../api/paymentApi';
import AlertModal from '../../components/common/AlertModal';

export default function KakaoApprovePage() {
    const [qs] = useSearchParams();
    const orderId = qs.get('partner_order_id');
    const userId  = qs.get('partner_user_id');
    const pgToken = qs.get('pg_token');
    const navigate = useNavigate();

    // AlertModal state & helper
    const [alertProps, setAlertProps] = useState({
        show: false,
        message: '',
        type: 'error'
    });
    const showAlert = (message, type = 'error') => {
        setAlertProps({ show: true, message, type });
        setTimeout(() => setAlertProps(a => ({ ...a, show: false })), 3000);
    };

    const mutation = useMutation({
        mutationFn: () =>
            approveKakaoPayment({ orderId, userId, pgToken }),
        onSuccess: (result) => {
            console.log('✅ approve result:', result);
            const { paymentId } = result;
            navigate(`/buyer/payments/${paymentId}`, { replace: true });
        },
        onError: () => {
            showAlert('결제 승인 중 오류가 발생했습니다.');
            // 이후 주문 목록으로 이동
            setTimeout(() => navigate('/buyer/orders', { replace: true }), 3000);
        }
    });

    useEffect(() => {
        if (orderId && userId && pgToken) {
            mutation.mutate();
        }
    }, [orderId, userId, pgToken, mutation]);

    return (
        <>
            <AlertModal
                message={alertProps.message}
                type={alertProps.type}
                show={alertProps.show}
            />

            <div className="p-6 text-center">
                {mutation.isLoading
                    ? '결제 승인 처리 중…'
                    : mutation.isError
                        ? '오류가 발생했습니다.'
                        : null
                }
            </div>
        </>
    );
}
