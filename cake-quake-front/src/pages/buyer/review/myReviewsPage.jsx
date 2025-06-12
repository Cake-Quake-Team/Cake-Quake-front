import React, {useEffect, useState} from 'react';
import {getMyReviewList} from "../../../api/reviewApi.jsx";
import ReviewList from "../../../components/review/reviewList.jsx";
import {useNavigate} from "react-router";

export default function MyReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [page,setPage] =useState(1);
    const [loading, setLoading] = useState(false);
    const [hasNext,setHasNext] = useState(true);
    const nav = useNavigate();

    // useEffect(() => {
    //     setLoading(true);
    //     getMyReviewList({page,size:10})
    //         .then(data =>{
    //             setReviews(prev => page ===1 ? data.items:[...prev, ...data.items]);
    //             setHasNext(data.hasNext);
    //         })
    //         .finally(() => setLoading(false));
    // }, [page]);

    // 1, 페이지 로드 및 page변경 시마다 리뷰 목록을 불러온다.
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await getMyReviewList({ page, size: 10 });
                console.log("백엔드 응답 전체:", data);
                // 아래 항목명은 로그를 보고 실제 필드명에 맞춰 조정하세요
                const items = data.items || data.content || data.dtoList || [];
                setReviews(prev => page === 1 ? items : [...prev, ...items]);
                setHasNext(data.hasNext);
            } catch (e) {
                console.error(e);
                console.error('리뷰 로드를 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [page]);

    //2. 마지막 아이템 관찰 시 호출 -> 다음 페이지 로드
    const handleLoadMore = () => {
        if(hasNext && !loading){
            setPage(prev => prev +1);
        }
    };

    //수정 버튼 클릭 시 상세 페이지로 이동
    const handleEdit = reviewId => {
        nav(`/buyer/reviews/${reviewId}/edit`);
    };

     const handleDetail = reviewId => {
            nav(`/buyer/reviews/${reviewId}`);
         };


    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* 제목 */}
            <h2 className="text-xl font-bold text-center relative mb-6">
                나의 리뷰
                <span  className="absolute bottom-0 left-1/2 w-[100px] h-0.5 bg-black -translate-x-1/2"></span>
            </h2>

            {/* 리뷰 리스트 컴포넌트 */}
            <ReviewList
                reviews={reviews}
                loading={loading}
                hasNext={hasNext}
                onLoadMore={handleLoadMore}
                onEdit={handleEdit}
                onDetail={handleDetail}
            />
        </div>
    );
}
