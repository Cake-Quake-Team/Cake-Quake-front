// src/components/ingredients/ingredientList.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * UI 전용: 재료 목록 + Load More + Edit/Delete 버튼 렌더링
 * @param {Object[]} items              - [{ ingredientId, name, unit, pricePerUnit }, ...]
 * @param {boolean} hasNext             - 추가 로딩 가능 여부
 * @param {Function} onLoadMore         - Load More 클릭 핸들러
 * @param {Function} onEdit             - 수정 버튼 클릭 핸들러(id)
 * @param {Function} onDelete           - 삭제 버튼 클릭 핸들러(id)
 */
export default function IngredientList({ items, hasNext, onLoadMore, onEdit, onDelete }) {
    return (
        <div className="space-y-4">
            {items.map(item => (
                <div
                    key={item.ingredientId}
                    className="p-4 bg-white shadow rounded flex justify-between items-center"
                >
                    <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">단위: {item.unit}</p>
                        <p className="text-sm text-gray-600">단위당 가격: {item.pricePerUnit}원</p>
                    </div>
                    <div className="space-x-2">
                        <button
                            onClick={() => onEdit(item.ingredientId)}
                            className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        >
                            수정
                        </button>
                        <button
                            onClick={() => onDelete(item.ingredientId)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            삭제
                        </button>
                    </div>
                </div>
            ))}
            {hasNext && (
                <button
                    onClick={onLoadMore}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    더 불러오기
                </button>
            )}
        </div>
    );
}

IngredientList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            ingredientId: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            unit: PropTypes.string.isRequired,
            pricePerUnit: PropTypes.number.isRequired,
        })
    ).isRequired,
    hasNext: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
