import React from 'react';

export default function ReviewDetail({ review, onEdit, onDelete, onBack }) {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            {/* 1. 원본 이미지 */}
            {review.reviewPictureUrl && (
                <img
                    src={`http://localhost${review.reviewPictureUrl}`}
                    alt={`리뷰 이미지 ${review.reviewId}`}
                    className="w-full h-auto object-contain rounded mb-6"
                    loading="lazy"
                />
            )}


            {/* 3. 별점 */}
            <div className="flex items-center text-yellow-500 mb-4">
                {Array.from({length: 5}, (_, i) => (
                    <svg
                        key={i}
                        viewBox="0 0 20 20"
                        className={`w-5 h-5 fill-current ${i < review.rating ? '' : 'text-gray-300'}`}
                    >
                        <path
                            d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z"/>
                    </svg>
                ))}
            </div>

            {/* 4. 상세 내용 */}
            <p className="text-gray-700 mb-6">
                {review.content}
            </p>

            {/* 5. 작성일 */}
            <div className="text-xs text-gray-500 mb-6">
                작성일: {new Date(review.regDate).toLocaleString()}
            </div>

            {/* 버튼 그룹 */}
            <div className="flex space-x-4">
                <button
                    onClick={onEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    수정하기
                </button>
                <button
                    onClick={onDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    삭제하기
                </button>
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                    뒤로가기
                </button>
            </div>
        </div>
    );
}
