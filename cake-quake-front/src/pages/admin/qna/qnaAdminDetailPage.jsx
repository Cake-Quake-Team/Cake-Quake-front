import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {getQnADetailForAdmin} from "../../../api/qnaApi.jsx";
import {QnAAdminDetail} from "../../../components/qna/qnaAdminDetail.jsx";


export default function QnAAdminDetailPage() {
    const { qnaId } = useParams();
    const navigate = useNavigate();
    const [qna, setQna] = useState(null);

    useEffect(() => {
        getQnADetailForAdmin(qnaId)
            .then(data => setQnA(data))
            .catch(() => alert('상세 정보를 불러오지 못했습니다.'));
    }, [qnaId]);

    const handleBack = () => navigate(-1);

    if (!qna) {
        return <div className="container mx-auto p-4">로딩중...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={handleBack}
                className="mb-4 text-blue-600 hover:underline"
            >
                ← 목록으로
            </button>
            <h1 className="text-2xl font-bold mb-6">Q&A 문의 상세보기</h1>
            <QnAAdminDetail qna={qna} />
        </div>
    );
}
