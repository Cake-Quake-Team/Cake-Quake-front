import React, {useEffect, useState} from "react";
import {getTemperature, getTemperatureHistory} from "../../../api/temperatureApi.jsx";
import FilterTabs from "../../../components/point/filterTabs.jsx";
import HistoryList from "../../../components/point/pointHistory.jsx";


export default function TemperaturePage() {
    const PAGE_SIZE = 10;

    const [temperature, setTemperature] = useState(null);
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            //온도
            const tem = await getTemperature();
            setTemperature(tem);

            //이력
            // 2) 내역
            const {items, hasNext} = await getTemperatureHistory({
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
            const { items, hasNext: more } = await getTemperatureHistory({
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

    const filtered = history.filter(item => {
        if (filter === "all") return true;
        return item.changeType.toLowerCase() === filter;
    });

    useEffect(() => {
        load();
    }, []);


    return (
        <div className="max-w-xl mx-auto p-4 space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}

            {temperature !== null && (
                <div className="text-center text-xl font-semibold text-indigo-600">
                    현재 온도: {temperature}P
                </div>
            )}

            <FilterTabs
                filter={filter}
                onChange={setFilter}
            />

            {loading && <p className="text-center">로딩 중…</p>}

            <HistoryList
                items={filtered}
                hasNext={hasNext}
                onLoadMore={loadMore}
            />
        </div>
    );

};