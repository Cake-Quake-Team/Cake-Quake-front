// src/pages/buyer/reviews/ReviewCreatePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import ReviewForm from '../../../components/review/reviewForm.jsx';
import { createReview } from '../../../api/reviewApi.jsx';
import { getCakeDetail } from '../../../api/cakeApi.jsx';
import { getOrderDetail } from '../../../api/buyerOrderApi.jsx';

export default function ReviewCreatePage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    // shopId, cakeId, 상품 정보
    const [shopId, setShopId] = useState(null);
    const [cakeId, setCakeId] = useState(null);
    const [product, setProduct] = useState(null);

    // 리뷰 폼 상태
    const [values, setValues] = useState({
        rating: 0,
        content: '',
        reviewPictureUrl: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // 1) 주문 정보 조회 → shopId, cakeId 세팅
    useEffect(() => {
        async function loadOrder() {
            try {
                const order = await getOrderDetail(orderId);
                setShopId(order.shopId);
                if (order.items && order.items.length > 0) {
                    setCakeId(order.items[0].cakeId);
                } else {
                    console.warn('주문에 items가 없습니다.', order);
                }
            } catch (e) {
                console.error('주문 정보 조회 실패', e);
            }
        }
        loadOrder();
    }, [orderId]);

    // 2) shopId, cakeId 준비되면 케이크 상세 조회
    useEffect(() => {
        if (!shopId || !cakeId) return;
        async function loadCake() {
            try {
                // API 호출: { cakeDetailDTO, options }
                const { cakeDetailDTO, options } = await getCakeDetail(shopId, cakeId);
                console.log('🎂 케이크 상세 응답:', cakeDetailDTO, options);

                setProduct({
                    imageUrl: cakeDetailDTO.thumbnailImageUrl,
                    name:     cakeDetailDTO.cname,
                });
            } catch (e) {
                console.error('케이크 정보 조회 실패', e);
            }
        }
        loadCake();
    }, [shopId, cakeId]);

    const handleChange = (field, value) => {
        setValues(v => ({ ...v, [field]: value }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('cakeId', cakeId);
            fd.append('rating', values.rating);
            fd.append('content', values.content);
            if (values.reviewPictureUrl) {
                fd.append('reviewPictureUrl', values.reviewPictureUrl);
            }
            await createReview(orderId, fd);
            navigate('/buyer/reviews');
        } catch (e) {
            console.error('리뷰 작성 실패', e);
            alert('리뷰 작성에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!product) {
        return <div className="text-center py-20">정보 로딩 중...</div>;
    }

    // 사진 첨부 시 포인트: 500 or 1000
    const displayPoints = values.reviewPictureUrl ? 1000 : 500;
    // 사진 첨부 시 온도 상승: 0 or 1
    const displayTemperature = values.reviewPictureUrl ? 1 : 0;

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <h2 className="text-xl font-bold text-center relative mb-6">
                리뷰 쓰기
                <span className="absolute bottom-0 left-1/2 w-[100px] h-0.5 bg-black -translate-x-1/2" />
            </h2>


            <ReviewForm
                product={product}
                points={displayPoints}
                temperatureIncrement={displayTemperature}
                values={values}
                onChange={handleChange}
                submitting={submitting}
                onSubmit={handleSubmit}
                submitLabel="작성하기"
            />
        </div>
    );
}
