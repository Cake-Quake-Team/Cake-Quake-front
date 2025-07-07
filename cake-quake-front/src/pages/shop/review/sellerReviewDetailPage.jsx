// src/pages/shop/review/SellerReviewDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReviewDetail from '../../../components/review/reviewDetail.jsx';

import {
    getShopReviewDetail,
    replyToShopReview,
    requestDeleteShopReview
} from '../../../api/reviewApi.jsx';
import ResultModal from "../../../components/common/resultModal.jsx";

export default function SellerReviewDetailPage() {
    const { shopId, reviewId } = useParams();
    const navigate = useNavigate();

    const [review, setReview] = useState(null);
    const [alreadyRequested, setAlreadyRequested] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const [deleting, setDeleting] = useState(false);

    // 모달 상태
    const [modalMsg, setModalMsg] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const closeResultModal = () => setModalOpen(false);

    // 리뷰 불러오기
    useEffect(() => {
        (async () => {
            try {
                const data = await getShopReviewDetail(shopId, reviewId);
                setReview(data);
                setAlreadyRequested(!!data.requestId);
            } catch (e) {
                console.error('리뷰 상세 로드 실패', e);
                setModalMsg('리뷰를 불러올 수 없습니다.');
                setModalOpen(true);
                navigate(`/shops/${shopId}/reviews`);
            }
        })();
    }, [shopId, reviewId, navigate]);

    // 답글 생성/수정
    const handleReplyEdit = async (_reviewId, newReply) => {
        try {
            await replyToShopReview(shopId, _reviewId, { reply: newReply });
            setReview(prev => ({ ...prev, reply: newReply }));
            setModalMsg('답글이 저장되었습니다.');
            setModalOpen(true);
        } catch (e) {
            console.error('답글 저장 실패', e);
            setModalMsg('답글을 저장하는 데 실패했습니다.');
            setModalOpen(true);
        }
    };

    // 삭제 요청
    const openDeleteForm = () => setShowDeleteForm(true);
    const cancelDelete = () => {
        setDeleteReason('');
        setShowDeleteForm(false);
    };
    const confirmDeleteRequest = async () => {
        if (!deleteReason.trim()) {
            setModalMsg('삭제 사유를 입력해 주세요.');
            setModalOpen(true);
            return;
        }
        setDeleting(true);
        try {
            await requestDeleteShopReview(shopId, reviewId, deleteReason);
            setModalMsg('삭제 요청이 전송되었습니다.');
            setModalOpen(true);
            navigate(`/shops/${shopId}/reviews`);
        } catch (e) {
            console.error('삭제 요청 실패', e);
            const status = e.response?.status;
            const msg =
                status === 409
                    ? '이미 삭제 요청이 접수된 리뷰입니다.'
                    : status >= 500
                        ? '서버 오류로 삭제 요청에 실패했습니다.'
                        : '삭제 요청에 실패했습니다.';
            setModalMsg(msg);
            setModalOpen(true);
        } finally {
            setDeleting(false);
        }
    };

    if (!review) {
        return <div className="text-center py-20">로딩 중…</div>;
    }

    return (
        <>
            <ReviewDetail
                review={review}
                onEdit={null}
                onDelete={openDeleteForm}
                onBack={() => navigate(-1)}
                onReplyEdit={handleReplyEdit}
                showEdit={false}
                showReplyEdit={true}
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

            <ResultModal show={modalOpen} closeResultModal={closeResultModal} msg={modalMsg} />
        </>
    );
}
