import React from "react";

export default function HistoryList({ items = [], hasNext = false, onLoadMore }) {
    if (!items.length) {
        return <p className="text-center py-8 text-gray-400 italic">내역이 없습니다.</p>;
    }

    return (
        <div className="mt-4 bg-white rounded-2xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">날짜</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">내역</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">포인트</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">잔여</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {items.map((item, idx) => {
                    const isEarn = item.changeType === "EARN";
                    return (
                        <tr key={item.pointHistoryId} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                {new Date(item.regDate).toLocaleDateString("ko-KR")}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{item.description}</td>
                            <td
                                className={`px-4 py-3 text-sm font-medium ${
                                    isEarn ? "text-green-600" : "text-red-600"
                                }`}
                            >
                                {isEarn ? "+" : "-"}
                                {item.amount}P
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{item.balanceAmount}P</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {hasNext && (
                <div className="p-4 text-center">
                    <button
                        onClick={onLoadMore}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
                    >
                        더 보기
                    </button>
                </div>
            )}
        </div>
    );
}
