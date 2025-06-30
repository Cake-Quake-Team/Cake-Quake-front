// src/pages/shop/review/SellerReviewDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReviewDetail from '../../../components/review/reviewDetail.jsx';
import { getShopReviewDetail, requestDeleteShopReview } from '../../../api/reviewApi.jsx';

export default function SellerReviewDetailPage() {
    const { shopId, reviewId } = useParams();
    const nav = useNavigate();

    const [review, setReview] = useState(null);
    const [alreadyRequested, setAlreadyRequested] = useState(false);

    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await getShopReviewDetail(shopId, reviewId);
                console.log('🔍 getShopReviewDetail response →', data);
                setReview(data);
                // 백엔드에서 삭제 요청 ID나 플래그로 내려준 필드 이름에 맞춰서 변경하세요.
                // e.g. data.requestId 또는 data.deletionRequested
                setAlreadyRequested(!!data.requestId);
            } catch (e) {
                console.error('리뷰 상세 로드 실패', e);
                alert('리뷰를 불러올 수 없습니다.');
                nav(`/shops/${shopId}/reviews`);
            }
        })();
    }, [shopId, reviewId, nav]);

    const handleReplyEdit = () => {
        // Edit-reply 로직: 모달 띄우거나, 인라인 폼 etc.
    };

    const openDeleteForm = () => {
        setShowDeleteForm(true);
    };

    const cancelDelete = () => {
        setShowDeleteForm(false);
        setDeleteReason('');
    };

    const confirmDeleteRequest = async () => {
        if (!deleteReason.trim()) {
            alert('삭제 사유를 입력해 주세요.');
            return;
        }
        setDeleting(true);
        try {
            await requestDeleteShopReview(shopId, reviewId, deleteReason);
            alert('삭제 요청이 전송되었습니다.');
            nav(`/shops/${shopId}/reviews`);
        } catch (e) {
            console.error(e);
            // 에러 상태에 따라 다른 메시지
                       const status = e.response?.status;
                       let msg;
                       if (status === 409) {
                               msg = '이미 삭제 요청이 접수된 리뷰입니다.';
                           } else if (status >= 500) {
                               msg = '서버 오류로 삭제 요청에 실패했습니다. 잠시 후 다시 시도해주세요.';
                           } else {
                               msg = '삭제 요청에 실패했습니다. 네트워크 상태를 확인 후 다시 시도해주세요.';
                           }
                       window.alert(msg);
        } finally {
            setDeleting(false);
        }
    };

    if (!review) {
        return <div className="text-center py-20">로딩 중…</div>;
    }

    return (
        <div>
            <ReviewDetail
                review={review}
                onEdit={null}
                onDelete={openDeleteForm}
                onBack={() => nav(-1)}
                onReplyEdit={handleReplyEdit}
                showEdit={false}
                showDeleteRequest={!alreadyRequested}
            />

            {showDeleteForm && (
                <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-4">
                    <h3 className="text-lg font-semibold">삭제 요청 사유</h3>
                    <textarea
                        value={deleteReason}
                        onChange={e => setDeleteReason(e.target.value)}
                        rows={4}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                        placeholder="삭제 사유를 입력해주세요"
                        disabled={deleting}
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={confirmDeleteRequest}
                            disabled={deleting}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        >
                            {deleting ? '전송 중…' : '전송'}
                        </button>
                        <button
                            onClick={cancelDelete}
                            disabled={deleting}
                            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
