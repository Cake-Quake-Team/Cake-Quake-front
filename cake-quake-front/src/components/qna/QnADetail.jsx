// src/components/qna/QnADetail.jsx
import React from 'react';

// — 문의 & 상태 라벨 매핑 —
const QnATypes = {
    STORE_REPORT:         'STORE_REPORT',
    FEATURE_REQUEST:      'FEATURE_REQUEST',
    GENERAL_INQUIRY:      'GENERAL_INQUIRY',
    NEW_MATERIAL_REQUEST: 'NEW_MATERIAL_REQUEST'
};
const QnATypesLabel = {
    [QnATypes.STORE_REPORT]:         '매장 신고',
    [QnATypes.FEATURE_REQUEST]:      '기능 개선 요청',
    [QnATypes.GENERAL_INQUIRY]:      '일반 문의',
    [QnATypes.NEW_MATERIAL_REQUEST]: '재료 추가 요청'
};
const statusLabels = {
    OPEN:        '접수됨',
    IN_PROGRESS: '처리 중',
    CLOSED:      '완료'
};


// QnA Detail Component
export function QnADetail({ qna, onEdit, onDelete }) {
    const formattedQnADate = new Date(qna.regDate).toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
    const formattedRespDate = qna.adminResponseDate
        ? new Date(qna.adminResponseDate).toLocaleString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        })
        : null;

    return (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{qna.title}</h2>
                <div className="text-sm text-gray-500 space-x-6">
                    <span>아이디: {qna.memberId}</span>
                    <span>유형: {QnATypesLabel[qna.qnAType]}</span>
                    <span>상태: {statusLabels[qna.status] || qna.status}</span>
                    <span>작성: {formattedQnADate}</span>
                </div>
            </div>

            {/* Question Content */}
            <div className="p-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
                {qna.content}
            </div>

            {/* Admin Response */}
            {qna.adminResponse && (
                <div className="m-6 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">답변 내용</h3>
                        {formattedRespDate && (
                            <span className="text-sm text-gray-500">답변 날짜: {formattedRespDate}</span>
                        )}
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{qna.adminResponse}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 p-6 bg-gray-50">
                <button
                    onClick={onEdit}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 focus:outline-none transition"
                >
                    수정
                </button>
                {qna.status !== 'CLOSED' && (
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 focus:outline-none transition"
                    >
                        삭제
                    </button>
                )}
            </div>
        </div>
    );
}
