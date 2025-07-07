// src/pages/admin/review/DeletionRequestAdminPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    getDeletionRequests,
    approveDeletionRequest,
    rejectDeletionRequest
} from '../../api/reviewApi.jsx';

export default function DeletionRequestAdminPage() {
    const [requests, setRequests] = useState([]);
    const [page,     setPage]     = useState(1);
    const [hasMore,  setHasMore]  = useState(true);
    const [loading,  setLoading]  = useState(false);

    // 무한 스크롤 IntersectionObserver
    const observer = useRef();
    const lastRef = useCallback(node => {
        if (loading) return;
        observer.current?.disconnect();
        observer.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMore) {
                setPage(p => p + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // 데이터 로딩
    useEffect(() => {
        setLoading(true);
        getDeletionRequests({ page, size: 20 })
            .then(payload => {
                const body    = payload.data ?? payload;
                const content = Array.isArray(body.content) ? body.content : [];
                setRequests(prev =>
                    page === 1 ? content : [...prev, ...content]
                );
                setHasMore(Boolean(body.hasNext));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [page]);

    // 승인/거절 핸들러
    const handleApprove = async id => {
        await approveDeletionRequest(id);
        setRequests(prev => prev.filter(r => r.requestId !== id));
    };
    const handleReject = async id => {
        await rejectDeletionRequest(id);
        setRequests(prev => prev.filter(r => r.requestId !== id));
    };

    return (
        <div className="bg-white shadow rounded-lg">
            {/* 제목 */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
                <h1 className="text-2xl font-bold">리뷰 삭제 요청 관리</h1>
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed divide-y divide-gray-200">
                    {/* colgroup 으로 너비 고정 */}
                    <colgroup>
                        <col className="w-16" />    {/* # */}
                        <col className="w-1/5" />   {/* 매장명 */}
                        <col className="w-2/5" />   {/* 리뷰 내용 */}
                        <col className="w-1/5" />   {/* 사유 */}
                        <col className="w-1/5" />   {/* 요청일 */}
                        <col className="w-40" />    {/* 액션 */}
                    </colgroup>

                    <thead className="bg-gray-50">
                    <tr>
                        <th className="py-4 px-6 text-left text-base font-medium text-gray-600">
                            #
                        </th>
                        <th className="py-4 px-6 text-left text-base font-medium text-gray-600">
                            매장명
                        </th>
                        <th className="py-4 px-6 text-left text-base font-medium text-gray-600">
                            리뷰 내용
                        </th>
                        <th className="py-4 px-6 text-left text-base font-medium text-gray-600">
                            사유
                        </th>
                        <th className="py-4 px-6 text-left text-base font-medium text-gray-600">
                            요청일
                        </th>
                        <th className="py-4 px-6 text-center text-base font-medium text-gray-600">

                        </th>
                    </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-100">
                    {requests.map((r, idx) => {
                        const isLast = idx === requests.length - 1;
                        return (
                            <tr
                                key={r.requestId}
                                ref={isLast ? lastRef : null}
                                className="hover:bg-gray-50"
                            >
                                {/* 번호 */}
                                <td className="py-4 px-6 text-sm text-gray-700 whitespace-nowrap">
                                    {r.requestId}
                                </td>

                                {/* 매장명: multiline 허용 */}
                                <td className="py-4 px-6 text-sm text-gray-700 whitespace-normal break-words">
                                    {r.shopName}
                                </td>

                                {/* 리뷰 내용: multiline 허용 */}
                                <td className="py-4 px-6 text-sm text-gray-700 whitespace-normal break-words">
                                    {r.reviewContent}
                                </td>

                                {/* 사유: multiline 허용 */}
                                <td className="py-4 px-6 text-sm text-gray-700 whitespace-normal break-words">
                                    {r.reason}
                                </td>

                                {/* 요청일 */}
                                <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                                    {new Date(r.regDate).toLocaleString()}
                                </td>

                                {/* 액션 버튼 */}
                                <td className="py-4 px-6 text-sm text-center space-x-2 whitespace-nowrap">
                                    <button
                                        onClick={() => handleApprove(r.requestId)}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        승인
                                    </button>
                                    <button
                                        onClick={() => handleReject(r.requestId)}
                                        className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50"
                                    >
                                        거절
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* 로딩 / 끝 안내 */}
            <div className="px-6 py-4 text-center text-gray-500">
                {loading && <span>더 불러오는 중…</span>}
                {!hasMore && <span>더 이상 요청이 없습니다.</span>}
            </div>
        </div>
    );
}
