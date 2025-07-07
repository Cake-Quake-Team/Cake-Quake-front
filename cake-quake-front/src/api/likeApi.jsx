import jwtAxios from '../utils/jwtUtil.js';

const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/v1/buyer/profile/likes`;

// --- 상품 찜 관련 API ---

/* 특정 케이크 상품의 찜 상태를 토글(추가/취소) */
export const toggleCakeLike = async (cakeItemId) => {
    const payload = { cakeItemId: cakeItemId }; // 요청 바디에 cakeItemId 포함
    const response = await jwtAxios.post(`${prefix}/cake/toggle`, payload);
    return response.data;
};

/* 특정 케이크 상품의 찜 여부를 확인 */
export const getCakeLikeStatus = async (cakeItemId) => {
    const response = await jwtAxios.get(`${prefix}/cake/status/${cakeItemId}`);
    return response.data;
};

/* 로그인한 사용자가 찜한 모든 케이크 상품 목록을 조회 */
export const getLikedCakeItems = async () => {
    const response = await jwtAxios.get(`${prefix}/cake`);
    return response.data;
};

// --- 매장 찜 관련 API ---

/* 특정 매장의 찜 상태를 토글(추가/취소) */
export const toggleShopLike = async (shopId) => {
    const payload = { shopId: shopId }; // 요청 바디에 shopId 포함
    const response = await jwtAxios.post(`${prefix}/shop/toggle`, payload);
    return response.data;
};

/* 특정 매장의 찜 여부를 확인 */
export const getShopLikeStatus = async (shopId) => {
    const response = await jwtAxios.get(`${prefix}/shop/status/${shopId}`);
    return response.data;
};

/* 로그인한 사용자가 찜한 모든 매장 목록을 조회 */
export const getLikedShops = async () => {
    const response = await jwtAxios.get(`${prefix}/shop`);
    return response.data;
};