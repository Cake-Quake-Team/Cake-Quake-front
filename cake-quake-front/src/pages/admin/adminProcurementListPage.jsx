import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
    getAllRequests,
    getRequestByStatus
} from '../../api/procurementApi.jsx';
import { AdminProcurementList } from '../../components/procurement/adminProcurementList.jsx';

const STATUS_OPTIONS = [
    { value: '', label: '전체' },
    { value: 'REQUESTED', label: '요청됨' },
    { value: 'SCHEDULED', label: '일정지정' },
    { value: 'SHIPPED', label: '발송됨' },
    { value: 'DELIVERED', label: '도착완료' },
    { value: 'CANCELLED', label: '취소됨' },
];

export default function AdminProcurementListPage() {
    const navigate = useNavigate();

    const [status, setStatus]   = useState('');
    const [requests, setRequests] = useState([]);
    const [page, setPage]       = useState(1);
    const [hasNext, setHasNext] = useState(false);

    // 1) 상태 변경 시 목록 초기화
    useEffect(() => {
        setRequests([]);
        setPage(1);
        loadPage(1, true);
    }, [status]);

    // 2) 페이지 로드 함수 (append 여부 자동 판단)
    const loadPage = async (pageToLoad = page, reset = false) => {
        try {
            const params = { page: pageToLoad, size: 10 };
            const res = status
                ? await getRequestByStatus(status, params)
                : await getAllRequests(params);

            setRequests(prev =>
                reset
                    ? res.content
                    : [...prev, ...res.content]
            );
            setHasNext(res.hasNext);
            setPage(pageToLoad + 1);
        } catch (err) {
            console.error('관리자 발주 목록 로딩 실패', err);
        }
    };

    const handleClickItem = id => {
        navigate(`/admin/procurements/${id}/confirm`);
    };

    return (
        <div className="container mx-auto p-4 space-y-4">
            <h1 className="text-3xl">전체 발주 목록 (Admin)</h1>

            <div>
                <label className="mr-2 font-medium">상태 필터:</label>
                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <AdminProcurementList
                requests={requests}
                hasNext={hasNext}
                onLoadMore={() => loadPage()}
                onClickItem={handleClickItem}
            />
        </div>
    );
}
