// src/components/point/HistoryList.jsx
import React from "react";

/**
 * 포인트 히스토리 테이블
 * Props:
 * - items:   [{ pointHistoryId, regDate, description, amount, balanceAmount, changeType }, …]
 * - hasNext: boolean
 * - onLoadMore: () => void
 */
export default function HistoryList({
                                        items   = [],
                                        hasNext = false,
                                        onLoadMore,
                                    }) {
    if (!items.length) {
        return <p className="text-center py-4 text-gray-500">내역이 없습니다.</p>;
    }
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-2">날짜</th>
                    <th className="p-2">내역</th>
                    <th className="p-2">포인트</th>
                    <th className="p-2">잔여</th>
                </tr>
                </thead>
                <tbody>
                {items.map(item => (
                    <tr key={item.pointHistoryId} className="border-t">
                        <td className="p-2">
                            {new Date(item.regDate).toLocaleDateString("ko-KR")}
                        </td>
                        <td className="p-2">{item.description}</td>
                        <td
                            className={`p-2 ${
                                item.amount > 0 ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {item.amount > 0 ? "+" : ""}
                            {item.amount}P
                        </td>
                        <td className="p-2">{item.balanceAmount}P</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {hasNext && (
                <div className="p-4 text-center">
                    <button
                        onClick={onLoadMore}
                        className="py-2 px-4 border border-indigo-600 rounded hover:bg-indigo-50"
                    >
                        더 보기
                    </button>
                </div>
            )}
        </div>
    );
}
