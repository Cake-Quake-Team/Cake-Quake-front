import React from "react";

export default function temHistoryList({
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
                    <th className="p-2">변동 원인</th>
                    <th className="p-2">변화량</th>
                    <th className="p-2">최종 온도</th>
                </tr>
                </thead>
                <tbody>
                {items.map(item => (
                    <tr key={item.historyId} className="border-t">
                        <td className="p-2">
                            {new Date(item.regDate).toLocaleDateString("ko-KR")}
                        </td>
                        <td className="p-2">{item.reason}</td>
                        <td
                            className={`p-2 ${
                                item.changeAmount > 0 ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {item.changeAmount > 0 ? "+" : ""}
                            {item.changeAmount}P
                        </td>
                        <td className="p-2">{item.afterTemperature}P</td>
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