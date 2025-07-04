import React from 'react';

function ProductSalesTable({ productSalesTable }) {
    if (!productSalesTable || productSalesTable.length === 0) return <p>상품별 판매 데이터가 없습니다.</p>;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
    };

    return (
        <div style={tableContainerStyle}>
            <h2 style={tableTitleStyle}>상품별 판매 현황</h2> {/* 제목 추가 */}
            <table style={tableStyle}>
                <thead>
                <tr>
                    <th style={thStyle}>상품명</th>
                    <th style={thStyle}>판매량</th>
                    <th style={thStyle}>총매출</th>
                </tr>
                </thead>
                <tbody>
                {productSalesTable.map((item, index) => (
                    <tr key={item.cakeId || index} style={index % 2 === 0 ? trEvenStyle : trOddStyle}>
                        <td style={tdStyle}>{item.cname}</td>
                        <td style={tdStyle}>{item.totalQuantity}개</td>
                        <td style={tdStyle}>{formatCurrency(item.totalSaleAmount)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductSalesTable;

// Styles for ProductSalesTable.js
const tableContainerStyle = {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    overflowX: 'auto', // 테이블이 넘칠 경우 스크롤바
};

const tableTitleStyle = {
    fontSize: '1.5em',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    color: '#333',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '400px', // 테이블 최소 너비
};

const thStyle = {
    borderBottom: '2px solid #333', // 스크린샷과 유사하게 두꺼운 아래쪽 보더
    padding: '12px 8px',
    textAlign: 'left',
    backgroundColor: '#f5f5f5', // 헤더 배경색
    color: '#333',
    fontWeight: 'bold',
};

const tdStyle = {
    borderBottom: '1px solid #eee',
    padding: '10px 8px',
    color: '#555',
};

const trEvenStyle = {
    backgroundColor: '#fcfcfc',
};

const trOddStyle = {
    backgroundColor: '#ffffff',
};