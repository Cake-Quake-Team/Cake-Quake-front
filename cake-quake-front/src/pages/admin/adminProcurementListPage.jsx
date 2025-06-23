// src/pages/admin/AdminProcurementListPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getAllRequests } from '../../api/procurementApi.jsx';
import { AdminProcurementList } from '../../components/procurement/AdminProcurementList.jsx';

export default function AdminProcurementListPage() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);

    useEffect(() => {
        fetchList(1, true);
    }, []);

    const fetchList = async (fetchPage, replace = false) => {
        try {
            const res = await getAllRequests({ page: fetchPage, size: 10 });
            const newItems = replace
                ? res.content
                : res.content.filter(r => !requests.some(existing => existing.procurementId === r.procurementId));
            setRequests(prev => replace ? newItems : [...prev, ...newItems]);
            setHasNext(res.hasNext);
            setPage(fetchPage + 1);
        } catch (err) {
            console.error('전체 발주 목록 로딩 실패', err);
        }
    };

    const handleLoadMore = () => {
        fetchList(page);
    };

    const handleClickItem = id => {
        navigate(`/admin/procurements/${id}/confirm`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl mb-4">전체 발주 목록 (Admin)</h1>
            <AdminProcurementList
                requests={requests}
                hasNext={hasNext}
                onLoadMore={handleLoadMore}
                onClickItem={handleClickItem}
            />
        </div>
    );
}
