// src/components/qna/admin/QnAAdminRespondForm.jsx
import React, { useState } from 'react';

export function QnAAdminRespondForm({ initialResponse = '', onSubmit }) {
    const [response, setResponse] = useState(initialResponse);

    const handle = e => {
        e.preventDefault();
        onSubmit({ adminResponse: response });
    };

    return (
        <form onSubmit={handle} className="space-y-4">
            <div>
                <label className="block font-medium">답변 내용</label>
                <textarea
                    className="w-full border p-2 rounded"
                    rows={6}
                    value={response}
                    onChange={e => setResponse(e.target.value)}
                    required
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
            >
                답변 등록
            </button>
        </form>
    );
}
