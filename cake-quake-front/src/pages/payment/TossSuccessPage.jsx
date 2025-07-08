// src/pages/payment/TossSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { approveTossPayment } from '../../api/paymentApi';
import AlertModal from '../../components/common/AlertModal';

export default function TossSuccessPage() {
    const navigate = useNavigate();
    const { search } = useLocation();

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

    useEffect(() => {
        const qs = new URLSearchParams(search);
        const paymentKey = qs.get('paymentKey');
        const orderId    = qs.get('orderId');

        if (!paymentKey || !orderId) {
            showAlert('잘못된 콜백 파라미터입니다.', 'error');
            // 잘못된 파라미터면 뒤로 이동
            setTimeout(() => navigate(-1), 3000);
            return;
        }

        approveTossPayment({ paymentKey, orderId })
            .then(data => {
                showAlert('결제가 승인되었습니다.', 'success');
                // 승인 메시지 잠시 보여준 뒤 상세 페이지로 이동
                setTimeout(() => navigate(`/buyer/payments/${data.paymentId}`), 2000);
            })
            .catch(err => {
                console.error(err);
                showAlert('토스페이 승인 처리 중 오류가 발생했습니다.', 'error');
                // 오류 시 뒤로 이동
                setTimeout(() => navigate(-1), 3000);
            });
    }, [search, navigate]);

    return (
        <>
            <AlertModal
                message={alertProps.message}
                type={alertProps.type}
                show={alertProps.show}
            />
            <p className="p-6 text-center">토스페이 결제 성공 처리 중…</p>
        </>
    );
}
