// src/pages/point/PointPage.jsx
import React, { useState, useEffect } from "react";
import { getPointBalance, getPointHistory } from "../../../api/pointApi.jsx";
import PointSummary from "../../../components/point/PointSummary.jsx";
import FilterTabs   from "../../../components/point/FilterTabs.jsx";
import HistoryList  from "../../../components/point/PointHistory.jsx";

export default function PointPage() {
    const PAGE_SIZE = 10;

    const [balanceInfo, setBalanceInfo] = useState({
        available: 0,
        total:     0,
        expiring:  0,
    });
    const [history, setHistory] = useState([]);
    const [filter,  setFilter]  = useState("all"); // all|earn|use
    const [page,    setPage]    = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState("");

    const loadAll = async () => {
        setLoading(true);
        try {
            // 1) 잔액
            const curr = await getPointBalance();
            setBalanceInfo({
                available: curr,
                total:     curr,  // 필요하면 누적/소멸 API 따로 호출
                expiring:  0,
            });

            // 2) 내역
            const { items, hasNext } = await getPointHistory({
                page: 1,
                size: PAGE_SIZE,
            });
            setHistory(items);
            setHasNext(hasNext);
            setPage(1);
        } catch (e) {
            console.error("PointPage.loadAll 오류", e);
            setError(e.response?.data?.message || e.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (!hasNext) return;
        setLoading(true);
        try {
            const next = page + 1;
            const { items, hasNext: more } = await getPointHistory({
                page: next,
                size: PAGE_SIZE,
            });
            setHistory(prev => [...prev, ...items]);
            setHasNext(more);
            setPage(next);
        } finally {
            setLoading(false);
        }
    };

    // 필터링: enum ChangeType (EARN, USE) → toLowerCase()
    const filtered = history.filter(item => {
        if (filter === "all") return true;
        return item.changeType.toLowerCase() === filter;
    });

    const showRecent10 = () => {
        setHistory(history.slice(0, 10));
        setHasNext(false);
    };

    useEffect(() => {
        loadAll();
    }, []);

    return (
        <div className="max-w-xl mx-auto p-4 space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}

            <PointSummary
                available={balanceInfo.available}
                total={balanceInfo.total}
                expiring={balanceInfo.expiring}
            />

            <FilterTabs
                filter={filter}
                onChange={setFilter}
                onRecent10={showRecent10}
            />

            {loading && <p className="text-center">로딩 중…</p>}

            <HistoryList
                items={filtered}
                hasNext={hasNext}
                onLoadMore={loadMore}
            />
        </div>
    );
}
