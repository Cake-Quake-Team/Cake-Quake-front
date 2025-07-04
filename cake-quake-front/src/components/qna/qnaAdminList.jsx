import React from 'react';

// — 문의 유형 및 상태 한글 매핑 —
const typeLabels = {
    STORE_REPORT:         '매장 신고',
    FEATURE_REQUEST:      '기능 개선 요청',
    GENERAL_INQUIRY:      '일반 문의',
    NEW_MATERIAL_REQUEST: '재료 추가 요청'
};
const statusLabels = {
    OPEN:        '접수됨',
    CLOSED:      '완료'
};

export function QnAAdminList({ items, onRespond }) {
    const dateOptions = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
                <thead>
                <tr className="bg-gray-100">
                    {['ID','작성자 UID','유형','제목','상태','작성일','답변'].map(h => (
                        <th
                            key={h}
                            className="px-4 py-2 text-left text-sm font-semibold text-gray-600"
                        >
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {items.map(q => (
                    <tr
                        key={q.qnaId}
                        className="border-b even:bg-gray-50 hover:bg-gray-100"
                    >
                        <td className="px-4 py-3 text-sm text-gray-700">{q.qnaId}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                            {q.memberId /* 또는 q.userId */}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                            {typeLabels[q.qnAType] || q.qnAType}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                            {q.title}
                        </td>
                        <td className="px-4 py-3 text-sm">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                  {statusLabels[q.status] || q.status}
                </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                            {new Date(q.regDate).toLocaleString('ko-KR', dateOptions)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                            <button
                                onClick={() => onRespond(q.qnaId)}
                                className="px-3 py-1 border border-indigo-500 text-indigo-600 rounded hover:bg-indigo-50 transition"
                            >
                                답변
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
