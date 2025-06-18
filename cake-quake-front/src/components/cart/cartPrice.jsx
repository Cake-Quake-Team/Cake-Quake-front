import React from 'react';

export default function CartPrice({ totalPrice, selectedCount, onClearSelected, onClearAll, onContinueShopping, onOrderSelected, onOrderAll }) {
    return (
        <div className="p-4 border-t flex justify-between items-center">
            <div>
                <p className="text-lg">총 합계: ₩{totalPrice}</p>
                <p className="text-sm text-gray-600">선택된 상품: {selectedCount}</p>
            </div>
            <div className="space-x-2">
                {selectedCount > 0 && (
                    <button
                        className="px-3 py-1 bg-red-500 text-white rounded"
                        onClick={onClearSelected}
                    >
                        선택 삭제
                    </button>
                )}

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

                <button
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    onClick={onOrderAll}
                    disabled={selectedCount !== 0}
                >
                    전체 주문
                </button>
            </div>

        </div>
    );
}