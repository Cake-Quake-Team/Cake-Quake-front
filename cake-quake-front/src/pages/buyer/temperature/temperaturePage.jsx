import React, {useEffect, useState} from "react";
import {getTemperature, getTemperatureHistory} from "../../../api/temperatureApi.jsx";
import FilterTabs from "../../../components/temperature/filterTabs.jsx";
import HistoryList from "../../../components/temperature/temperatureHistory.jsx";
import {getBuyerProfile} from "../../../api/memberApi.js";


export default function TemperaturePage() {
    const PAGE_SIZE = 10;

    const [temperature, setTemperature] = useState(null);
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentUserUid, setCurrentUserUid] = useState(null); //


    const loadAllTemperatureData = async() =>{
        setLoading(true);
        setError("");

        try {
            // 1. 사용자 프로필을 먼저 가져와 UID를 추출합니다.
            const profileApiResponse = await getBuyerProfile();
            console.log("getBuyerProfile 응답 (TemperaturePage):", profileApiResponse);

            if (profileApiResponse.success && profileApiResponse.data && profileApiResponse.data.uid) {
                const fetchedUid = profileApiResponse.data.uid;
                setCurrentUserUid(fetchedUid); // UID 상태 업데이트

                // 2. 추출된 UID를 사용하여 온도 정보를 가져옵니다.
                const tempApiResponse = await getTemperature(fetchedUid);
                console.log("getTemperature 응답 (TemperaturePage):", tempApiResponse);
                if (typeof tempApiResponse?.temperature === 'number') {
                    setTemperature(tempApiResponse.temperature);
                } else {
                    console.warn("API에서 유효하지 않은 온도 값이 반환되었습니다 (TemperaturePage):", tempApiResponse);
                    setTemperature(null);
                    setError("현재 온도 정보를 불러왔으나 유효한 값이 아닙니다.");
                }

                // 3. 추출된 UID를 사용하여 온도 이력 정보를 가져옵니다.
                const {items, hasNext} = await getTemperatureHistory({
                    uid: fetchedUid,
                    page: 1,
                    size: PAGE_SIZE,
                });
                setHistory(items);
                setHasNext(hasNext);
                setPage(1);

            } else {
                setError(profileApiResponse.message || "사용자 프로필(UID)을 불러오는데 실패했습니다. 로그인 상태를 확인해주세요.");
                setCurrentUserUid(null);
                setTemperature(null);
                setHistory([]);
            }
        } catch (e) {
            console.error("TemperaturePage 데이터 페칭 오류:", e);
            setError("온도 및 이력 정보를 불러오는 데 실패했습니다.");
            setTemperature(null);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (!hasNext || loading || !currentUserUid) return;

        setLoading(true);
        try {
            const next = page + 1;
            const { items, hasNext: more } = await getTemperatureHistory({
                uid: currentUserUid,
                page: next,
                size: PAGE_SIZE,
            });
            setHistory(prev => [...prev, ...items]);
            setHasNext(more);
            setPage(next);
        } catch (e) {
            console.error("TemperaturePage.loadMore 오류", e);
            setError(e.response?.data?.message || e.message);
        } finally {
            setLoading(false);
        }
    };

    const filtered = history.filter(item => {
        if (filter === "all") return true;
        // reason이 존재하고 대소문자 구분 없이 필터링
        return item.reason && item.reason.toUpperCase() === filter.toUpperCase();
    });

    useEffect(() => {
        // 컴포넌트 마운트 시 초기 데이터 로드
        loadAllTemperatureData();
    }, []); // 빈 배열: 컴포넌트가 처음 마운트될 때 한 번만 실행

    return (
        <div className="max-w-xl mx-auto p-4 space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}

            {temperature !== null && (
                <div className="bg-white rounded-xl shadow-2xl p-8 text-center transform transition-transform duration-300 hover:scale-105">
                    <h2 className="text-3xl font-bold mb-4 flex items-center justify-center text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 animate-pulse text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.727A8 8 0 016.343 7.273L17.657 16.727zm0 0l-1.357 1.357L14.49 14.88l1.357-1.357-1.357-1.357-1.357 1.357-1.357-1.357 1.357-1.357-1.357 1.357-1.357-1.357 1.357 1.357-1.357 1.357-1.357 1.357 1.357 1.357-1.357 1.357-1.357 1.357z" />
                        </svg>
                        현재 온도
                    </h2>
                    <p className="text-7xl font-extrabold tracking-tight text-indigo-600">
                        {temperature.toFixed(1)}°C
                    </p>
                    <p className="text-sm mt-3 opacity-80 text-gray-600">실시간으로 측정된 온도입니다.</p>
                </div>
            )}

            <FilterTabs
                filter={filter}
                onChange={setFilter}
            />

            {loading && history.length === 0 && <p className="text-center">이력 정보를 불러오는 중…</p>}

            {!loading && filtered.length === 0 && !error && (
                <p className="text-center text-gray-500">조회된 이력 정보가 없습니다.</p>
            )}

            <HistoryList
                items={filtered}
                hasNext={hasNext}
                onLoadMore={loadMore}
            />
        </div>
    );
}