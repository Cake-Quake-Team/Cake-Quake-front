import React, { useEffect, useState } from 'react';
import { QnAList } from '../../components/qna/QnAList';

import { useNavigate } from 'react-router';
import {deleteMyQnA, getMyQnAList} from "../../api/qnaApi.jsx";

export default function QnAListPage() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const navigate = useNavigate();

    const fetch = async (p = 1) => {
        const { content, hasNext: nxt } = await getMyQnAList({ page: p, size: 10 });
        setItems(p === 1 ? content : [...items, ...content]);
        setHasNext(nxt);
        setPage(p);
    };

    useEffect(() => { fetch(); }, []);

    const onView = id => navigate(`${id}`);
    const onEdit = id => navigate(`${id}/edit`);
    const onDelete = async id => {
        if (!window.confirm('삭제하시겠습니까?')) return;
        await deleteMyQnA(id);
        fetch(1);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">내 문의 목록</h1>
            <button
                onClick={() => navigate('create')}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                문의 작성
            </button>
            <QnAList items={items} onView={onView} onEdit={onEdit} onDelete={onDelete} />
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
