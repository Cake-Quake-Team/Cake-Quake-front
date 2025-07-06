// src/pages/qna/QnAFormPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { QnAForm } from '../../components/qna/QnAForm.jsx';
import { useAuth } from '../../store/AuthContext.jsx';
import { createQnA, getMyQnADetail, updateQnA } from '../../api/qnaApi.jsx';

export default function QnAFormPage() {
    const { qnaId } = useParams();
    const isEdit = Boolean(qnaId);
    const [initial, setInitial] = useState({});
    const navigate = useNavigate();
    const { user } = useAuth(); // { uid, role: 'BUYER' | 'SELLER' | 'ADMIN' }

    useEffect(() => {
        if (isEdit) {
            getMyQnADetail(qnaId).then(data => {
                setInitial({
                    qnAType: data.qnAType,
                    title: data.title,
                    content: data.content
                });
            });
        }
    }, [isEdit, qnaId]);

    const handleSubmit = async payload => {
        if (isEdit) {
            await updateQnA(qnaId, payload);
            navigate('..');                 // 부모 경로(상세)로 상대 이동
        } else {
            const newId = await createQnA(payload);
            navigate(`../${newId}`);        // 생성 후 새 항목 상세로 상대 이동
        }
    };

    return (
        <div className="container mx-auto p-4">
            <QnAForm
                initial={initial}
                onSubmit={handleSubmit}
                submitLabel={isEdit ? '수정 완료' : '작성 완료'}
                userRole={user.role}
            />
        </div>
    );
}
