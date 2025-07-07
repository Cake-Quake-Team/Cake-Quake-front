import jwtAxios from '../utils/jwtUtil.js';

const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/v1/buyer`;

// ✅ 주문 생성
export const createOrder = async (payload) => { // async 키워드 추가
    const response = await jwtAxios.post(`${prefix}/orders/create`, payload);
    return response.data; // 이 부분을 추가!
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

// ⭐⭐ 주문 취소 API 수정: status 페이로드 전달 ⭐⭐
export const cancelMyOrder = async (orderId) => {
    // Controller의 @PatchMapping("/{orderId}")에 맞추어 호출
    // userId는 @AuthenticationPrincipal로 받으므로 URL에 포함시키지 않습니다.
    return jwtAxios.patch(
        `${prefix}/orders/${orderId}`,
        { status: "RESERVATION_CANCELLED" } // ⭐⭐⭐ 여기에 status 페이로드 객체 추가 ⭐⭐⭐
    );
};