import jwtAxios from '../utils/jwtUtil.js';

export const API_SERVER_HOST = "http://localhost:8080";
// 버전(v1)과 베이스 경로를 분리해서 관리
//const API_VERSION = "/api/";
// const prefix = `${API_SERVER_HOST}${API_VERSION}`;
const prefix = `${API_SERVER_HOST}/api`;

// 판매자 주문 목록 조회
export const getShopOrders = async (shopId, page, size) => {
    const response = await jwtAxios.get(
        `${prefix}/seller/shops/${shopId}/orders`,
        { params: { page, size } }
    );
    return response.data;
};

// 판매자 주문 상세 조회
export const getSellerOrderDetail = async (shopId, orderId) => {
    const response = await jwtAxios.get(
        `/api/v1/seller/shops/${shopId}/orders/${orderId}`
    );
    return response.data;
};

// 판매자 주문 상태 업데이트
export const updateOrderStatus = async (shopId, orderId, status) => {
    await jwtAxios.patch(
        `/api/v1/seller/shops/${shopId}/orders/${orderId}/status`,
        { status }
    );
};
