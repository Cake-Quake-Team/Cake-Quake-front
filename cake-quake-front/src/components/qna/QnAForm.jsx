import React, { useState, useEffect } from 'react';

const QnATypes = {
    STORE_REPORT:         'STORE_REPORT',
    FEATURE_REQUEST:      'FEATURE_REQUEST',
    GENERAL_INQUIRY:      'GENERAL_INQUIRY',
    NEW_MATERIAL_REQUEST: 'NEW_MATERIAL_REQUEST'
};

const typeOptionsByRole = {
    BUYER: [
        { value: QnATypes.STORE_REPORT,    label: '매장 신고' },
        { value: QnATypes.FEATURE_REQUEST, label: '기능 개선 요청' },
        { value: QnATypes.GENERAL_INQUIRY, label: '일반 문의' }
    ],
    SELLER: [
        { value: QnATypes.NEW_MATERIAL_REQUEST, label: '재료 추가 요청' },
        { value: QnATypes.FEATURE_REQUEST,      label: '기능 개선 요청' },
        { value: QnATypes.GENERAL_INQUIRY,      label: '일반 문의' }
    ],
    ADMIN: []
};

export function QnAForm({ initial = {}, onSubmit, submitLabel = '저장', userRole = 'BUYER' }) {
    const [qnAType, setQnAType] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        setQnAType(initial.qnAType || '');
        setTitle(initial.title || '');
        setContent(initial.content || '');
    }, [initial]);

    const options = typeOptionsByRole[userRole] || [];

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit({ qnAType, title, content });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-6">
            <div>
                <label className="block mb-2 font-medium text-gray-700">문의 유형</label>
                <select
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={qnAType}
                    onChange={e => setQnAType(e.target.value)}
                    required
                >
                    <option value="" disabled>–– 유형을 선택하세요 ––</option>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-2 font-medium text-gray-700">제목</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="block mb-2 font-medium text-gray-700">내용</label>
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    rows={6}
                    placeholder="문의 내용을 입력하세요"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                />
            </div>

            <div className="text-right">
                <button
                    type="submit"
                    className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-lg transition"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
