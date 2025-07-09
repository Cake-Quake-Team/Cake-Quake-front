import React, { useState, useEffect } from 'react';
import AlertModal from "../../../common/AlertModal.jsx";

function DateRangeSelector({ startDate: initialStartDate, endDate: initialEndDate, onDateChange, onSubmit }) {
    const [startDate, setStartDate] = useState(initialStartDate.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(initialEndDate.toISOString().split('T')[0]);
    const [formError, setFormError] = useState(null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    useEffect(() => {
        setStartDate(initialStartDate.toISOString().split('T')[0]);
        setEndDate(initialEndDate.toISOString().split('T')[0]);
    }, [initialStartDate, initialEndDate]);

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleSubmitClick = () => {
        if (new Date(startDate) > new Date(endDate)) {
            setFormError({message: "시작 날짜는 종료 날짜보다 늦을 수 없습니다.", type: 'error'});
            setShowError(true);
            return;
        }
        onDateChange(new Date(startDate), new Date(endDate));
        onSubmit();
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            {showError && formError && (
                <AlertModal
                    message={formError.message}
                    type={formError.type || "error"}
                    show={showError}
                />
            )}
            <label htmlFor="startDate" style={{ fontWeight: 'bold', color: '#555' }}>기간:</label>
            <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={handleStartDateChange}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: '1 1 auto', minWidth: '120px' }}
            />
            <span style={{ color: '#555' }}>~</span>
            <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={handleEndDateChange}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: '1 1 auto', minWidth: '120px' }}
            />
            <button
                onClick={handleSubmitClick}
                style={{ padding: '8px 18px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95em', fontWeight: 'bold' }}
            >
                조회
            </button>
        </div>
    );
}

export default DateRangeSelector;