import jwtAxios from '../utils/jwtUtil.js';

const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/v1/buyer`;

// ✅ 주문 생성 (userId는 서버에서 SecurityContext로 처리하는 경우 불필요할 수 있음)
export const createOrder = (payload) => {
    return jwtAxios.post(`${prefix}/orders/create`, payload);
};

// ✅ 주문 목록 조회
export const getOrderList = async ({ page = 1, size = 10 } = {}) => {
    // ✅ = {} 붙여주면 undefined일 때도 안전
    const response = await jwtAxios.get(`${prefix}/orders`, {
        params: { page, size }
    });
    return response.data;
};

// ✅ 주문 상세 조회
export const getOrderDetail = async (orderId) => {
    const response = await jwtAxios.get(`${prefix}/orders/${orderId}`);
    return response.data;
};

// ✅ 주문 취소
export const cancelMyOrder = async (orderId) => {
    return jwtAxios.patch(`${prefix}/orders/${orderId}`);
};