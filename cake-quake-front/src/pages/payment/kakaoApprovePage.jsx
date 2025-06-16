import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const KakaoApprovePage = () => {
    const [params] = useSearchParams();

    useEffect(() => {
        const orderId = params.get('partner_order_id');
        const userId = params.get('partner_user_id');
        const pgToken = params.get('pg_token');

        if (!orderId || !userId || !pgToken) {
            alert('필수 파라미터 누락');
            return;
        }

        const approve = async () => {
            try {
                const res = await axios.get('/api/payments/kakao/approve', {
                    params: {
                        partner_order_id: orderId,
                        partner_user_id: userId,
                        pg_token: pgToken,
                    },
                });

                alert('결제 완료!');
                console.log('승인 성공:', res.data);
            } catch (e) {
                alert('승인 실패');
                console.error(e);
            }
        };

        approve();
    }, [params]);

    return <div>결제 승인 중입니다...</div>;
};

export default KakaoApprovePage;
