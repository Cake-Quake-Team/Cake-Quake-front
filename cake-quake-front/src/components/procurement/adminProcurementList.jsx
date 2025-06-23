// src/components/procurement/AdminProcurementList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
    FolderOpenIcon,
    BuildingOffice2Icon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export function AdminProcurementList({
                                         requests,
                                         hasNext,
                                         onLoadMore,
                                         onClickItem
                                     }) {
    return (
        <div>
            <div className="space-y-4">
                {requests.map(req => {
                    const createdDate = req.regDate
                        ? format(new Date(req.regDate), 'yyyy.MM.dd')
                        : '–';
                    const scheduledDate = req.scheduleDate
                        ? format(new Date(req.scheduleDate), 'yyyy.MM.dd')
                        : '미정';

                    const statusClasses = {
                        REQUESTED: 'bg-yellow-100 text-yellow-800',
                        SCHEDULED: 'bg-green-100 text-green-800',
                        CANCELLED: 'bg-red-100 text-red-800'
                    };
                    const statusClass = statusClasses[req.status] || 'bg-gray-100 text-gray-800';

                    return (
                        <div
                            key={req.procurementId}
                            className="flex items-center justify-between p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-50"
                            onClick={() => onClickItem(req.procurementId)}
                        >
                            <div className="flex items-center space-x-3">
                                <FolderOpenIcon className="h-6 w-6 text-indigo-600" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-1">
                                        <BuildingOffice2Icon className="h-5 w-5 text-gray-500" />
                                        <span>
                      발주 #{req.procurementId} — {req.shopName}
                    </span>
                                    </h3>
                                    <p className="text-sm text-gray-600">요청일: {createdDate}</p>
                                    <p className="text-sm text-gray-600">예정일: {scheduledDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                <span className={`px-2 py-0.5 rounded-full text-sm font-medium ${statusClass}`}>
                  {req.status}
                </span>
                                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    );
                })}

                {hasNext && (
                    <button
                        onClick={onLoadMore}
                        className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        더 보기
                    </button>
                )}
            </div>
        </div>
    );
}

AdminProcurementList.propTypes = {
    requests: PropTypes.arrayOf(
        PropTypes.shape({
            procurementId: PropTypes.number.isRequired,
            shopName:      PropTypes.string.isRequired,
            regDate:       PropTypes.string,
            scheduleDate:  PropTypes.string,
            status:        PropTypes.string.isRequired
        })
    ).isRequired,
    hasNext:    PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onClickItem:PropTypes.func.isRequired
};
