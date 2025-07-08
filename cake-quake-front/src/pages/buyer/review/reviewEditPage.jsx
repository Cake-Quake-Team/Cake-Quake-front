// src/pages/review/ReviewEditPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ReviewForm from '../../../components/review/reviewForm.jsx';
import { getMyReviewDetail, updateMyReview } from '../../../api/reviewApi.jsx';
import AlertModal from '../../../components/common/AlertModal';

export default function ReviewEditPage() {
    const { reviewId } = useParams();
    const nav = useNavigate();

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

    // 1) form 값
    const [values, setValues] = useState({
        rating: 0,
        content: '',
        reviewPictureUrl: ''    // string(URL) 또는 File
    });
    // 2) product 카드용 값
    const [product, setProduct] = useState({
        imageUrl: '',
        name: '',
        store: '',
        date: ''
    });
    // 3) 상태
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 더미 포인트·온도 (필요에 맞게 바꿔 주세요)
    const points = 10;
    const temperature = 0.5;

    // 기존 리뷰 불러오기
    useEffect(() => {
        (async () => {
            try {
                const data = await getMyReviewDetail(reviewId);
                // form 초기값 세팅
                setValues({
                    rating: data.rating,
                    content: data.content,
                    reviewPictureUrl: data.reviewPictureUrl || null
                });
                // product 카드 초기값 세팅 (create 페이지와 동일한 스펙)
                setProduct({
                    imageUrl: data.reviewPictureUrl || '',
                    name: data.cname,
                    store: '',  // 백엔드에 매장 정보가 있다면 data.store 로 바꿔주세요
                    date: new Date(data.regDate).toLocaleString()
                });
            } catch (e) {
                console.error('리뷰 불러오기 실패', e);
                showAlert('리뷰를 불러올 수 없습니다.', 'error');
                nav(-1);
            } finally {
                setLoading(false);
            }
        })();
    }, [reviewId, nav]);

    const handleChange = (field, value) => {
        setValues(v => ({ ...v, [field]: value }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('rating', values.rating);
            fd.append('content', values.content);
            if (values.reviewPictureUrl instanceof File) {
                fd.append('reviewPictureUrl', values.reviewPictureUrl);
            }
            await updateMyReview(reviewId, fd);
            showAlert('리뷰가 수정되었습니다.', 'success');
            nav('/buyer/reviews');
        } catch (e) {
            console.error('리뷰 수정 실패', e);
            showAlert('수정에 실패했습니다.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20">로딩 중…</div>;
    }

    return (
        <>
            <AlertModal
                message={alertProps.message}
                type={alertProps.type}
                show={alertProps.show}
            />

            <div className="min-h-screen bg-gray-50 py-10">
                {/* 제목 */}
                <h2 className="text-xl font-bold text-center relative mb-6">
                    리뷰 수정
                    <span className="absolute bottom-0 left-1/2 w-[100px] h-0.5 bg-black -translate-x-1/2"></span>
                </h2>

                <ReviewForm
                    product={product}
                    points={points}
                    temperature={temperature}
                    values={values}
                    onChange={handleChange}
                    submitting={submitting}
                    onSubmit={handleSubmit}
                    submitLabel="수정하기"
                />
            </div>
        </>
    );
}
