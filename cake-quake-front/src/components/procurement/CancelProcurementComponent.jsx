// src/components/procurement/CancelProcurementComponent.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AlertModal from '../common/AlertModal';

export function CancelProcurementComponent({ onCancel, loading }) {
    const [reason, setReason] = useState('');
    const [alertProps, setAlertProps] = useState({
        show: false,
        message: '',
        type: 'error'
    });

    const showAlert = (message, type = 'error') => {
        setAlertProps({ show: true, message, type });
        setTimeout(() => setAlertProps(a => ({ ...a, show: false })), 3000);
    };

    const handleSubmit = () => {
        if (!reason.trim()) {
            showAlert('취소 사유를 입력해주세요.', 'error');
            return;
        }
        onCancel(reason);
    };

    return (
        <>
            <AlertModal
                message={alertProps.message}
                type={alertProps.type}
                show={alertProps.show}
            />

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
        </>
    );
}

CancelProcurementComponent.propTypes = {
    onCancel: PropTypes.func.isRequired,
    loading:  PropTypes.bool,
};
