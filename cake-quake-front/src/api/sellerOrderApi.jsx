import jwtAxios from '../utils/jwtUtil.js';

export const API_SERVER_HOST = "http://localhost:8080";
// 버전(v1)과 베이스 경로를 분리해서 관리
const API_VERSION = "/api/v1"; // ✅ v1을 상수로 분리하여 관리
const prefix = `${API_SERVER_HOST}${API_VERSION}`; // ✅ prefix에 API_VERSION 포함

// 판매자 주문 목록 조회 (함수명 변경)
export const getSellerOrderList = async (shopId, params) => {
    // ⭐⭐ 이 부분을 수정합니다: params.status가 "ALL"일 경우 undefined로 설정 ⭐⭐
    const modifiedParams = { ...params }; // params 객체 복사
    if (modifiedParams.status === "ALL") {
        modifiedParams.status = undefined; // 백엔드 @Nullable에 맞춰 undefined로 보냄
    }

    const response = await jwtAxios.get(
        `${prefix}/shops/${shopId}/orders`,
        { params: modifiedParams } // 수정된 params 객체 전달
    );
    return response.data;
};

// 판매자 주문 상세 조회
export const getSellerOrderDetail = async (shopId, orderId) => {
    const response = await jwtAxios.get(
        `${prefix}/shops/${shopId}/orders/${orderId}` // ✅ prefix 사용
    );
    return response.data;
};

// 판매자 주문 상태 업데이트
export const updateSellerOrderStatus = async (shopId, orderId, status) => { // ✅ 함수명 변경
    await jwtAxios.patch(
        `${prefix}/shops/${shopId}/orders/${orderId}`, // ✅ prefix 사용
        { status: status } // ✅ 명확하게 status 필드에 값을 할당
    );
};