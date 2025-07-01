import jwtAxios from '../../../../utils/jwtUtil';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { getSellerOrderSales } from '../../../../api/sellerorderApi';

import DateRangeSelector from '../../../../components/order/seller/sales/DateRangeSelector';
import SalesSummaryOverview from '../../../../components/order/seller/sales/SalesSummaryOverview';
import MonthlySalesChart from '../../../../components/order/seller/sales/MonthSalesChart.jsx';
import ProductSalesTable from '../../../../components/order/seller/sales/ProductSalesTable';
import ProductRankingCards from '../../../../components/order/seller/sales/ProductRankingCards';

import { getSellerStatisticsPdfUrl } from '../../../../api/sellerorderApi';

function TotalSalesPage() {
    const { shopId } = useParams();

    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        return sixMonthsAgo;
    });
    const [endDate, setEndDate] = useState(new Date());

    const [salesStats, setSalesStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSalesStatistics = useCallback(async () => {
        if (!shopId) {
            setError("상점 ID가 필요합니다.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];

            const data = await getSellerOrderSales(shopId, formattedStartDate, formattedEndDate);
            setSalesStats(data);
        } catch (err) {
            console.error("총 판매량 데이터 불러오기 실패:", err);
            const errorMessage = err.response?.data?.message || "총 판매량 데이터를 불러오는데 실패했습니다.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [shopId, startDate, endDate]);

    useEffect(() => {
        fetchSalesStatistics();
    }, [fetchSalesStatistics]);

    const handleDateRangeChange = (newStartDate, newEndDate) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    // ⭐ PDF 다운로드 핸들러 구현 ⭐
    const handleDownload = async () => { // async 키워드 추가
        if (!shopId || !startDate || !endDate) {
            alert("상점 ID와 조회 기간을 설정해야 보고서를 다운로드할 수 있습니다.");
            return;
        }

        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];

        const pdfUrl = getSellerStatisticsPdfUrl(shopId, formattedStartDate, formattedEndDate);

        try {
            // jwtAxios를 사용하여 요청 보내기
            const response = await jwtAxios.get(pdfUrl, {
                responseType: 'blob', // 응답을 Blob 형태로 받도록 설정
            });

            // Blob 데이터를 파일로 저장
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = `판매통계보고서_${shopId}_${formattedStartDate}-${formattedEndDate}.pdf`;
            link.setAttribute('download', filename); // 다운로드될 파일명 설정
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url); // 임시 URL 해제

            alert('PDF 보고서 다운로드를 시작합니다.');
        } catch (error) {
            console.error('PDF 다운로드 실패:', error);
            if (error.response && error.response.status === 401) {
                alert('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
                // navigate('/login'); // 필요하다면 로그인 페이지로 리디렉션
            } else if (error.response && error.response.data && error.response.data.message) {
                alert(`PDF 다운로드 실패: ${error.response.data.message}`);
            } else {
                alert('PDF 다운로드 중 알 수 없는 오류가 발생했습니다.');
            }
        }
    };


    return (
        <div className="total-sales-page-container" style={pageContainerStyle}>
            <h1 style={pageTitleStyle}>총 판매량</h1>

            <DateRangeSelector
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateRangeChange}
                onSubmit={fetchSalesStatistics}
            />

            {loading && <p style={messageStyle}>데이터를 불러오는 중입니다...</p>}
            {error && <p style={{ ...messageStyle, color: '#dc3545' }}>오류: {error}</p>}

            {salesStats && !loading && !error && (
                <div className="sales-dashboard-content">
                    <SalesSummaryOverview
                        totalQuantityOverall={salesStats.totalQuantityOverall}
                        currentMonthQuantity={salesStats.currentMonthQuantity}
                        previousMonthQuantity={salesStats.previousMonthQuantity}
                    />

                    <MonthlySalesChart monthlySalesTrend={salesStats.monthlySalesTrend} />

                    <ProductSalesTable productSalesTable={salesStats.productSalesTable} />

                    <ProductRankingCards
                        topRankingProducts={salesStats.topRankingProducts}
                        lowestRankingProducts={salesStats.lowestRankingProducts}
                    />

                    <div style={downloadButtonStyle}>
                        <button style={downloadButton} onClick={handleDownload}>PDF 보고서 다운로드</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TotalSalesPage;

// --- Styles for TotalSalesPage.jsx --- //
const pageContainerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #eee',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    backgroundColor: '#fff',
};

const pageTitleStyle = {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
    fontSize: '2em',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
};

const messageStyle = {
    textAlign: 'center',
    fontSize: '1.2em',
    color: '#007bff',
    margin: '20px 0',
};

const downloadButtonStyle = {
    textAlign: 'center',
    marginTop: '30px',
};

const downloadButton = {
    padding: '10px 20px',
    fontSize: '1.1em',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
};