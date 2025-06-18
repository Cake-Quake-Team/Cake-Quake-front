import React from 'react';
import PropTypes from 'prop-types';

/**
 * ProcurementListComponent
 * UI 전용 컴포넌트: 발주 목록을 표출하고, Load More 버튼을 렌더링합니다.
 * @param {Object[]} requests - [{ procurementId, status, note, scheduledDate }, ...]
 * @param {boolean} hasNext - 추가 데이터 유무
 * @param {Function} onLoadMore - Load More 클릭 시 호출 핸들러
 * @param {Function} onClickItem - 항목 클릭 시 호출 핸들러(procurementId)
 */
export function ProcurementListComponent({ requests, hasNext, onLoadMore, onClickItem }) {
    return (
        <div className="space-y-4">
            {requests.map(req => (
                <div
                    key={req.procurementId}
                    className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-50"
                    onClick={() => onClickItem(req.procurementId)}
                >
                    <h3 className="text-lg font-semibold">발주 #{req.procurementId}</h3>
                    <p className="text-sm">상태: {req.status}</p>
                    <p className="text-sm">메모: {req.note}</p>
                    {req.scheduledDate && <p className="text-sm">예정일: {req.scheduledDate.split('T')[0]}</p>}
                </div>
            ))}
            {hasNext && (
                <button
                    onClick={onLoadMore}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    더 보기
                </button>
            )}
        </div>
    );
}
ProcurementListComponent.propTypes = {
    requests: PropTypes.array.isRequired,
    hasNext: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onClickItem: PropTypes.func.isRequired,
};