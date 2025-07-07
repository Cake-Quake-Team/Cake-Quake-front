import React from 'react';

export default function CartActions({
                                        selectedCount,
                                        onClearSelected,
                                        onClearAll,
                                        onContinueShopping,
                                        onOrderSelected,
                                        onOrderAll, // ⭐ [추가] onOrderAll prop 추가 ⭐
                                        isAllSelected // isAllSelected는 '전체 비우기' 버튼 disabled에 사용
                                    }) {
    return (
        <div className="flex justify-end space-x-2 mt-4">
            {selectedCount > 0 && (
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                    onClick={onClearSelected}
                >
                    선택 삭제
                </button>
            )}

            <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClearAll}
                disabled={!isAllSelected}
            >
                전체 비우기
            </button>

            <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                onClick={onContinueShopping}
            >
                쇼핑 계속하기
            </button>

            {/* ⭐ [추가] 전체 주문 버튼 ⭐ */}
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onOrderAll}
                disabled={onOrderAll === undefined || false} // 장바구니에 아이템이 없거나 함수가 연결 안되면 비활성화
            >
                전체 주문
            </button>

            <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onOrderSelected}
                disabled={selectedCount === 0}
            >
                선택 주문
            </button>
        </div>
    );
}