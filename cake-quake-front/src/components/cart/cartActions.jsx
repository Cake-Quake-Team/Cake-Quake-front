import React from 'react';

export default function CartActions({
                                        selectedCount,
                                        onClearSelected,
                                        onClearAll,
                                        onContinueShopping,
                                        onOrderSelected
                                    }) {
    return (
        <div className="space-x-2">
            {selectedCount > 0 && (
                <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={onClearSelected}
                >
                    선택 삭제
                </button>
            )}

            {/* ⭐ 전체 비우기 버튼 주석 해제 및 활성화 ⭐ */}
            <button
                className="px-3 py-1 bg-yellow-400 text-black rounded"
                onClick={onClearAll}
            >
                전체 비우기
            </button>

            <button
                className="px-3 py-1 bg-gray-200 text-black rounded"
                onClick={onContinueShopping}
            >
                쇼핑 계속하기
            </button>

            <button
                className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                onClick={onOrderSelected}
                disabled={selectedCount === 0}
            >
                선택 주문
            </button>
        </div>
    );
}