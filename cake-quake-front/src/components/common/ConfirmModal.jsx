// src/components/common/ConfirmModal.jsx
import React from 'react';

export default function ConfirmModal({ show, message, onConfirm, onCancel }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 반투명 백드롭 */}
            <div className="absolute inset-0 bg-black opacity-30" />
            {/* 모달 박스 */}
            <div className="bg-white rounded-lg p-6 shadow-lg z-10 w-80">
                <p className="text-gray-800 mb-4">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
}
