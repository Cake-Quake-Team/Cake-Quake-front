import React, {useState} from 'react';

export default function ReviewItem({
                                       review,
                                       onEdit,
                                       onDetail,
                                       showEdit = true, //버튼 노출 여부 제어
                                       showReply = false // 판매자 모드일 때 답글 버튼
                                   }) {

    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    const handleReplyClick = () => {
        setIsReplying(true);
    };

    const handleSendReply = async () => {
        if (!replyText.trim()) return;
        setSending(true);
        try {
            await onEdit(review.reviewId, replyText);
            // 성공시 폼 닫기
            setIsReplying(false);
            setReplyText('');
        } catch (e) {
            console.error('답글 전송 실패', e);
            alert('답글 전송에 실패했습니다.');
        } finally {
            setSending(false);
        }
    };

    const handleCancelReply = () => {
        setReplyText('');
        setIsReplying(false);
    };



    return (
        <div className="flex flex-col bg-white border rounded-lg shadow-sm p-4">
           {/*<div >*/}
            <div className="flex items-start justify-between w-full">
            {/* 썸네일 */}
            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border">
                {review.reviewPictureUrl
                    ? <img src={`http://localhost${review.reviewPictureUrl}`} alt=""
                           className="object-cover w-full h-full"/>
                    : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No
                        Image</div>
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
                        {Array.from({length: 5}, (_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 fill-current ${i < review.rating ? '' : 'text-gray-300'}`}
                                viewBox="0 0 20 20"
                            >
                                <path
                                    d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.954L10 0l2.951 5.956 6.561.954-4.756 4.635 1.122 6.545z"/>
                            </svg>
                        ))}
                </div>

                    {/* 수정 버튼 */}
                    <div className="flex space-x-2">
                        {/* ② 답글이 없을 때만 답글 달기 버튼 */}
                        {showReply && !isReplying && !review.reply && (
                            <button
                                onClick={handleReplyClick}
                                className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                            >
                                답글 달기
                            </button>
                        )}
                        {showEdit && (
                        <button
                                onClick={() => onEdit(review.reviewId)}
                                className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
                        >
                                수정
                        </button>
                        )}

                        <button
                            onClick={() => onDetail(review.reviewId)}
                            className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                        >
                            상세보기
                        </button>
                </div>
                </div>
                {/* ① 기존 답글이 있으면 출력 */}
                {review.reply && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-semibold mb-1">답글</h4>
                        <p className="text-gray-700">{review.reply}</p>
                    </div>
                )}

             {isReplying && (
                 <div className="mt-2 flex items-center space-x-2">
    <input
        value={replyText}
        onChange={e => setReplyText(e.target.value)}
        className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        placeholder="답글을 입력하세요"
        disabled={sending}
    />
                     <button
                         onClick={handleSendReply}
                         disabled={!replyText.trim() || sending}
                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                     >
                         전송
                     </button>
                     <button
                         onClick={handleCancelReply}
                         disabled={sending}
                         className="px-4 py-2 border bg-red-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50"
                     >
                         닫기
                     </button>
                 </div>
                    )}
                </div>
            </div>

        </div>
    );

}
