import React, { useState, useEffect } from 'react';

const OrderPaymentSummary = ({
                                 userPoints,
                                 totalOrderPrice,
                                 discountAmount,
                                 finalPaymentPrice,
                                 orderNote,
                                 onOrderNoteChange,
                                 onPointsChange
                             }) => {
    const [pointsToUse, setPointsToUse] = useState("");

    useEffect(() => {
        onPointsChange(pointsToUse);
    }, [pointsToUse, onPointsChange]);

    const handlePointsToUseChange = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, "");
        setPointsToUse(numericValue);
    };

    const handleUseAllPoints = () => {
        setPointsToUse(String(userPoints));
    };

    return (
        <div style={{
            marginTop: '30px',
            padding: '20px',
            border: '1px solid #007bff',
            borderRadius: '8px',
            backgroundColor: '#eaf4ff',
            width: '100%',
            flexBasis: '100%'
        }}>
            <h2 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '15px' }}>3. 주문 정보 확인 및 결제</h2>

            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="orderNote" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>요청사항 (선택 사항)</label>
                <textarea
                    id="orderNote"
                    rows="3"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    placeholder="예) 초콜릿 토핑 추가해주세요, 문 앞에 놓아주세요."
                    value={orderNote}
                    onChange={(e) => onOrderNoteChange(e.target.value)}
                ></textarea>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #a0a0ff', borderRadius: '8px', backgroundColor: '#e0e0ff' }}>
                <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '10px' }}>포인트 사용</h3>
                <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>보유 포인트: <span style={{ fontWeight: 'bold', color: '#6a0dad' }}>{userPoints.toLocaleString()} P</span></p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="number"
                        id="pointsToUse"
                        style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        placeholder="사용할 포인트를 입력하세요"
                        value={pointsToUse}
                        onChange={handlePointsToUseChange}
                        min="0"
                        max={userPoints}
                    />
                    <button
                        type="button"
                        onClick={handleUseAllPoints}
                        style={{ padding: '10px 15px', backgroundColor: '#6a0dad', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        disabled={userPoints === 0 || totalOrderPrice === 0}
                    >
                        모두 사용
                    </button>
                </div>
                <p style={{ fontSize: '1em', fontWeight: 'bold', marginTop: '10px' }}>적용 할인: <span style={{ color: '#dc3540' }}>-{discountAmount.toLocaleString()}원</span></p>
            </div>

            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #70e081', borderRadius: '8px', backgroundColor: '#e0ffe0' }}>
                <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '10px' }}>최종 결제 정보</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>기존 주문 금액:</span>
                    <span style={{ fontWeight: 'bold' }}>{totalOrderPrice.toLocaleString()}원</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>포인트 할인:</span>
                    <span style={{ fontWeight: 'bold', color: '#dc3545' }}>-{discountAmount.toLocaleString()}원</span>
                </div>
                <hr style={{ borderTop: '1px solid #ccc', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1.3em', fontWeight: 'bold' }}>최종 결제 금액:</span>
                    <span style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#007bff' }}>{finalPaymentPrice.toLocaleString()}원</span>
                </div>
            </div>
        </div>
    );
};

export default OrderPaymentSummary;