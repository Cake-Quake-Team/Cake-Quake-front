import React, {useEffect, useState} from "react";
import {getTemperature, getTemperatureHistory} from "../../../api/temperatureApi.jsx";
import FilterTabs from "../../../components/temperature/filterTabs.jsx";
import HistoryList from "../../../components/temperature/temperatureHistory.jsx";


export default function TemperaturePage() {
    const PAGE_SIZE = 10;

    const [temperature, setTemperature] = useState(null);
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const currentUserUid = 5;

    const load = async () => {
        if (!currentUserUid) {
            setError("사용자 정보를 찾을 수 없습니다. 로그인 상태를 확인해주세요.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            //온도
            // currentUserUid를 getTemperature 함수에 전달
            const tem = await getTemperature(currentUserUid);
            setTemperature(tem.temperature);

            //이력
            // currentUserUid를 getTemperatureHistory 함수에 전달
            const {items, hasNext} = await getTemperatureHistory({
                uid: currentUserUid, // <-- uid 추가
                page: 1,
                size: PAGE_SIZE,
            });
            setHistory(items);
            setHasNext(hasNext);
            setPage(1);
        } catch (e) {
            console.error("TemperaturePage.loadAll 오류", e); // 로그 메시지 수정 (PointPage -> TemperaturePage)
            setError(e.response?.data?.message || e.message);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (!hasNext || loading) return; // 로딩 중 중복 호출 방지

        if (!currentUserUid) {
            setError("사용자 정보를 찾을 수 없습니다. 로그인 상태를 확인해주세요.");
            return;
        }

        setLoading(true);
        try {
            const next = page + 1;
            const { items, hasNext: more } = await getTemperatureHistory({
                uid: currentUserUid, // <-- uid 추가
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
        // changeType 필드가 문자열일 경우 toLowerCase() 사용 (백엔드 DTO 확인 필요)
        return item.changeType.toLowerCase() === filter;
    });

    useEffect(() => {
        // currentUserUid가 유효할 때만 load 함수를 호출하도록 의존성 추가
        if (currentUserUid) {
            load();
        }
    }, [currentUserUid]); // currentUserUid가 변경될 때마다 다시 로드

    return (
        <div className="max-w-xl mx-auto p-4 space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}

            {temperature !== null && (
                <div className="text-center text-xl font-semibold text-indigo-600">
                    현재 온도: {temperature} {/* data.temperature로 수정했는지 확인 */}
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
}