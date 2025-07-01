import jwtAxios from '../utils/jwtUtil.js';

export const API_SERVER_HOST = "http://localhost:8080";
// 버전(v1)과 베이스 경로를 분리해서 관리
const API_VERSION = "/api/v1";
const prefix = `${API_SERVER_HOST}${API_VERSION}`;

// 판매자 주문 목록 조회 (함수명 변경)
export const getSellerOrderList = async (shopId, params) => {
    const modifiedParams = { ...params };
    if (modifiedParams.status === "ALL") {
        modifiedParams.status = undefined; // 백엔드 @Nullable에 맞춰 undefined로 보냄
    }

    const response = await jwtAxios.get(
        `${prefix}/shops/${shopId}/orders`,
        { params: modifiedParams }
    );
    return response.data;
};

// 판매자 주문 상세 조회
export const getSellerOrderDetail = async (shopId, orderId) => {
    const response = await jwtAxios.get(
        `${prefix}/shops/${shopId}/orders/${orderId}`
    );
    return response.data;
};

// 판매자 주문 상태 업데이트
export const updateSellerOrderStatus = async (shopId, orderId, status) => {
    await jwtAxios.patch(
        `${prefix}/shops/${shopId}/orders/${orderId}`,
        { status: status } //status 필드에 값을 할당
    );
};

// 판매자 총 판매량/매출 통계 조회
export const getSellerOrderSales = async (shopId, startDate, endDate) => {
    const response = await jwtAxios.get(
        `${prefix}/shops/${shopId}/sales`,
        { params: { startDate, endDate } } //날짜 파라미터 전달
    );
    return response.data;
};

// ⭐⭐ 판매자 통계 PDF 다운로드 URL 생성 함수 추가 ⭐⭐
export const getSellerStatisticsPdfUrl = (shopId, startDate, endDate) => {
    // 백엔드 엔드포인트: @RequestMapping("/api/v1/shops/{shopId}") + @GetMapping("/sales/pdf")
    // 따라서 URL은 /api/v1/shops/{shopId}/sales/pdf
    return `${prefix}/shops/${shopId}/sales/pdf?startDate=${startDate}&endDate=${endDate}`;
};