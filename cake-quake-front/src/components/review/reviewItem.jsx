import React from 'react';

export default function ReviewItem({ review, onEdit }) {
    return (
        <div className="flex items-start bg-white border rounded-lg shadow-sm p-4">
            {/* 썸네일 */}
            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border">
                {review.reviewPictureUrl
                    ? <img src={review.reviewPictureUrl} alt="" className="object-cover w-full h-full"/>
                    : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                }
            </div>

            {/* 텍스트 영역 */}
            <div className="ml-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-semibold text-lg">{review.content}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                    {/* 별점 표시 (읽기 전용) */}
                    <div className="flex items-center text-yellow-500">
                        {Array.from({ length: 5 }, (_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 fill-current ${i < review.rating ? '' : 'text-gray-300'}`}
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z"/>
                            </svg>
                        ))}
                    </div>
                    {/* 수정 버튼 */}
                    <button
                        onClick={() => onEdit(review.reviewId)}
                        className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
                    >
                        수정
                    </button>
                </div>
            </div>
        </div>
    );
}
