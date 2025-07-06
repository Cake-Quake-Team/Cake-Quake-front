import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
    ClipboardDocumentListIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export function ProcurementDetailComponent({ data, totalPrice }) {
    const {
        procurementId,
        regDate,
        status,
        note,
        estimatedArrivalDate,
        items = [],
    } = data;

    // 요청일 & 예상도착일 포맷팅
    const createdDate = regDate
        ? format(new Date(regDate), 'yyyy.MM.dd')
        : '–';
    const etaDate = estimatedArrivalDate
        ? format(new Date(estimatedArrivalDate), 'yyyy.MM.dd')
        : '미정';

    // 상태 배지 클래스
    const statusClasses = {
        REQUESTED: 'bg-yellow-100 text-yellow-800',
        COMPLETED: 'bg-green-100 text-green-800',
        SHIPPED:   'bg-blue-100 text-blue-800',
        DELIVERED: 'bg-indigo-100 text-indigo-800',
        CANCELLED: 'bg-red-100 text-red-800',
    };
    const statusClass = statusClasses[status] || 'bg-gray-100 text-gray-800';

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold flex items-center">
                        <ClipboardDocumentListIcon className="h-6 w-6 text-indigo-600 mr-2" />
                        발주 #{procurementId}
                    </h2>
                    <div className="mt-2 space-x-4 text-sm text-gray-600">
                        <span className="inline-flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" /> 요청일: {createdDate}
                        </span>
                        <span className="inline-flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" /> 예상도착일: {etaDate}
                        </span>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
                    {status}
                </span>
            </div>

            {/* 메모 */}
            {note && (
                <p className="mt-4 text-gray-700">
                    <strong>메모:</strong> {note}
                </p>
            )}

            {/* 아이템 목록 헤더 */}
            <h3 className="mt-6 text-xl font-medium text-gray-800 flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-indigo-500 mr-2" /> 아이템 목록
            </h3>

            {/* 아이템 테이블 */}
            {items.length > 0 ? (
                <div className="mt-2 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                품목명
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                수량
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                단위
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                단가
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                소계
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                        {items.map(({ itemId, ingredientName, unit, quantity, unitPrice }) => {
                            const price    = unitPrice ?? 0;
                            const qty      = quantity ?? 0;
                            const subTotal = price * qty;
                            return (
                                <tr key={itemId} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">{ingredientName}</td>
                                    <td className="px-4 py-3 text-right">{qty}</td>
                                    <td className="px-4 py-3">{unit}</td>
                                    <td className="px-4 py-3 text-right">
                                        {price.toLocaleString()}원
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        {subTotal.toLocaleString()}원
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={4} className="text-right px-4 py-2 font-semibold">
                                총 발주 금액
                            </td>
                            <td className="px-4 py-2 text-right font-bold text-indigo-600">
                                {(totalPrice ?? 0).toLocaleString()}원
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            ) : (
                <p className="mt-4 text-center text-gray-500">등록된 아이템이 없습니다.</p>
            )}
        </div>
    );
}

ProcurementDetailComponent.propTypes = {
    data: PropTypes.shape({
        procurementId:         PropTypes.number.isRequired,
        regDate:               PropTypes.string,
        status:                PropTypes.string.isRequired,
        note:                  PropTypes.string,
        estimatedArrivalDate:  PropTypes.string,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                itemId:         PropTypes.number.isRequired,
                ingredientName: PropTypes.string.isRequired,
                unit:           PropTypes.string.isRequired,
                quantity:       PropTypes.number.isRequired,
                unitPrice:      PropTypes.number,    
            })
        ).isRequired,
    }).isRequired,
    totalPrice: PropTypes.number,
};
