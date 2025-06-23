// src/components/procurement/AdminProcurementConfirmComponent.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

export function AdminProcurementConfirmComponent({ data, onConfirm }) {
    const [date, setDate] = useState(
        data.scheduleDate ? data.scheduleDate.split('T')[0] : ''
    );

    const handleSubmit = () => {
        if (!date) {
            alert('날짜를 선택해주세요.');
            return;
        }
        onConfirm(date);
    };

    return (
        <div className="space-y-6 p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold">발주 #{data.procurementId} 일정 지정</h2>
            <div className="space-y-1">
                <p>
                    <strong>요청일:</strong>{' '}
                    {format(new Date(data.regDate), 'yyyy.MM.dd')}
                </p>
                <p>
                    <strong>현재 상태:</strong> {data.status}
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">아이템 목록</h3>
                <ul className="list-disc list-inside space-y-1">
                    {data.items.map(item => (
                        <li key={item.itemId}>
                            {item.ingredientName} ({item.unit}) — {item.quantity}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium">예정일 선택</label>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <button
                onClick={handleSubmit}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
                확정하기
            </button>
        </div>
    );
}

AdminProcurementConfirmComponent.propTypes = {
    data: PropTypes.shape({
        procurementId: PropTypes.number.isRequired,
        regDate:       PropTypes.string.isRequired,
        status:        PropTypes.string.isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                itemId:         PropTypes.number.isRequired,
                ingredientName: PropTypes.string.isRequired,
                unit:           PropTypes.string.isRequired,
                quantity:       PropTypes.number.isRequired,
            })
        ).isRequired,
    }).isRequired,
    onConfirm: PropTypes.func.isRequired,
};
