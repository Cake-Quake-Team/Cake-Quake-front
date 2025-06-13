import React, {useCallback, useRef} from 'react';
import ReviewItem from "./reviewItem.jsx";

export default function ReviewList({
                                       reviews = [],
                                       loading,hasNext,onLoadMore,
                                       onEdit,
                                       onDetail,
                                   showEdit=true,
                                   showReply= false}) {
    //IntersectionObserver 인스턴스를 저장할 ref
    const observer = useRef();

    const lastRef = useCallback(
        (node) =>{
            if(loading) return; //로딩 중이면 아무 동작도 하지 않음
            if(observer.current) observer.current.disconnect(); //기존 관찰 해제

            observer.current = new IntersectionObserver((entries)=>{
                if(entries[0].isIntersecting && hasNext) {
                    onLoadMore();
                }
            });
            if(node) observer.current.observe(node);
        },
        [loading,hasNext,onLoadMore]
    )

    //로딩 중이고 아직 리뷰가 하나도 로드되지 않은 경우
    if(loading && reviews.length === 0){
        return <div>로딩 중 .....</div>
    }

    if(reviews.length === 0){
        return <div>작성된 리뷰가 없습니다.</div>
    }

    return (
        <ul className="space-y-4">
            {reviews.map((r, i) => {
                const isLast = i === reviews.length - 1; // 현재 아이템이 마지막인지 여부
                return (
                    <li
                        key={r.reviewId}
                        // 마지막 아이템에만 lastRef 부착 → 스크롤 시 콜백 트리거
                        ref={isLast ? lastRef : null}
                    >
                        <ReviewItem review={r}
                                    onEdit={onEdit}
                                    onDetail={onDetail}
                                    showEdit={showEdit}
                                    showReply={showReply}
                        />
                    </li>
                );
            })}

            {/* hasNext가 false면 추가 데이터가 없으므로 안내 메시지 출력 */}
            {!hasNext && (
                <li className="text-center text-gray-500">
                    더 이상 리뷰가 없습니다.
                </li>
            )}
        </ul>
    );
}

