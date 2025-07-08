// src/pages/admin/QnAAdminRespondPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getQnADetailForAdmin, respondToQnA } from '../../../api/qnaApi.jsx';
import { QnAAdminRespondForm } from '../../../components/qna/qnaAdminRespondForm.jsx';
import AlertModal from '../../../components/common/AlertModal';

// 한글 매핑
const typeLabels = {
    STORE_REPORT:         '매장 신고',
    FEATURE_REQUEST:      '기능 개선 요청',
    GENERAL_INQUIRY:      '일반 문의',
    NEW_MATERIAL_REQUEST: '재료 추가 요청'
};
const statusLabels = {
    OPEN:        '접수됨',
    IN_PROGRESS: '처리 중',
    CLOSED:      '완료'
};

export default function QnAAdminRespondPage() {
    const { qnaId } = useParams();
    const navigate = useNavigate();
    const [qna, setQnA] = useState(null);

    // AlertModal 상태
    const [alertProps, setAlertProps] = useState({
        show: false,
        message: '',
        type: 'success'
    });
    const showAlert = (message, type = 'success') => {
        setAlertProps({ show: true, message, type });
        setTimeout(() => setAlertProps(a => ({ ...a, show: false })), 3000);
    };

    useEffect(() => {
        getQnADetailForAdmin(qnaId)
            .then(data => setQnA(data))
            .catch(() => {
                showAlert('문의 정보를 불러오는 데 실패했습니다.', 'error');
                navigate(-1);
            });
    }, [qnaId, navigate]);

    const handleSubmit = async ({ adminResponse }) => {
        try {
            await respondToQnA({ qnaId, adminResponse });
            showAlert('답변이 등록되었습니다.', 'success');
            navigate(-1);
        } catch (e) {
            console.error('답변 등록 실패', e);
            showAlert('답변 등록에 실패했습니다.', 'error');
        }
    };

    if (!qna) {
        return <div className="p-4 text-center">로딩 중…</div>;
    }

    // 날짜 포맷
    const fmtDate = d => new Date(d).toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <>
            <AlertModal
                message={alertProps.message}
                type={alertProps.type}
                show={alertProps.show}
            />

            <div className="container mx-auto p-4 space-y-6">
                {/* 상세 정보 */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-4">문의: {qna.title}</h2>
                    <ul className="space-y-2 text-gray-700">
                        <li><strong>작성자 UID:</strong> {qna.memberId}</li>
                        <li><strong>유형:</strong> {typeLabels[qna.qnAType] || qna.qnAType}</li>
                        <li><strong>상태:</strong> {statusLabels[qna.status] || qna.status}</li>
                        <li><strong>작성일:</strong> {fmtDate(qna.regDate)}</li>
                    </ul>
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                        <h3 className="font-medium mb-2">문의 내용</h3>
                        <p className="whitespace-pre-wrap text-gray-800">{qna.content}</p>
                    </div>
                </div>

                {/* 답변 폼 */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <QnAAdminRespondForm
                        initialResponse={qna.adminResponse}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate(-1)}
                    />
                </div>
            </div>
        </>
    );
}
