// src/components/review/ReviewCard.jsx
import React from 'react';
import { format } from 'date-fns';
import { StarIcon } from '@heroicons/react/24/solid';

export default function ReviewCard({ review, onClick }) {
    const {
        reviewId,
        writerName,
        rating,
        content,
        reviewPictureUrl,
        regDate,
        reply
    } = review;

    // 날짜 포맷 (regDate가 유효할 때만)
    let dateText = '';
    if (regDate) {
        const d = new Date(regDate);
        if (!isNaN(d)) dateText = format(d, 'yyyy.MM.dd');
    }

    // 이미지 URL (절대경로/상대경로 모두 대응), 없으면 public/cakeImage/default-cake.png 사용
    const imgSrc = reviewPictureUrl
        ? (reviewPictureUrl.startsWith('http')
            ? reviewPictureUrl
            : `http://localhost${reviewPictureUrl}`)
        : '/cakeImage/default-cake.png';  // public/cakeImage/default-cake.png


    return (
        <div
            onClick={() => onClick(reviewId)}
            className="bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer hover:shadow-md transition"
        >
            <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-t-lg overflow-hidden">
                <img
                    src={imgSrc}
                    alt="리뷰 이미지"
                    // 이미지가 컨테이너 안에 꽉 차지만 잘리진 않도록
                    className="max-w-full max-h-full object-contain"
                />
            </div>
            {/* 작성자/날짜 */}
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800">{writerName}</span>
                <span className="text-xs text-gray-400">{dateText}</span>
            </div>

            {/* 별점 */}
            <div className="flex mb-2">
                {[1,2,3,4,5].map(i => (
                    <StarIcon
                        key={i}
                        className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
                    />
                ))}
            </div>

            {/* 내용 (줄임) */}
            <p className="text-sm text-gray-700 line-clamp-3 mb-3">{content}</p>

            {/* 판매자 답글 */}
            {reply && (
                <div className="mt-auto bg-gray-50 p-2 rounded border-l-4 border-blue-500 text-sm">
                    <strong>답글:</strong> {reply}
                </div>
            )}
        </div>
    );
}
