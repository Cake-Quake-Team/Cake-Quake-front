// src/pages/payment/TossFailPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import AlertModal from '../../components/common/AlertModal';

export default function TossFailPage() {
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
        const errorMessage = qs.get('errorMessage') || '알 수 없는 오류';
        showAlert(`토스페이 결제 실패: ${errorMessage}`);
        // 모달이 사라진 후 뒤로 이동
        const timer = setTimeout(() => navigate(-1), 3000);
        return () => clearTimeout(timer);
    }, [search, navigate]);

    return (
        <>
            <AlertModal
                message={alertProps.message}
                type={alertProps.type}
                show={alertProps.show}
            />
            <p className="p-6 text-center">토스페이 결제 실패 처리 중…</p>
        </>
    );
}
