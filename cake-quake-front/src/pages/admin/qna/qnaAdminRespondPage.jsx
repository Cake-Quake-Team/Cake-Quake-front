// src/pages/admin/qnaAdminRespondPage.jsx
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from "react-router";
import {getQnADetailForAdmin, respondToQnA} from "../../../api/qnaApi.jsx";
import {QnAAdminRespondForm} from "../../../components/qna/qnaAdminRespondForm.jsx";


export default function QnAAdminRespondPage() {
    const { qnaId } = useParams();
    const navigate  = useNavigate();
    const [qna, setQnA] = useState(null);

    useEffect(() => {
        getQnADetailForAdmin(qnaId)
            .then(data => setQnA(data))
            .catch(() => {
                alert("불러오기 실패");
                navigate(-1);
            });
    }, [qnaId]);

    const handleSubmit = async ({ adminResponse }) => {
        await respondToQnA({ qnaId, adminResponse });
        alert("답변 등록 완료");
        navigate(-1);
    };

    if (!qna) return <div className="p-4">로딩 중…</div>;

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* 상세 정보 */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold">문의 #{qna.qnaId}</h2>
                <p><strong>작성자:</strong> {qna.uid}</p>
                <p><strong>유형:</strong> {qna.qnAType}</p>
                <p><strong>제목:</strong> {qna.title}</p>
                <p className="whitespace-pre-wrap mt-2">{qna.content}</p>
            </div>

            {/* 답변 폼 (컴포넌트 재사용) */}
            <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-medium mb-2">관리자 답변</h3>
                <QnAAdminRespondForm
                    initialResponse={qna.adminResponse}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
