import React, { useState } from 'react';
import PropTypes from 'prop-types';

export function CancelProcurementComponent({ onCancel, loading }) {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        if (!reason.trim()) {
            alert('취소 사유를 입력해주세요.');
            return;
        }
        onCancel(reason);
    };

    return (
        <div className="p-4 bg-red-50 rounded-lg space-y-2">
            <h3 className="text-lg font-semibold text-red-700">발주 취소</h3>
            <textarea
                rows="3"
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="취소 사유를 입력하세요"
            />
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
                {loading ? '처리중…' : '취소하기'}
            </button>
        </div>
    );
}

CancelProcurementComponent.propTypes = {
    onCancel: PropTypes.func.isRequired,
    loading:  PropTypes.bool,
};
