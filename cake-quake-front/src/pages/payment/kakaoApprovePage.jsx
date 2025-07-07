import React from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { approveKakaoPayment } from '../../api/paymentApi';

export default function KakaoApprovePage() {
    const [qs] = useSearchParams();
    const orderId = qs.get('partner_order_id');
    const userId  = qs.get('partner_user_id');
    const pgToken = qs.get('pg_token');
    const navigate = useNavigate();

// ✅ v5에선 반드시 객체 한 개만 넘깁니다
    const mutation = useMutation({
        mutationFn: () =>
            approveKakaoPayment({ orderId, userId, pgToken }),
        onSuccess: (result) => {
            console.log('✅ approve result:', result);
            // 이제 result.paymentId 가 찍히는지 보시고…
            const { paymentId } = result;
            navigate(`/buyer/payments/${paymentId}`, { replace: true });
        },
        onError: () => {
            alert('결제 승인 중 오류가 발생했습니다.');
            navigate('/buyer/orders', { replace: true });
        }
    });

    React.useEffect(() => {
        if (orderId && userId && pgToken) {
            mutation.mutate();
        }
    }, [orderId, userId, pgToken]);

    return (
        <div className="p-6 text-center">
            {mutation.isLoading
                ? '결제 승인 처리 중…'
                : mutation.isError
                    ? '오류가 발생했습니다.'
                    : null
            }
        </div>
    );
}
