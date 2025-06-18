// src/components/procurement/ProcurementDetailComponent.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * ProcurementDetailComponent
 * UI 전용 컴포넌트: 단건 발주 상세 정보를 렌더링합니다.
 * @param {Object} data - 발주 상세 (ProcurementResponseDTO)
 */
export function ProcurementDetailComponent({ data }) {
    return (
        <div className="space-y-4 p-4 bg-white shadow rounded">
            <h2 className="text-2xl font-bold">발주 #{data.procurementId}</h2>
            <p>상태: {data.status}</p>
            <p>메모: {data.note}</p>
            {data.scheduledDate && <p>예정일: {data.scheduledDate.split('T')[0]}</p>}
            <h3 className="text-xl mt-4">아이템 목록</h3>
            <ul className="list-disc list-inside">
                {data.items.map(item => (
                    <li key={item.itemId}>
                        재료ID: {item.ingredientId}, 수량: {item.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
}
ProcurementDetailComponent.propTypes = {
    data: PropTypes.shape({
        procurementId: PropTypes.number,
        status: PropTypes.string,
        note: PropTypes.string,
        scheduledDate: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({
            itemId: PropTypes.number,
            ingredientId: PropTypes.number,
            quantity: PropTypes.number,
        }))
    }).isRequired,
};