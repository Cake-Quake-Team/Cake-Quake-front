// src/components/procurement/AdminProcurementList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

export function AdminProcurementList({
                                         requests = [],
                                         hasNext,
                                         onLoadMore,
                                         onClickItem,
                                         groupBy,
                                     }) {
    if (!Array.isArray(requests)) {
        console.error('AdminProcurementList: requests는 배열이어야 합니다:', requests);
        return null;
    }

    const groups = requests.reduce((acc, req) => {
        const key = groupBy === 'shop'
            ? req.shopName
            : format(new Date(req.regDate), 'yyyy.MM.dd');
        (acc[key] ||= []).push(req);
        return acc;
    }, {});

    const statusClasses = {
        REQUESTED: 'bg-yellow-100 text-yellow-800',
        COMPLETED: 'bg-green-100 text-green-800',  // ← 새로운 상태
        SHIPPED:   'bg-blue-100 text-blue-800',
        DELIVERED: 'bg-indigo-100 text-indigo-800',
        CANCELLED: 'bg-red-100 text-red-800',
    };



    return (
        <div className="space-y-6">
            {Object.entries(groups).map(([groupKey, items]) => (
                <div key={groupKey} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-2 bg-gray-100 text-sm font-medium text-gray-700">
                        {groupBy === 'shop' ? `매장: ${groupKey}` : `요청일: ${groupKey}`}
                    </div>
                    <div className="px-6 overflow-x-auto">
                        <table className="min-w-full table-fixed divide-y divide-gray-200">
                            <colgroup>
                                <col className="w-16" />
                                <col className="w-1/3" />
                                <col className="w-1/6" />
                                <col className="w-1/4" />
                                <col className="w-auto" />
                            </colgroup>
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase">매장명</th>
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                                <th className="py-3 text-right text-xs font-medium text-gray-500 uppercase">총금액</th>
                                <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase">액션</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                            {items.map(req => {
                                const cls = statusClasses[req.status] || 'bg-gray-100 text-gray-800';
                                const total = Number(req.totalPrice) || 0;
                                return (
                                    <tr
                                        key={req.procurementId}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => onClickItem(req.procurementId)}
                                    >
                                        <td className="py-4 text-sm text-gray-700 whitespace-nowrap">
                                            {req.procurementId}
                                        </td>
                                        <td className="py-4 text-sm text-gray-700 whitespace-nowrap overflow-hidden truncate">
                                            {req.shopName}
                                        </td>
                                        <td className="py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
                          {req.status }
                        </span>
                                        </td>
                                        <td className="py-4 text-sm text-right text-gray-700 whitespace-nowrap">
                                            {total.toLocaleString()}원
                                        </td>
                                        <td className="py-4 text-sm text-center text-indigo-600 whitespace-nowrap hover:underline">
                                            상세보기
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {hasNext && (
                <div className="text-center">
                    <button
                        onClick={onLoadMore}
                        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        더 보기
                    </button>
                </div>
            )}
        </div>
    );
}

AdminProcurementList.propTypes = {
    requests:    PropTypes.array.isRequired,
    hasNext:     PropTypes.bool.isRequired,
    onLoadMore:  PropTypes.func.isRequired,
    onClickItem: PropTypes.func.isRequired,
    groupBy:     PropTypes.oneOf(['date','shop']).isRequired,
};
