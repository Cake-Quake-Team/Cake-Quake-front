import React, { useEffect, useState } from 'react';
import { QnAList } from '../../components/qna/QnAList';
import { useNavigate } from 'react-router';
import {  getMyQnAList } from '../../api/qnaApi.jsx';
import { Headphones } from 'lucide-react';

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


    return (
        <div className="container mx-auto p-4">

            {/* 헤더: 헤드셋 아이콘 + 타이틀, 버튼 */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold flex items-center">
                    <Headphones size={28} className="mr-2 text-indigo-600" />
                    고객 센터
                </h1>
                <button
                    onClick={() => navigate('create')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    문의 작성
                </button>
            </div>

            {/* Q&A 리스트만 렌더링 */}
            <QnAList items={items} onView={onView} />

            {/* 페이징 */}
            {hasNext && (
                <button
                    onClick={() => fetch(page + 1)}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    더 보기
                </button>
            )}
        </div>
    );
}
