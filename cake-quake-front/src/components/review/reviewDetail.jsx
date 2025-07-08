// src/components/review/reviewDetail.jsx
import React, { useState } from 'react';

export default function ReviewDetail({
                                         review,
                                         onEdit,          // 리뷰 자체 수정
                                         onDelete,        // 리뷰 삭제
                                         onBack,          // 뒤로가기
                                         onReplyEdit,     // 답글 수정 handler
                                         showEdit = true, // 리뷰 수정 버튼 여부
                                         showReplyEdit = false // 답글 수정 버튼 노출 여부
                                     }) {
    const [isEditingReply, setIsEditingReply] = useState(false);
    const [editedReply, setEditedReply] = useState(review.reply || '');

    const startEditReply = () => {
        setEditedReply(review.reply || '');
        setIsEditingReply(true);
    };
    const cancelEditReply = () => {
        setIsEditingReply(false);
        setEditedReply(review.reply || '');
    };
    const saveReply = () => {
        onReplyEdit(review.reviewId, editedReply);
        setIsEditingReply(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            {review.reviewPictureUrl && (
                <div className="w-full flex justify-center mb-6">
                    <img
                        src={`http://localhost${review.reviewPictureUrl}`}
                        alt={`리뷰 이미지 ${review.reviewId}`}
                        loading="lazy"
                        className="rounded object-contain max-w-full max-h-96"
                    />
                </div>
            )}

            {/* 별점 */}
            <div className="flex items-center text-yellow-500 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                    <svg
                        key={i}
                        viewBox="0 0 20 20"
                        className={`w-5 h-5 fill-current ${i < review.rating ? '' : 'text-gray-300'}`}
                    >
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z" />
                    </svg>
                ))}
            </div>

            {/* 내용 */}
            <p className="text-gray-700 mb-6">{review.content}</p>

            {/* 작성일 */}
            <div className="text-xs text-gray-500 mb-6">
                작성일: {new Date(review.regDate).toLocaleString()}
            </div>

            {/* 버튼 그룹 */}
            <div className="flex space-x-4 mb-6">
                {showEdit && (
                    <button
                        onClick={onEdit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        수정하기
                    </button>
                )}
                <button
                    onClick={onDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    {showEdit ? '삭제하기' : '삭제 요청'}
                </button>
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                    뒤로가기
                </button>
            </div>

            {/* 답글 섹션 */}
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 space-y-4">
                <h4 className="font-semibold">답글</h4>

                {isEditingReply ? (
                    <div className="space-y-2">
            <textarea
                value={editedReply}
                onChange={e => setEditedReply(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
                        <div className="flex space-x-2">
                            <button
                                onClick={saveReply}
                                disabled={!editedReply.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                저장
                            </button>
                            <button
                                onClick={cancelEditReply}
                                className="px-4 py-2 border bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-start">
                        <p className="text-gray-700 flex-1">{review.reply}</p>
                        {showReplyEdit && onReplyEdit && (
                            <button
                                onClick={startEditReply}
                                className="text-sm text-blue-600 hover:underline ml-4"
                            >
                                답글 수정하기
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
