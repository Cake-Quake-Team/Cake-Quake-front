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
        <div className="space-y-4"> {/* 각 카드 사이의 간격을 위해 space-y 사용 */}
            {items.map(item => (
                <div
                    key={item.historyId}
                    className="bg-white rounded-lg shadow-md p-5 border border-gray-200"
                >
                    <div className="flex justify-between items-start mb-2">
                        {/* 날짜 */}
                        <p className="text-sm text-gray-500 font-medium">
                            {new Date(item.regDate).toLocaleDateString("ko-KR", {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                        {/* 변화량 */}
                        <p
                            className={`text-lg font-bold ${
                                item.changeAmount > 0 ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {item.changeAmount > 0 ? "+" : ""}
                            {item.changeAmount}°C {/* P 대신 °C로 변경, 또는 실제 단위 사용 */}
                        </p>
                    </div>

                    {/* 변동 원인 */}
                    <p className="text-base font-semibold text-gray-800 mb-2">
                        원인: {item.reason}
                    </p>

                    {/* 최종 온도 */}
                    <div className="flex justify-end items-center mt-3 pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-600 mr-2">최종 온도:</span>
                        <span className="text-xl font-bold text-indigo-700">
                            {item.afterTemperature}°C
                        </span>
                    </div>
                </div>
            ))}

            {hasNext && (
                <div className="p-4 text-center">
                    <button
                        onClick={onLoadMore}
                        className="py-3 px-6 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        더 많은 내역 보기
                    </button>
                </div>
            )}
        </div>
    );
}