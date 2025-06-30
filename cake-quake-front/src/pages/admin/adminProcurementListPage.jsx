// src/pages/admin/procurement/AdminProcurementListPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';

import { getAllRequests, getRequestByStatus } from '../../api/procurementApi.jsx';
import { AdminProcurementList }              from '../../components/procurement/AdminProcurementList.jsx';

const STATUS_OPTIONS = [
    { value: 'REQUESTED',  label: '요청됨'   },
    { value: 'COMPLETED',  label: '완료됨'   },  // ← SCHEDULED 대신
    { value: 'SHIPPED',    label: '발송됨'   },
    { value: 'DELIVERED',  label: '도착완료' },
    { value: 'CANCELLED',  label: '취소됨'   },
];

export default function AdminProcurementListPage() {
    const navigate = useNavigate();

    // 필터/그룹화 상태
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [groupBy,          setGroupBy]          = useState('date');
    const [selectedDate,     setSelectedDate]     = useState('');

    // API 데이터
    const [requests, setRequests] = useState([]);
    const [page,     setPage]     = useState(1);
    const [hasMore,  setHasMore]  = useState(false);
    const [loading,  setLoading]  = useState(false);

    // 무한스크롤 옵저버
    const observer = useRef();
    const lastRef = useCallback(node => {
        if (loading) return;
        observer.current?.disconnect();
        observer.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMore) {
                setPage(p => p + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // 상태 토글
    const toggleStatus = value => {
        setPage(1);
        setRequests([]);
        setSelectedStatuses(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    // 데이터 불러오기 (page, filter 변경 시)
    useEffect(() => {
        setLoading(true);
        const params = { page, size: 10 };
        const fetcher = selectedStatuses.length === 1
            ? () => getRequestByStatus(selectedStatuses[0], params)
            : () => getAllRequests(params);

        fetcher()
            .then(res => {
                let data = res.content || [];

                // 다중 상태 필터링
                if (selectedStatuses.length > 1) {
                    data = data.filter(r => selectedStatuses.includes(r.status));
                }
                // 날짜 필터링
                if (groupBy === 'date' && selectedDate) {
                    data = data.filter(r => r.regDate.slice(0, 10) === selectedDate);
                }

                setRequests(prev => page === 1 ? data : [...prev, ...data]);
                setHasMore(res.hasNext);
            })
            .catch(err => console.error('관리자 발주 목록 로딩 실패', err))
            .finally(() => setLoading(false));
    }, [page, selectedStatuses, groupBy, selectedDate]);

    // 상세 페이지 이동
    const handleClickItem = id =>
        navigate(`/admin/procurements/${id}`);

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-3xl font-bold">전체 발주 목록 (Admin)</h1>

            {/* 필터 박스 */}
            <div className="bg-white border border-gray-200 shadow rounded-lg p-4 space-y-4">
                <div className="flex flex-wrap gap-4">
                    {STATUS_OPTIONS.map(opt => (
                        <label key={opt.value} className="inline-flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={selectedStatuses.includes(opt.value)}
                                onChange={() => toggleStatus(opt.value)}
                                className="form-checkbox h-4 w-4 text-indigo-600"
                            />
                            <span className="text-sm text-gray-700">{opt.label}</span>
                        </label>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <label className="inline-flex items-center space-x-2">
                        <input
                            type="radio"
                            name="groupBy"
                            value="date"
                            checked={groupBy === 'date'}
                            onChange={() => setGroupBy('date')}
                            className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span className="text-sm text-gray-700">요청일별 묶기</span>
                    </label>
                    <label className="inline-flex items-center space-x-2">
                        <input
                            type="radio"
                            name="groupBy"
                            value="shop"
                            checked={groupBy === 'shop'}
                            onChange={() => {
                                setGroupBy('shop');
                                setSelectedDate('');
                            }}
                            className="form-radio h-4 w-4 text-indigo-600"
                        />
                        <span className="text-sm text-gray-700">매장별 묶기</span>
                    </label>

                    {groupBy === 'date' && (
                        <div className="inline-flex items-center space-x-2">
                            <label className="text-sm text-gray-700">날짜 선택:</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={e => {
                                    setPage(1);
                                    setSelectedDate(e.target.value);
                                }}
                                className="border rounded px-2 py-1 text-sm"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* 리스트 & 무한스크롤 */}
            <AdminProcurementList
                requests={requests}
                hasNext={hasMore}
                onLoadMore={() => setPage(p => p + 1)}
                onClickItem={handleClickItem}
                groupBy={groupBy}
            />
            <div ref={lastRef}></div>

            {/* 로딩/끝 안내 */}
            <div className="text-center text-gray-500">
                {loading && <p>불러오는 중…</p>}
                {!hasMore && !loading && <p>모든 발주를 불러왔습니다.</p>}
            </div>
        </div>
    );
}
