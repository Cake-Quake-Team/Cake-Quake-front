// src/pages/admin/QnAAdminListPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import {listAllQnA, listQnAByAuthorRole, listQnAByStatus, listQnAByType} from "../../../api/qnaApi.jsx";
import {QnAAdminList} from "../../../components/qna/qnaAdminList.jsx";


export default function QnAAdminListPage() {
    const { type, status, role } = useParams();
    const [searchParams] = useSearchParams();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const navigate = useNavigate();
    const size = parseInt(searchParams.get('size')) || 10;

    const fetch = async (p = 1) => {
        let payload;
        if (type) {
            payload = await listQnAByType(type, { page: p, size });
        } else if (status) {
            payload = await listQnAByStatus(status, { page: p, size });
        } else if (role) {
            payload = await listQnAByAuthorRole(role, { page: p, size });
        } else {
            payload = await listAllQnA({ page: p, size });
        }

        setItems(p === 1 ? payload.content : prev => [...prev, ...payload.content]);
        setHasNext(payload.hasNext);
        setPage(p);
    };

    useEffect(() => { fetch(1); }, [type, status, role]);

    const onRespond = qnaId => {
        navigate(`/admin/qna/${qnaId}/respond`);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Q&A 관리</h1>
            <QnAAdminList items={items} onRespond={onRespond} />
            {hasNext && (
                <button
                    onClick={() => fetch(page + 1)}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded"
                >
                    더 보기
                </button>
            )}
        </div>
    );
}
