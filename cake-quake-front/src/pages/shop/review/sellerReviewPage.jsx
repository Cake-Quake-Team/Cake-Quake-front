// src/pages/seller/SellerReviewsPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
    getShopReviews,
    replyToShopReview
} from "../../../api/reviewApi.jsx";

import ReviewList from "../../../components/review/reviewList.jsx";

export default function SellerReviewsPage() {
    const { shopId } = useParams();
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [page, setPage]       = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasNext, setHasNext] = useState(true);

    // 1. 페이지 로드 & page 변경 시 리뷰 불러오기
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await getShopReviews(shopId, { page, size: 10 });
                const items = data.content || [];
                setReviews(prev => page === 1 ? items : [...prev, ...items]);
                setHasNext(data.hasNext);
            } catch (e) {
                console.error('리뷰 로드 실패', e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [shopId, page]);

    // 2. 마지막 항목 관찰 시 다음 페이지 로드
    const handleLoadMore = () => {
        if (!loading && hasNext) {
            setPage(prev => prev + 1);
        }
    };

    // 3. 답글 달기
    const handleReply = async (reviewId, reply) => {
        await replyToShopReview(shopId, reviewId, { reply });
        setReviews(rs =>
            rs.map(r => r.reviewId === reviewId ? { ...r, reply } : r)
        );
    };

    // 4. 상세 페이지 이동
    const handleDetail = reviewId => {
        navigate(`/shops/${shopId}/reviews/${reviewId}`);
    };

    return (
            <div className="max-w-3xl mx-auto p-6">
                {/* 헤더(탭은 레이아웃에서) */}
                <h2 className="text-xl font-bold text-center relative mb-6">
                    가게 리뷰
                    <span className="absolute bottom-0 left-1/2 w-[100px] h-0.5 bg-black -translate-x-1/2" />
                </h2>

                {/* 공통 무한 스크롤 리스트 */}
                <ReviewList
                    reviews={reviews}
                    loading={loading}
                    hasNext={hasNext}
                    onLoadMore={handleLoadMore}
                    showEdit={false}
                    showReply={true}
                    onEdit={handleReply}
                    onDetail={handleDetail}
                />
            </div>
    );
}
