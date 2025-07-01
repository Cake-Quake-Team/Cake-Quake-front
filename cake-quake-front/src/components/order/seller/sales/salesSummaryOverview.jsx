import React from 'react';

function SalesSummaryOverview({ totalQuantityOverall, currentMonthQuantity, previousMonthQuantity }) {
    return (
        <div style={summaryContainerStyle}>
            <p style={summaryItemStyle}>총 판매량 : <span style={highlightStyle}>{totalQuantityOverall || 0}개</span></p>
            <p style={summaryItemStyle}>저번 달 총 판매량 : <span style={highlightStyle}>{previousMonthQuantity || 0}개</span></p>
            <p style={summaryItemStyle}>이번 달 총 판매량 : <span style={highlightStyle}>{currentMonthQuantity || 0}개</span></p>
        </div>
    );
}

export default SalesSummaryOverview;

const summaryContainerStyle = {
    textAlign: 'left',
    marginBottom: '30px',
    paddingLeft: '20px',
    borderBottom: '1px solid #eee', // 스크린샷 상단 요약 아래 줄
    paddingBottom: '20px',
};

const summaryItemStyle = {
    fontSize: '1.2em',
    marginBottom: '8px',
    color: '#333',
};

const highlightStyle = {
    fontWeight: 'bold',
    color: '#007bff',
    marginLeft: '10px',
};