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
const StatusLabel = {
    PENDING:     '답변 대기',
    COMPLETED:   '답변 완료',
    IN_PROGRESS: '진행 중',
    CLOSED:      '종료'
};

// QnA List Component
export function QnAList({ items, onView }) {
    return (
        <div className="space-y-4">
            {items.map(q => (
                <div
                    key={q.qnaId}
                    onClick={() => onView(q.qnaId)}
                    className="p-4 bg-white shadow rounded-2xl hover:shadow-md transition-shadow border border-gray-200 cursor-pointer"
                >
                    <div className="flex items-center justify-between">
                        <div>
              <span className="inline-block mr-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                {StatusLabel[q.status] || q.status}
              </span>
                            <span className="text-lg font-semibold hover:text-blue-600">
                {q.title}
              </span>
                        </div>
                        <span className="text-sm text-gray-500">
              {new Date(q.regDate).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
              })}
            </span>
                    </div>
                </div>
            ))}
        </div>
    );
}