// src/components/qna/QnAForm.jsx
import React, { useState, useEffect } from 'react';

// — 문의 유형 상수 정의 —
const QnATypes = {
    STORE_REPORT:         'STORE_REPORT',
    FEATURE_REQUEST:      'FEATURE_REQUEST',
    GENERAL_INQUIRY:      'GENERAL_INQUIRY',
    NEW_MATERIAL_REQUEST: 'NEW_MATERIAL_REQUEST'
};

// 역할별 옵션 매핑
const typeOptionsByRole = {
    BUYER: [
        { value: QnATypes.STORE_REPORT,    label: '매장 신고' },
        { value: QnATypes.FEATURE_REQUEST, label: '기능 개선 요청' },
        { value: QnATypes.GENERAL_INQUIRY, label: '일반 문의' }
    ],
    SELLER: [
        { value: QnATypes.NEW_MATERIAL_REQUEST, label: '재료 추가 요청' },
        { value: QnATypes.FEATURE_REQUEST,      label: '기능 개선 요청' },
        { value: QnATypes.GENERAL_INQUIRY, label: '일반 문의' }
    ],
    ADMIN: []
};

export function QnAForm({
                            initial     = {},
                            onSubmit,
                            submitLabel = '저장',
                            userRole    = 'BUYER'
                        }) {
    const [qnAType, setQnAType] = useState('');
    const [title,   setTitle]   = useState('');
    const [content, setContent] = useState('');

    // initial이 바뀔 때 폼 상태에 반영
    useEffect(() => {
        setQnAType(initial.qnAType || '');
        setTitle(initial.title   || '');
        setContent(initial.content || '');
    }, [initial]);

    const options = typeOptionsByRole[userRole] || [];

    const handle = e => {
        e.preventDefault();
        onSubmit({ qnAType, title, content });
    };

    return (
        <form onSubmit={handle} className="qna-form space-y-4">
            {/* 문의 유형 */}
            <div>
                <label className="block font-medium">문의 유형</label>
                <select
                    className="w-full border p-2 rounded"
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

            {/* 제목 */}
            <div>
                <label className="block font-medium">제목</label>
                <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
            </div>

            {/* 내용 */}
            <div>
                <label className="block font-medium">내용</label>
                <textarea
                    className="w-full border p-2 rounded"
                    rows={5}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                />
            </div>

            <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
            >
                {submitLabel}
            </button>
        </form>
    );
}
