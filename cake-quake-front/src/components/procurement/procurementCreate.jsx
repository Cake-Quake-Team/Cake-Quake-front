// src/components/procurement/procurementCreate.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export function ProcurementCreateComponent({
                                               note,
                                               items,
                                               ingredients,
                                               onChangeNote,
                                               onChangeItem,
                                               onAddItem,
                                               onRemoveItem,
                                               onSubmit,
                                               totalPrice,
                                           }) {
    return (
        <div className="space-y-4">
            {/* 메모 */}
            <label className="block text-sm font-medium text-gray-700">메모</label>
            <textarea
                className="w-full p-2 border rounded focus:outline-indigo-500"
                placeholder="메모를 입력하세요"
                value={note}
                onChange={e => onChangeNote(e.target.value)}
            />

            {/* 아이템 목록 */}
            {items.map((it, idx) => {
                const ing       = ingredients.find(x => x.ingredientId === Number(it.ingredientId));
                const unitPrice = ing?.pricePerUnit  || 0;
                const stock     = ing?.stockQuantity || 0;
                const qty       = Number(it.quantity) || 0;
                const subTotal  = unitPrice * qty;

                return (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        {/* 재료 선택 */}
                        <select
                            className="col-span-5 p-2 border rounded focus:outline-indigo-500"
                            value={it.ingredientId}
                            onChange={e => onChangeItem(idx, 'ingredientId', e.target.value)}
                            required
                        >
                            <option value="">— 재료 선택 —</option>
                            {ingredients.map(ing => (
                                <option key={ing.ingredientId} value={ing.ingredientId}>
                                    {ing.name} ({ing.unit})
                                </option>
                            ))}
                        </select>

                        {/* 수량 */}
                        <input
                            type="number"
                            className="col-span-2 p-2 border rounded focus:outline-indigo-500"
                            placeholder="수량"
                            value={it.quantity}
                            onChange={e => onChangeItem(idx, 'quantity', e.target.value)}
                            min="1"
                            required
                        />

                        {/* 단위당 가격 + 남은 재고 */}
                        <div className="col-span-2 text-right text-gray-700">
                            <div>
                                {unitPrice.toLocaleString()}원/단위
                            </div>
                            <div className="text-xs text-gray-500">
                                재고: {stock.toLocaleString()}{ing?.unit}
                            </div>
                        </div>

                        {/* 소계 */}
                        <div className="col-span-2 text-right text-gray-700">
                            {subTotal.toLocaleString()}원
                        </div>

                        {/* 삭제 */}
                        <button
                            type="button"
                            onClick={() => onRemoveItem(idx)}
                            className="col-span-1 p-1 rounded hover:bg-gray-200"
                        >
                            <TrashIcon className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                );
            })}

            {/* 버튼 그룹 */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={onAddItem}
                    className="inline-flex items-center px-3 py-1 border-2 border-dashed border-gray-300 rounded hover:border-indigo-500"
                    type="button"
                >
                    <PlusIcon className="h-5 w-5 mr-1 text-gray-500" />
                    아이템 추가
                </button>

                <button
                    onClick={onSubmit}
                    className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    type="button"
                >
                    발주 생성
                </button>
            </div>

            {/* 총합 */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-right">
                <span className="text-lg font-medium">총 발주 금액: </span>
                <span className="text-2xl font-bold text-indigo-600">
          {totalPrice.toLocaleString()}원
        </span>
            </div>
        </div>
    );
}

ProcurementCreateComponent.propTypes = {
    note:         PropTypes.string.isRequired,
    items:        PropTypes.array.isRequired,
    ingredients:  PropTypes.array.isRequired,
    onChangeNote: PropTypes.func.isRequired,
    onChangeItem: PropTypes.func.isRequired,
    onAddItem:    PropTypes.func.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    onSubmit:     PropTypes.func.isRequired,
    totalPrice:   PropTypes.number.isRequired,
};
