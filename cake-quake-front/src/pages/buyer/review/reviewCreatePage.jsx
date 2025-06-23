// src/pages/buyer/reviews/ReviewCreatePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router";
import ReviewForm from "../../../components/review/reviewForm.jsx";
import { createReview } from "../../../api/reviewApi.jsx";
import { getCakeDetail } from "../../../api/cakeApi.jsx";
import { getOrderDetail } from "../../../api/buyerOrderApi.jsx";

export default function ReviewCreatePage() {
    const { orderId } = useParams();
    const nav = useNavigate();

    // 실제로 불러온 데이터를 담을 상태
    const [cakeId, setCakeId]             = useState(null);
    const [product, setProduct]           = useState(null);
    const [temperature, setTemperature]   = useState(null);

    const [values, setValues]             = useState({ rating: 0, content: '', reviewPictureUrl: '' });
    const [submitting, setSubmitting]     = useState(false);

    // 1) 주문 정보 조회 → order.orderItems[0].cake.id 와 predictedTemperature 세팅
    useEffect(() => {
        async function loadOrder() {
            try {
                const { data: order } = await getOrderDetail(orderId);

                // 🔍 받아온 전체 order 객체 확인
                               console.log("주문 상세", order);

                               // (옵션) 화면에 raw JSON 찍기용 state
                // setDebugOrder(order);
                // orderItems 배열에서 첫 번째 아이템의 cake 정보 꺼내기
                if (Array.isArray(order.orderItems) && order.orderItems.length > 0) {
                    const firstItem = order.orderItems[0];
                    // API가 cakeId 필드를 직접 주면 firstItem.cakeId,
                    // 객체로 주면 firstItem.cake.id 로 접근
                    const id = firstItem.cakeId ?? firstItem.cake?.id;
                    setCakeId(id);
                } else {
                    console.warn("주문에 상품 항목이 없습니다.");
                }

                setTemperature(order.predictedTemperature);
            } catch (e) {
                console.error("주문 정보 조회 실패", e);
            }
        }
        loadOrder();
    }, [orderId]);

    // 2) cakeId 가 준비되면 케이크 상세 정보 조회
    useEffect(() => {
        if (!cakeId) return;
        async function loadCake() {
            try {
                const { data: cake } = await getCakeDetail(cakeId);
                setProduct({
                    imageUrl: cake.thumbnailUrl,
                    name:     cake.name,
                    store:    cake.bakeryName,
                    date:     cake.createdAt, // 필요에 따라 포맷팅
                });
            } catch (e) {
                console.error("케이크 정보 조회 실패", e);
            }
        }
        loadCake();
    }, [cakeId]);

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
            nav('/buyer/reviews');
        } catch (e) {
            console.error('리뷰 작성 실패', e);
            alert('리뷰 작성에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    // 로딩 중
    if (!product || temperature == null) {
        return <div className="text-center py-20">정보 로딩 중...</div>;
    }

    // 사진 첨부 여부에 따라 포인트(500/1000), 온도(+1) 계산
    const displayPoints       = values.reviewPictureUrl ? 1000 : 500;
    const displayTemperature  = temperature + (values.reviewPictureUrl ? 1 : 0);

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <h2 className="text-xl font-bold text-center relative mb-6">
                리뷰 쓰기
                <span className="absolute bottom-0 left-1/2 w-[100px] h-0.5 bg-black -translate-x-1/2" />
            </h2>

            <ReviewForm
                product={product}
                points={displayPoints}
                temperature={displayTemperature}
                values={values}
                onChange={handleChange}
                submitting={submitting}
                onSubmit={handleSubmit}
                submitLabel="작성하기"
            />
        </div>
    );
}
