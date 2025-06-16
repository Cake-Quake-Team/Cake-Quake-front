// src/components/point/PointSummary.jsx
import React from "react";

/**
 * 포인트 요약 카드
 * Props:
 * - available: 사용 가능 포인트 (currentBalance)
 * - total:     누적 포인트 (예: cumulativeBalance)
 * - expiring:  소멸 예정 포인트
 */
export default function PointSummary({
                                         available = 0,
                                         total     = 0,
                                         expiring  = 0,
                                     }) {
    return (
        <div className="bg-white rounded-lg shadow p-4 space-y-2">
            <h2 className="text-lg font-semibold">내 포인트</h2>
            <div className="flex justify-between">
                <span>사용 가능 포인트</span>
                <span className="font-bold">{available.toLocaleString()}P</span>
            </div>
            <div className="flex justify-between">
                <span>누적 포인트</span>
                <span className="font-bold">{total.toLocaleString()}P</span>
            </div>
            <div className="flex justify-between">
                <span>소멸 예정 포인트</span>
                <span className="font-bold">{expiring.toLocaleString()}P</span>
            </div>
        </div>
    );
}
