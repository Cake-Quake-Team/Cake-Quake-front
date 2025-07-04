import React from 'react';

export function QnADetail({ qna, onEdit, onDelete }) {
    return (
        <div className="qna-detail space-y-4">
            <h2 className="text-2xl font-bold">{qna.title}</h2>
            <p className="text-gray-600">작성일: {new Date(qna.regDate).toLocaleString()}</p>
            <div className="prose">
                <p>{qna.content}</p>
            </div>
            {qna.adminResponse && (
                <div className="response p-4 bg-gray-50 border-l-4 border-blue-400">
                    <h3 className="font-semibold">관리자 답변</h3>
                    <p>{qna.adminResponse}</p>
                </div>
            )}
            <div className="space-x-2">
                <button onClick={onEdit} className="px-3 py-1 bg-blue-500 text-white rounded">수정</button>
                <button onClick={onDelete} className="px-3 py-1 bg-red-500 text-white rounded">삭제</button>
            </div>
        </div>
    );
}
