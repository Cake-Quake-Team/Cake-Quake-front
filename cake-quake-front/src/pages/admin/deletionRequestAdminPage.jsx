// src/pages/admin/review/DeletionRequestAdminPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    getDeletionRequests,
    approveDeletionRequest,
    rejectDeletionRequest
} from '../../api/reviewApi.jsx';

export default function DeletionRequestAdminPage() {
    const [requests, setRequests] = useState([]);
    const [page, setPage]       = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const observer = useRef();
    const lastRef = useCallback(node => {
        if (loading) return;
        observer.current?.disconnect();
        observer.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMore) {
                setPage(p => p + 1);
            }
        });
        node && observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        setLoading(true);
        getDeletionRequests({ page, size: 20 })
            .then(payload => {
                const body = payload.data ?? payload;
                const content = Array.isArray(body.content) ? body.content : [];
                const next = Boolean(body.hasNext);

                       setRequests(prev => [...prev, ...content]);
                       setRequests(prev =>
                            page === 1
                              ? content        // 1페이지면 새로 교체
                                  : [...prev, ...content]  // 2이상 페이징이면 이어붙이기
                              );
                setHasMore(next);
            })
            .catch(err => {
                console.error('❌ getDeletionRequests 에러', err);
                /* ... */
            })
            .finally(() => setLoading(false));
    }, [page]);

    const handleApprove = async id => {
        try {
            await approveDeletionRequest(id);
            setRequests(prev => prev.filter(r => r.reviewId !== id));
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                alert('관리자 권한이 필요합니다. 로그인해주세요.');
            } else {
                alert('승인 처리 중 오류가 발생했습니다.');
            }
        }
    };

    const handleReject = async id => {
        try {
            await rejectDeletionRequest(id);
            setRequests(prev => prev.filter(r => r.reviewId !== id));
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                alert('관리자 권한이 필요합니다. 로그인해주세요.');
            } else {
                alert('거절 처리 중 오류가 발생했습니다.');
            }
        }
    };

    if (loading && requests.length === 0) {
        return <div className="p-6">로딩 중…</div>;
    }
    if (!loading && requests.length === 0) {
        return <div className="p-6">현재 삭제 요청이 없습니다.</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4"> 리뷰 삭제 요청</h1>
            <ul className="space-y-4">
                {requests.map((r, idx) => (
                    <li
                        key={r.requestId}
                        ref={idx === requests.length - 1 ? lastRef : null}
                        className="border rounded p-4 flex justify-between items-start"
                    >
                        <div>
                            {/*<p><strong>요청 ID:</strong> {r.requestId}</p>*/}
                            {/*<p><strong>리뷰 ID:</strong> {r.reviewId}</p>*/}
                            <p><strong>리뷰 내용: </strong> {r.reviewContent}</p>
                            <p className="mt-1"><strong>사유:</strong> {r.reason}</p>
                            <p className="mt-1 text-sm text-gray-500">
                                요청일: {new Date(r.regDate).toLocaleString()}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <button
                                onClick={() => handleApprove(r.reviewId)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                승인
                            </button>
                            <button
                                onClick={() => handleReject(r.reviewId)}
                                className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
                            >
                                거절
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {loading && <div className="text-center mt-4">더 불러오는 중…</div>}
            {!hasMore && (
                <div className="text-center text-gray-500 mt-4">
                    더 이상 요청이 없습니다.
                </div>
            )}
        </div>
    );
}
