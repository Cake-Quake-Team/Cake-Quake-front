// src/pages/buyer/review/ReviewDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReviewDetail from '../../../components/review/reviewDetail.jsx';
import { getMyReviewDetail, deleteMyReview } from '../../../api/reviewApi.jsx';
import AlertModal from '../../../components/common/AlertModal';
import ConfirmModal from '../../../components/common/ConfirmModal';

export default function ReviewDetailPage() {
    const { reviewId } = useParams();
    const nav = useNavigate();
    const [review, setReview] = useState(null);

    // AlertModal state
    const [alertProps, setAlertProps] = useState({
        show: false,
        message: '',
        type: 'success'
    });
    const showAlert = (message, type = 'success') => {
        setAlertProps({ show: true, message, type });
        setTimeout(() => setAlertProps(a => ({ ...a, show: false })), 3000);
    };

    // ConfirmModal state
    const [confirmProps, setConfirmProps] = useState({ show: false });

    useEffect(() => {
        (async () => {
            try {
                const data = await getMyReviewDetail(reviewId);
                setReview(data);
            } catch (e) {
                console.error('리뷰 불러오기 실패', e);
                showAlert('리뷰를 불러올 수 없습니다.', 'error');
                nav('/buyer/reviews');
            }
        })();
    }, [reviewId, nav]);

    // open confirm modal
    const handleDeleteClick = () => {
        setConfirmProps({ show: true });
    };

    const handleConfirmDelete = async () => {
        setConfirmProps({ show: false });
        try {
            await deleteMyReview(reviewId);
            showAlert('삭제되었습니다.', 'success');
            nav('/buyer/reviews');
        } catch (e) {
            console.error('삭제 실패', e);
            showAlert('삭제에 실패했습니다.', 'error');
        }
    };

    const handleCancelDelete = () => {
        setConfirmProps({ show: false });
    };

    if (!review) return <div className="text-center py-20">로딩 중…</div>;

    return (
        <>
            <AlertModal
                message={alertProps.message}
                type={alertProps.type}
                show={alertProps.show}
            />

            <ConfirmModal
                show={confirmProps.show}
                message="정말 삭제하시겠습니까?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            <ReviewDetail
                review={review}
                onEdit={() => nav(`/buyer/reviews/${reviewId}/edit`)}
                onDelete={handleDeleteClick}
                onBack={() => nav(-1)}
            />
        </>
    );
}
