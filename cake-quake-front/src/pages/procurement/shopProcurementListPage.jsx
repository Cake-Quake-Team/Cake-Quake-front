import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    getStoreRequests,
    getStoreRequestByStatus
} from '../../api/procurementApi.jsx';
import { ProcurementListComponent } from '../../components/procurement/procurementList.jsx';

const STATUS_OPTIONS = [
    { value: '', label: '전체' },
    { value: 'REQUESTED', label: '요청됨' },
    { value: 'COMPLETED', label: '주문 완료' },
    { value: 'SHIPPED', label: '발송됨' },
    { value: 'DELIVERED', label: '도착완료' },
    { value: 'CANCELLED', label: '취소됨' },
];

export default function ShopProcurementListPage() {
    const { shopId } = useParams();
    const navigate   = useNavigate();

    const [status, setStatus]   = useState('');
    const [requests, setRequests] = useState([]);
    const [page, setPage]       = useState(1);
    const [hasNext, setHasNext] = useState(false);

    // 1) 상태 변경 시 초기 로드
    useEffect(() => {
        setRequests([]);
        setPage(1);
        loadPage(1, true);
    }, [shopId, status]);

    // 2) 페이지 로드 (append 논리 내장)
    const loadPage = async (pageToLoad = page, reset = false) => {
        try {
            const params = { page: pageToLoad, size: 10 };
            const res = status
                ? await getStoreRequestByStatus(shopId, status, params)
                : await getStoreRequests(shopId, params);

            setRequests(prev =>
                reset
                    ? res.content
                    : [...prev, ...res.content]
            );
            setHasNext(res.hasNext);
            setPage(pageToLoad + 1);
        } catch (err) {
            console.error('발주 목록 로딩 실패', err);
        }
    };

    const handleClickItem = id => {
        navigate(`/seller/${shopId}/procurements/${id}`);
    };

    const handleCreate = () => {
        navigate(`/seller/${shopId}/procurements/create`);
    };

    return (
        <div className="container mx-auto p-4 space-y-4">
            {/* 헤더: 왼쪽에 타이틀, 오른쪽에 버튼+필터 */}
            <div className="flex items-center justify-between">
                {/* 왼쪽 끝: 발주 목록 타이틀 */}
                <h1 className="text-3xl font-bold">발주 목록</h1>

                {/* 오른쪽 끝: 새 발주 생성 버튼 + 상태 필터 */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        새 발주 생성
                    </button>
                    <div className="flex items-center">
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
                </div>
            </div>

            <ProcurementListComponent
                requests={requests}
                hasNext={hasNext}
                onLoadMore={() => loadPage()}
                onClickItem={handleClickItem}
            />
        </div>
    );
}
