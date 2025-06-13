// src/pages/buyer/review/ReviewDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReviewDetail from '../../../components/review/reviewDetail.jsx';
import { getMyReviewDetail, deleteMyReview } from '../../../api/reviewApi.jsx';

export default function ReviewDetailPage() {
    const { reviewId } = useParams();
    const nav = useNavigate();
    const [review, setReview] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await getMyReviewDetail(reviewId);
                setReview(data);
            } catch {
                alert('리뷰를 불러올 수 없습니다.');
                nav('/buyer/reviews');
            }
        })();
    }, [reviewId, nav]);

    const handleDelete = async () => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        await deleteMyReview(reviewId);
        alert('삭제되었습니다.');
        nav('/buyer/reviews');
    };

    if (!review) return <div className="text-center py-20">로딩 중…</div>;

    return (
        <ReviewDetail
            review={review}
            onEdit={() => nav(`/buyer/reviews/${reviewId}/edit`)}
            onDelete={handleDelete}
            onBack={() => nav(-1)}
            // 구매자는 답글 수정 권한이 없으므로 onReplyEdit는 넘기지 않음
        />
    );
}
