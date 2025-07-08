// src/components/qna/admin/QnAAdminRespondForm.jsx
import React, { useState } from 'react';

export function QnAAdminRespondForm({
                                        initialResponse = '',
                                        onSubmit,
                                        onCancel      // 취소 기능이 필요하면 부모에서 전달
                                    }) {
    const [response, setResponse] = useState(initialResponse);

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit({ adminResponse: response });
    };

    return (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* 헤더 */}
                <h2 className="text-xl font-semibold text-gray-800">문의에 답변하기</h2>

                {/* 답변 내용 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        답변 내용
                    </label>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        rows={6}
                        placeholder="답변하실 내용을 입력해주세요."
                        value={response}
                        onChange={e => setResponse(e.target.value)}
                        required
                    />
                </div>

                {/* 버튼 그룹 */}
                <div className="flex justify-end space-x-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                            취소
                        </button>
                    )}
                    {/* initialResponse가 없을 때만 등록 버튼 노출 */}
                    {!initialResponse && (
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                        >
                            답변 등록
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
