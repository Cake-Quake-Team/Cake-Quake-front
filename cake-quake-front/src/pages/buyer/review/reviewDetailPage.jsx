import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router";
import {deleteMyReview, getMyReviewDetail} from "../../../api/reviewApi.jsx";
import ReviewDetail from "../../../components/review/reviewDetail.jsx";

export default function ReviewDetailPage() {
    const {reviewId} = useParams();
    const [review, setReview] = useState(null);
    const nav = useNavigate();

    useEffect(()=>{
        async function fetchDetail() {
            try {
                const data = await getMyReviewDetail(reviewId);
                setReview(data);
            } catch (e) {
                console.error('리뷰 상세 로드 실패', e);
            }
        }
        fetchDetail();
    },[reviewId]);


    const handleDelete = async() => {
        if (!window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) return;
        try {
            await deleteMyReview(reviewId);
            alert('리뷰가 삭제 되었습니다');
            nav('/buyer/reviews');
        } catch (e) {
            console.error('리뷰 삭제 실패', e);
            alert('삭제에 실패했습니다.')
        }
    };

    if(!review) return <div>로딩 중...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* 페이지 제목 */}
            <h1 className="text-3xl font-bold text-center mb-6 relative inline-block">
                리뷰 상세
                <span className="absolute left-0 bottom-0 w-full h-1 bg-green-400"></span>
            </h1>

            {/* 상세 컴포넌트 */}
            <ReviewDetail
                review={review}
                onBack={() => nav(-1)}  // 뒤로가기
                onDelete={handleDelete()}
                onEdit={() => nav(`/buyer/reviews/${reviewId}/edit`)}
            />
        </div>
    );
}
