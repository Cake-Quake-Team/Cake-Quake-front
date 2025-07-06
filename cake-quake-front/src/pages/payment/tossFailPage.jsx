import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TossFailPage() {
    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const qs = new URLSearchParams(search);
        const errorMessage = qs.get('errorMessage');
        alert(`토스페이 결제 실패: ${errorMessage}`);
        navigate(-1);
    }, [search, navigate]);

    return <p>토스페이 결제 실패 처리 중…</p>;
}
