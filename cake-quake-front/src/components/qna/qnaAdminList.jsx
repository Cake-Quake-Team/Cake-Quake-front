// src/components/qna/admin/QnAAdminList.jsx
import React from 'react';

export function QnAAdminList({ items, onRespond }) {
    return (
        <table className="min-w-full border">
            <thead className="bg-gray-100">
            <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">작성자UID</th>
                <th className="px-4 py-2">유형</th>
                <th className="px-4 py-2">제목</th>
                <th className="px-4 py-2">상태</th>
                <th className="px-4 py-2">작성일</th>
                <th className="px-4 py-2">액션</th>
            </tr>
            </thead>
            <tbody>
            {items.map(q => (
                <tr key={q.qnaId} className="border-t">
                    <td className="px-4 py-2">{q.qnaId}</td>
                    <td className="px-4 py-2">{q.uid}</td>
                    <td className="px-4 py-2">{q.type}</td>
                    <td className="px-4 py-2">{q.title}</td>
                    <td className="px-4 py-2">{q.status}</td>
                    <td className="px-4 py-2">{new Date(q.regDate).toLocaleString()}</td>
                    <td className="px-4 py-2">
                        <button
                            onClick={() => onRespond(q.qnaId)}
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                        >
                            답변
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
