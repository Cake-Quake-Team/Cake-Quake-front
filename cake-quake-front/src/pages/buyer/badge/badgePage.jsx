import React, { useEffect, useState } from "react";
import {
    getMemberBadges,
    getAllBadgesWithAcquisitionStatus,
    setProfileBadge,
} from "../../../api/badgeApi";
import BadgeCard from "../../../components/badge/BadgeCard";
import { useAuth } from "../../../store/AuthContext.jsx";
import AlertModal from "../../../components/common/AlertModal.jsx";

function BadgesPage() {
    const [viewMode, setViewMode] = useState("acquired");
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const uid = user?.uid;

    // formError 메시지 + showError 표시 상태 분리
    const [formError, setFormError] = useState(null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (!user || !uid) return;

        setLoading(true);
        setError(null);

        const fetchBadges = async () => {
            try {
                let data;
                if (viewMode === "acquired") {
                    data = await getMemberBadges(uid);
                } else {
                    data = await getAllBadgesWithAcquisitionStatus(uid);
                }
                setBadges(data);
            } catch {
                setError("뱃지 목록을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchBadges();
    }, [viewMode, uid, user]);

    const handleSetProfileBadge = async (badgeId) => {
        if (!user || !uid) {
            setFormError({message: "사용자 정보가 없어 대표 뱃지를 설정할 수 없습니다.", type: 'error'});
            setShowError(true);
            return;
        }
        try {
            await setProfileBadge(uid, badgeId);
            setFormError({message: "대표 뱃지가 성공적으로 설정되었습니다!", type: 'error'});
            setShowError(true);

            // 변경 후 다시 데이터 가져오기
            let data;
            if (viewMode === "acquired") {
                data = await getMemberBadges(uid);
            } else {
                data = await getAllBadgesWithAcquisitionStatus(uid);
            }
            setBadges(data);
        } catch (err) {
            console.error("대표 뱃지 설정 실패:", err);
            setFormError({message: "대표 뱃지 설정에 실패했습니다.", type: 'error'});
            setShowError(true);
        }
    };

    // showError가 true가 되면 3초 후 자동 닫기 처리
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    if (!user) {
        return <div className="text-center mt-20 text-gray-500">사용자 정보를 불러오는 중...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center text-gray-800">나의 대표 뱃지</h1>
            <p className="text-center text-gray-400 mb-8">나의 대표 뱃지를 선택하세요</p>

            <div className="flex justify-center mb-8 space-x-4">
                <button
                    onClick={() => setViewMode("acquired")}
                    className={`px-5 py-2 rounded-full transition-colors ${
                        viewMode === "acquired" ? "bg-gray-200" : "bg-white text-gray-500 hover:bg-gray-100"
                    }`}
                    type="button"
                >
                    획득한 뱃지
                </button>
                <button
                    onClick={() => setViewMode("all")}
                    className={`px-5 py-2 rounded-full transition-colors ${
                        viewMode === "all" ? "bg-gray-200" : "bg-white text-gray-500 hover:bg-gray-100"
                    }`}
                    type="button"
                >
                    모든 뱃지
                </button>
            </div>

            <div className="min-h-[300px]">
                {loading && (
                    <p className="text-center text-gray-500 text-lg">뱃지 목록을 불러오는 중...</p>
                )}

                {error && (
                    <p className="text-center text-red-500 font-semibold">{error}</p>
                )}

                {!loading && !error && badges.length === 0 && (
                    <p className="text-center text-gray-500 text-lg">
                        {viewMode === "acquired" ? "아직 획득한 뱃지가 없습니다." : "등록된 뱃지가 없습니다."}
                    </p>
                )}

                {!loading && !error && badges.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {badges.map((badge) => (
                            <BadgeCard
                                key={badge.memberBadgeId || badge.badgeId}
                                badge={badge}
                                isAcquiredView={viewMode === "acquired"}
                                onSetProfileBadge={handleSetProfileBadge}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showError && formError && (
                <AlertModal
                    message={formError}
                    type={formError.includes("성공") ? "success" : "error"}
                    show={showError}
                />
            )}
        </div>
    );
}

export default BadgesPage;
