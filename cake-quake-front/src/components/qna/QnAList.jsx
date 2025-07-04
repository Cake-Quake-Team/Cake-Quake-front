import React from 'react';

export function QnAList({ items, onView, onEdit, onDelete }) {
    return (
        <div className="qna-list">
            {items.map(q => (
                <div key={q.qnaId} className="qna-item border-b py-2">
                    <h3 className="font-semibold cursor-pointer" onClick={() => onView(q.qnaId)}>
                        [{q.status}] {q.title}
                    </h3>
                    <p className="text-sm text-gray-600">작성일: {new Date(q.regDate).toLocaleString()}</p>
                    <div className="mt-1 space-x-2">
                        <button onClick={() => onEdit(q.qnaId)} className="text-blue-500">수정</button>
                        <button onClick={() => onDelete(q.qnaId)} className="text-red-500">삭제</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
