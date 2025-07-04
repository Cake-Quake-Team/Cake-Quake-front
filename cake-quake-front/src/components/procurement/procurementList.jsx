import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
    FolderOpenIcon,
    ClockIcon,
    ChevronRightIcon,
    PlusIcon
} from '@heroicons/react/24/outline';

export function ProcurementListComponent({
                                             requests,
                                             hasNext,
                                             onLoadMore,
                                             onClickItem,
                                             // onCreate,
                                         }) {
    return (
        <div>
            <div className="space-y-4">
                {requests.map(req => {
                    const createdDate = req.regDate
                        ? format(new Date(req.regDate), 'yyyy.MM.dd')
                        : '–';

                    // ⚡️ scheduleDate → estimatedArrivalDate
                    const estimatedDate = req.estimatedArrivalDate
                        ? format(new Date(req.estimatedArrivalDate), 'yyyy.MM.dd')
                        : '미정';

                    const statusClasses = {
                        REQUESTED: 'bg-yellow-100 text-yellow-800',
                        COMPLETED: 'bg-green-100 text-green-800',
                        SHIPPED:   'bg-blue-100 text-blue-800',
                        DELIVERED: 'bg-indigo-100 text-indigo-800',
                        CANCELLED: 'bg-red-100 text-red-800',
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
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        발주 #{req.procurementId}
                                    </h3>
                                    <p className="text-sm text-gray-600">요청일: {createdDate}</p>
                                    <p className="text-sm text-gray-600">예상도착일: {estimatedDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span
                                    className={`px-2 py-0.5 rounded-full text-sm font-medium ${statusClass}`}
                                >
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

ProcurementListComponent.propTypes = {
    requests: PropTypes.arrayOf(
        PropTypes.shape({
            procurementId:           PropTypes.number.isRequired,
            regDate:                 PropTypes.string,
            estimatedArrivalDate:    PropTypes.string,
            status:                  PropTypes.string.isRequired,
            note:                    PropTypes.string,
        })
    ).isRequired,
    hasNext:     PropTypes.bool.isRequired,
    onLoadMore:  PropTypes.func.isRequired,
    onClickItem: PropTypes.func.isRequired,
    onCreate:    PropTypes.func,
};
