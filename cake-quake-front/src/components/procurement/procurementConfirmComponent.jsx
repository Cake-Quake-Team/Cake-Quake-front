// src/components/procurement/AdminProcurementConfirmComponent.jsx
import React, { useState } from 'react';
import PropTypes   from 'prop-types';
import { format }  from 'date-fns';
import {
    ClipboardDocumentListIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export function AdminProcurementConfirmComponent({ data, onConfirm, disabled }) {
    const {
        procurementId,
        shopName,
        status,
        note,
        regDate,
        scheduleDate,
        items = [],
        totalPrice
    } = data;

    const [date, setDate] = useState(
        scheduleDate ? format(new Date(scheduleDate), 'yyyy-MM-dd') : ''
    );

    const statusClasses = {
        REQUESTED: 'bg-yellow-100 text-yellow-800',
        SCHEDULED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800'
    };

    return (
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6 space-y-6">
            {/* 헤더 정보 */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-indigo-600 mr-2" />
                    발주 #{procurementId} 확인
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusClasses[status] || 'bg-gray-100 text-gray-800'
                }`}>
          {status}
        </span>
            </div>

            {/* 기본 정보 */}
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                <div><strong>매장명:</strong> {shopName}</div>
                <div><strong>요청일:</strong> {format(new Date(regDate), 'yyyy.MM.dd HH:mm')}</div>
                <div><strong>메모:</strong> {note || '–'}</div>
            </div>

            {/* 아이템 테이블 (항상 노출) */}
            <h3 className="mt-4 text-xl font-medium text-gray-800 flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-indigo-500 mr-2" /> 아이템 내역
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">품목명</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">단가</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">수량</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">소계</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                    {items.map(it => {
                        const unitPrice = it.pricePerUnit ?? 0;
                        const qty       = it.quantity ?? 0;
                        const subTotal  = unitPrice * qty;
                        return (
                            <tr key={it.itemId} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-700">{it.ingredientName}</td>
                                <td className="px-4 py-3 text-sm text-right text-gray-700">
                                    {unitPrice.toLocaleString()}원
                                </td>
                                <td className="px-4 py-3 text-sm text-right text-gray-700">{qty}</td>
                                <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                                    {subTotal.toLocaleString()}원
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                    <tfoot>
                    <tr className="bg-gray-50">
                        <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                            총 합계
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-bold text-indigo-600">
                            { (totalPrice ?? 0).toLocaleString() }원
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>

            {/* 일정 지정 입력(REQUESTED 상태일 때만) */}
            {status === 'REQUESTED' && (
                <div className="flex justify-end items-center space-x-4">
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="border rounded px-3 py-1 text-sm"
                    />
                    <button
                        onClick={() => onConfirm(date)}
                        disabled={disabled}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                        일정 지정
                    </button>
                </div>
            )}
        </div>
    );
}

AdminProcurementConfirmComponent.propTypes = {
    data: PropTypes.shape({
        procurementId: PropTypes.number.isRequired,
        shopName:      PropTypes.string.isRequired,
        status:        PropTypes.string.isRequired,
        note:          PropTypes.string,
        regDate:       PropTypes.string.isRequired,
        scheduleDate:  PropTypes.string,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                itemId:         PropTypes.number.isRequired,
                ingredientName: PropTypes.string.isRequired,
                unit:           PropTypes.string.isRequired,
                quantity:       PropTypes.number.isRequired,
                pricePerUnit:   PropTypes.number.isRequired
            })
        ).isRequired,
        totalPrice: PropTypes.number.isRequired
    }).isRequired,
    onConfirm: PropTypes.func.isRequired,
    disabled:  PropTypes.bool
};
