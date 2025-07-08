// src/pages/buyer/reviews/ReviewCreatePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import ReviewForm from '../../../components/review/reviewForm.jsx';
import { createReview } from '../../../api/reviewApi.jsx';
import { getCakeDetail } from '../../../api/cakeApi.jsx';
import { getOrderDetail } from '../../../api/buyerOrderApi.jsx';
import AlertModal from '../../../components/common/AlertModal';

export default function ReviewCreatePage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    // AlertModal 상태 & helper
    const [alertProps, setAlertProps] = useState({
        show: false,
        message: '',
        type: 'success'
    });
    const showAlert = (message, type = 'success') => {
        setAlertProps({ show: true, message, type });
        setTimeout(() => setAlertProps(a => ({ ...a, show: false })), 3000);
    };

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
                if (order.items?.length) {
                    setCakeId(order.items[0].cakeId);
                }
            } catch (e) {
                console.error('주문 정보 조회 실패', e);
                showAlert('주문 정보 조회에 실패했습니다.', 'error');
            }
        }
        loadOrder();
    }, [orderId]);

    // 2) shopId, cakeId 준비되면 케이크 상세 조회
    useEffect(() => {
        if (!shopId || !cakeId) return;
        async function loadCake() {
            try {
                const { cakeDetailDTO } = await getCakeDetail(shopId, cakeId);
                setProduct({
                    imageUrl: cakeDetailDTO.thumbnailImageUrl,
                    name:     cakeDetailDTO.cname,
                });
            } catch (e) {
                console.error('케이크 정보 조회 실패', e);
                showAlert('케이크 정보 조회에 실패했습니다.', 'error');
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
            showAlert('리뷰가 성공적으로 작성되었습니다.', 'success');
            navigate('/buyer/reviews');
        } catch (e) {
            console.error('리뷰 작성 실패', e);
            showAlert('리뷰 작성에 실패했습니다.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (!product) {
        return <div className="text-center py-20">정보 로딩 중...</div>;
    }

    // 사진 첨부 시 포인트·온도
    const displayPoints = values.reviewPictureUrl ? 1000 : 500;
    const displayTemperature = values.reviewPictureUrl ? 1 : 0;

    return (
        <>
            <AlertModal
                message={alertProps.message}
                type={alertProps.type}
                show={alertProps.show}
            />

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
        </>
    );
}
