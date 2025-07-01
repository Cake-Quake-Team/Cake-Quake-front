// src/components/ingredients/AdminIngredientList.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * UI 전용: 재료 목록 (Admin 스타일 테이블)
 * @param {Object[]} items      - [{ ingredientId, name, unit, pricePerUnit, stockQuantity }, ...]
 * @param {boolean} hasNext     - 추가 로딩 가능 여부
 * @param {Function} onLoadMore - Load More 클릭 핸들러
 * @param {Function} onEdit     - 수정 버튼 클릭 핸들러(id)
 * @param {Function} onDelete   - 삭제 버튼 클릭 핸들러(id)
 */
export default function AdminIngredientList({
                                                items,
                                                hasNext,
                                                onLoadMore,
                                                onEdit,
                                                onDelete
                                            }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed divide-y divide-gray-200">
                    <colgroup>
                        <col className="w-16" />    {/* ID */}
                        <col className="w-2/5" />   {/* 재료명 */}
                        <col className="w-1/5" />   {/* 단위 */}
                        <col className="w-1/5" />   {/* 단가 */}
                        <col className="w-1/5" />   {/* 재고 */}
                        <col className="w-1/5" />   {/* 액션 */}
                    </colgroup>
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                            재료명
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                            단위
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase">
                            단위당 가격
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase">
                            재고
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase">
                            액션
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                    {items.map(item => (
                        <tr key={item.ingredientId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                {item.ingredientId}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-normal break-words">
                                {item.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                {item.unit}
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-700 whitespace-nowrap">
                                {item.pricePerUnit.toLocaleString()}원
                            </td>
                            <td className="px-6 py-4 text-sm text-right text-gray-700 whitespace-nowrap">
                                {item.stockQuantity.toLocaleString()}개
                            </td>
                            <td className="px-6 py-4 text-sm text-center whitespace-nowrap space-x-2">
                                <button
                                    onClick={() => onEdit(item.ingredientId)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => onDelete(item.ingredientId)}
                                    className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {hasNext && (
                <div className="p-4 text-center">
                    <button
                        onClick={onLoadMore}
                        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                        더 불러오기
                    </button>
                </div>
            )}
        </div>
    );
}

AdminIngredientList.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            ingredientId:  PropTypes.number.isRequired,
            name:          PropTypes.string.isRequired,
            unit:          PropTypes.string.isRequired,
            pricePerUnit:  PropTypes.number.isRequired,
            stockQuantity: PropTypes.number.isRequired,  // 재고 필드
        })
    ).isRequired,
    hasNext:    PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onEdit:     PropTypes.func.isRequired,
    onDelete:   PropTypes.func.isRequired,
};
