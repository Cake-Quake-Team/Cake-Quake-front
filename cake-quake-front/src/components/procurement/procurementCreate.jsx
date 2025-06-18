// src/components/procurement/ProcurementCreateComponent.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * ProcurementCreateComponent
 * UI 전용 컴포넌트: 발주 생성 폼을 렌더링합니다.
 * @param {string} note - 메모
 * @param {Object[]} items - [{ ingredientId, quantity }]
 * @param {Function} onChangeNote - 메모 변경 핸들러
 * @param {Function} onChangeItem - 아이템 변경 핸들러 (idx, field, value)
 * @param {Function} onAddItem - 새 아이템 추가 핸들러
 * @param {Function} onSubmit - 제출 핸들러
 */
export function ProcurementCreateComponent({ note, items, onChangeNote, onChangeItem, onAddItem, onSubmit }) {
    return (
        <div className="space-y-4">
      <textarea
          className="w-full p-2 border rounded"
          placeholder="메모를 입력하세요"
          value={note}
          onChange={e => onChangeNote(e.target.value)}
      />
            {items.map((it, i) => (
                <div key={i} className="flex gap-2">
                    <input
                        type="number"
                        className="p-2 border rounded w-1/2"
                        placeholder="재료 ID"
                        value={it.ingredientId}
                        onChange={e => onChangeItem(i, 'ingredientId', e.target.value)}
                    />
                    <input
                        type="number"
                        className="p-2 border rounded w-1/2"
                        placeholder="수량"
                        value={it.quantity}
                        onChange={e => onChangeItem(i, 'quantity', e.target.value)}
                    />
                </div>
            ))}
            <div className="flex gap-2">
                <button
                    onClick={onAddItem}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    아이템 추가
                </button>
                <button
                    onClick={onSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    발주 생성
                </button>
            </div>
        </div>
    );
}
ProcurementCreateComponent.propTypes = {
    note: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    onChangeNote: PropTypes.func.isRequired,
    onChangeItem: PropTypes.func.isRequired,
    onAddItem: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};