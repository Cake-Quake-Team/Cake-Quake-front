// src/components/review/ReviewItem.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AlertModal from '../common/AlertModal';

export default function ReviewItem({
                                       review,
                                       onEdit,
                                       onDetail,
                                       showEdit = true,
                                       showReply = false,
                                       showDetail = false
                                   }) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    // AlertModal state & helper
    const [alertProps, setAlertProps] = useState({
        show: false,
        message: '',
        type: 'error'
    });
    const showAlert = (message, type = 'error') => {
        setAlertProps({ show: true, message, type });
        setTimeout(() => setAlertProps(a => ({ ...a, show: false })), 3000);
    };

    const handleReplyClick = () => setIsReplying(true);
    const handleCancelReply = () => {
        setReplyText('');
        setIsReplying(false);
    };
    const handleSendReply = async () => {
        if (!replyText.trim()) return;
        setSending(true);
        try {
            await onEdit(review.reviewId, replyText);
            setReplyText('');
            setIsReplying(false);
            showAlert('답글이 성공적으로 전송되었습니다.', 'success');
        } catch (e) {
            console.error('답글 전송 실패', e);
            showAlert('답글 전송에 실패했습니다.', 'error');
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <AlertModal
                message={alertProps.message}
                type={alertProps.type}
                show={alertProps.show}
            />

            <div className="bg-white border rounded-lg shadow-sm p-4">
                <div className="flex items-start space-x-4">
                    {/* 썸네일 */}
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border">
                        {review.reviewPictureUrl ? (
                            <img
                                src={`http://localhost${review.reviewPictureUrl}`}
                                alt=""
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col">
                        {/* 리뷰 본문 */}
                        <div>
                            <h3 className="font-semibold text-lg">{review.content}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        {/* 별점 + 버튼 */}
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center text-yellow-500">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 fill-current ${
                                            i < review.rating ? '' : 'text-gray-300'
                                        }`}
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <div className="flex space-x-2">
                                {showReply && !isReplying && !review.reply && (
                                    <button
                                        onClick={handleReplyClick}
                                        className="text-black text-sm hover:underline"
                                    >
                                        답글달기
                                    </button>
                                )}
                                {showEdit && (
                                    <button
                                        onClick={() => onEdit(review.reviewId)}
                                        className="text-black text-sm hover:underline"
                                    >
                                        수정
                                    </button>
                                )}
                                {!isReplying && (
                                    <button
                                        onClick={() => onDetail(review.reviewId)}
                                        className="text-black text-sm hover:underline"
                                    >
                                        상세보기
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 기존 답글: 상세보기 모드에서만 노출 */}
                        {showDetail && review.reply && (
                            <div className="mt-3 p-3 rounded-lg border border-gray-300">
                                <h4 className="font-semibold mb-1">답글</h4>
                                <p className="text-gray-700">{review.reply}</p>
                            </div>
                        )}

                        {/* 답글 입력폼 */}
                        {isReplying && (
                            <div className="mt-3 p-3 rounded-lg border border-gray-300">
                <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    rows={3}
                    disabled={sending}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    placeholder="답글을 입력하세요"
                />
                                <div className="mt-2 flex justify-end space-x-3">
                                    <button
                                        onClick={handleCancelReply}
                                        disabled={sending}
                                        className="text-black text-sm hover:underline disabled:opacity-50"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handleSendReply}
                                        disabled={!replyText.trim() || sending}
                                        className="text-black text-sm hover:underline disabled:opacity-50"
                                    >
                                        {sending ? '전송중…' : '전송'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

ReviewItem.propTypes = {
    review:     PropTypes.object.isRequired,
    onEdit:     PropTypes.func.isRequired,
    onDetail:   PropTypes.func.isRequired,
    showEdit:   PropTypes.bool,
    showReply:  PropTypes.bool,
    showDetail: PropTypes.bool
};
