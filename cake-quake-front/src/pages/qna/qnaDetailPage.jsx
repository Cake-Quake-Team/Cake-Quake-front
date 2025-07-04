// src/pages/qna/QnADetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getMyQnADetail, deleteMyQnA } from '../../api/qnaApi.jsx';
import { QnADetail } from '../../components/qna/QnADetail.jsx';

export default function QnADetailPage() {
    const { qnaId } = useParams();
    const navigate  = useNavigate();
    const [qna, setQna] = useState(null);

    useEffect(() => {
        getMyQnADetail(qnaId).then(setQna);
    }, [qnaId]);

    const handleEdit = () => navigate('edit');    // → ./edit
    const handleDelete = async () => {
        if (!window.confirm('삭제하시겠습니까?')) return;
        await deleteMyQnA(qnaId);
        navigate('..');  // → 부모 경로(../)인 리스트로
    };
    const handleBack = () => navigate('..');      // ← 뒤로

    if (!qna) return <div>로딩중...</div>;

    return (
        <div className="container mx-auto p-4">
            <button onClick={handleBack} className="mb-4 text-blue-600">
                ← 목록으로
            </button>
            <QnADetail
                qna={qna}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
