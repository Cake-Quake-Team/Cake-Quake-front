// src/components/sales/MonthlySalesChart.jsx
import React from 'react';
// ⭐ Chart.js 관련 임포트 추가 ⭐
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// ⭐ Chart.js에 필요한 컴포넌트들을 등록합니다. (단 한 번만 실행되면 됩니다) ⭐
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function MonthlySalesChart({ monthlySalesTrend }) {
    // ⭐ 데이터가 없거나 비어있을 경우 플레이스홀더 표시 ⭐
    if (!monthlySalesTrend || monthlySalesTrend.length === 0) {
        return (
            <div style={chartContainerStyle}>
                <h2 style={chartTitleStyle}>6개월 차트</h2>
                <div style={chartPlaceholderStyle}>
                    <img src="https://img.icons8.com/ios-filled/50/000000/line-chart.png" alt="chart icon" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
                    <p style={{ margin: 0 }}>차트 영역 (실제 데이터: {monthlySalesTrend ? monthlySalesTrend.length : 0}개월)</p>
                </div>
            </div>
        );
    }

    // ⭐ 차트 데이터 형식 변환 ⭐
    // monthlySalesTrend는 [{ monthYear: "YYYY-MM", totalQuantity: Long, totalSales: Long }, ...] 형태를 예상합니다.
    const chartData = {
        labels: monthlySalesTrend.map(item => item.monthYear), // x축 라벨: "2025-01", "2025-02" 등
        datasets: [
            {
                label: '월별 총 매출 (₩)', // 범례 라벨
                data: monthlySalesTrend.map(item => item.totalSales), // y축 데이터: 월별 총 매출
                borderColor: 'rgb(75, 192, 192)', // 라인 색상
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // 라인 아래 영역 배경색
                fill: true, // 라인 아래 영역 채우기
                tension: 0.1 // 라인 텐션 (곡선 부드러움)
            },
            // 필요하다면 판매량 데이터셋도 여기에 추가할 수 있습니다.
            // {
            //     label: '월별 총 판매량 (개)',
            //     data: monthlySalesTrend.map(item => item.totalQuantity),
            //     borderColor: 'rgb(255, 99, 132)',
            //     backgroundColor: 'rgba(255, 99, 132, 0.2)',
            //     fill: true,
            //     tension: 0.1
            // }
        ],
    };

    // ⭐ 차트 옵션 설정 ⭐
    const chartOptions = {
        responsive: true, // 반응형
        maintainAspectRatio: false, // 부모 컨테이너에 맞춰 크기 조절 허용
        plugins: {
            legend: {
                position: 'top', // 범례 위치
            },
            title: {
                display: true,
                text: '최근 6개월 판매 추이', // 차트 제목
            },
            tooltip: { // 툴팁 커스텀 (금액 포맷)
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: '월',
                },
                },
            y: {
                title: {
                    display: true,
                    text: '매출 (₩)',
                },
                ticks: { // y축 라벨 포맷 (금액)
                    callback: function(value, index, ticks) {
                        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(value);
                    }
                }
            }
        }
    };


    return (
        <div style={chartContainerStyle}>
            <h2 style={chartTitleStyle}>6개월 차트</h2>
            <div style={{ position: 'relative', height: '300px', width: '100%' }}> {/* 차트 캔버스 크기 조절을 위한 컨테이너 */}
                {/* ⭐ Line 컴포넌트 렌더링 ⭐ */}
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

export default MonthlySalesChart;

// Styles (기존 스타일 유지)
const chartContainerStyle = {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    textAlign: 'center',
};

const chartTitleStyle = {
    fontSize: '1.5em',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    color: '#333',
};

const chartPlaceholderStyle = { // 이제 데이터가 없을 때만 사용됨
    backgroundColor: '#f0f0f0',
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2em',
    color: '#888',
    borderRadius: '5px',
    marginBottom: '15px',
    border: '1px dashed #ccc',
};