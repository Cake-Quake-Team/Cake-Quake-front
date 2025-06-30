// src/components/ingredients/ingredientForm.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * UI 전용: 재료 등록/수정 폼 렌더링
 * @param {{ name: string, unit: string, pricePerUnit: number, description: string, stockQuantity: number }} form
 * @param {Function} onChangeName            - 이름 변경 핸들러 (event)
 * @param {Function} onChangeUnit            - 단위 변경 핸들러 (event)
 * @param {Function} onChangePricePerUnit    - 단위당 가격 변경 핸들러 (event)
 * @param {Function} onChangeDescription     - 설명 변경 핸들러 (event)
 * @param {Function} onChangeStockQuantity   - 재고 변경 핸들러 (event)
 * @param {Function} onSubmit                - 폼 제출 핸들러
 */
export default function IngredientForm({
                                           form,
                                           onChangeName,
                                           onChangeUnit,
                                           onChangePricePerUnit,
                                           onChangeDescription,
                                           onChangeStockQuantity,
                                           onSubmit,
                                       }) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {/* 이름 */}
            <div>
                <label className="block mb-1 font-medium">이름</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChangeName}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            {/* 단위 */}
            <div>
                <label className="block mb-1 font-medium">단위</label>
                <input
                    type="text"
                    name="unit"
                    value={form.unit}
                    onChange={onChangeUnit}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            {/* 단위당 가격 (콤마 포맷) */}
            <div>
                <label className="block mb-1 font-medium">단위당 가격</label>
                <input
                    type="text"                           // text 로 바꿔야 콤마가 보입니다
                    name="pricePerUnit"
                    value={form.pricePerUnit != null
                        ? form.pricePerUnit.toLocaleString()
                        : ''}                                // null 이면 빈칸
                    onChange={onChangePricePerUnit}
                    inputMode="numeric"                   // 숫자 전용 키패드
                    pattern="[0-9,]*"                     // 숫자,콤마만 허용
                    placeholder="예) 1,000"
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            {/* 재고량 (콤마 포맷) */}
            <div>
                <label className="block mb-1 font-medium">재고량</label>
                <input
                    type="text"
                    name="stockQuantity"
                    value={form.stockQuantity != null
                        ? form.stockQuantity.toLocaleString()
                        : ''}
                    onChange={onChangeStockQuantity}
                    inputMode="numeric"
                    pattern="[0-9,]*"
                    placeholder="예) 1,000"
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            {/* 설명 */}
            <div>
                <label className="block mb-1 font-medium">설명</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={onChangeDescription}
                    className="w-full p-2 border rounded"
                    rows={3}
                />
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                저장
            </button>
        </form>
    );
}

IngredientForm.propTypes = {
    form: PropTypes.shape({
        name:           PropTypes.string.isRequired,
        unit:           PropTypes.string.isRequired,
        pricePerUnit:   PropTypes.number.isRequired,
        stockQuantity:  PropTypes.number.isRequired,
        description:    PropTypes.string.isRequired,
    }).isRequired,
    onChangeName:          PropTypes.func.isRequired,
    onChangeUnit:          PropTypes.func.isRequired,
    onChangePricePerUnit:  PropTypes.func.isRequired,
    onChangeStockQuantity: PropTypes.func.isRequired,
    onChangeDescription:   PropTypes.func.isRequired,
    onSubmit:              PropTypes.func.isRequired,
};
