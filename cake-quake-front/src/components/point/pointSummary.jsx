import React from "react";

export default function PointSummary({ available = 0, total = 0, expiring = 0 }) {
    const format = n => n.toLocaleString() + "P";

    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">내 포인트</h2>
            <div className="grid grid-cols-3 gap-6">
                {/* 사용 가능 */}
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500">사용 가능</p>
                    <p className="mt-1 text-2xl font-bold text-gray-700">{format(available)}</p>
                </div>
                {/* 누적 */}
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500">누적</p>
                    <p className="mt-1 text-2xl font-bold text-gray-700">{format(total)}</p>
                </div>
                {/* 소멸 예정 */}
                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500">소멸 예정</p>
                    <p className="mt-1 text-2xl font-bold text-gray-700">{format(expiring)}</p>
                </div>
            </div>
        </div>
    );
}
