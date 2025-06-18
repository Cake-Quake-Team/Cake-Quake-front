// src/api/pointApi.js
import jwtAxios from "../utils/jwtUtil.js";
export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/points`;

/** 잔액 조회 */
export const getPointBalance = async () => {
    console.log("📡 getPointBalance 요청");
    const { data } = await jwtAxios.get(`${prefix}/balance`);
    console.log("📥 getPointBalance 응답:", data);
    // 서버에서 { uid, currentBalance } 로 내려옵니다
    return data.currentBalance;
};

/** 히스토리 조회 */
export const getPointHistory = async ({ page = 1, size = 10 }) => {
    console.log(`📡 getPointHistory 요청 (page=${page}, size=${size})`);
    const { data } = await jwtAxios.get(`${prefix}/history`, {
        params: { page, size },
    });
    console.log("📥 getPointHistory 응답:", data.content, "hasNext:", data.hasNext);
    return {
        items: data.content,
        hasNext: data.hasNext,
    };
};

/** 포인트 증감 처리 (필요시) */
export const changePoint = async ({ amount, description }) => {
    const { data } = await jwtAxios.post(`${prefix}/change`, {
        amount,
        description,
    });
    return data.currentBalance;
};
