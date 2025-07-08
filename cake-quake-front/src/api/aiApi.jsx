// aiApi.js
import jwtAxios from "../utils/jwtUtil.js";

const prefix = import.meta.env.VITE_API_BASE_URL

// 간단한 질의응답
export const generateAnswer = async (data) => {
    const response = await jwtAxios.post(`${prefix}/chat`, null, {
        params: data,
    });
    return response.data;
};

// 케이크 옵션 추천
export const recommendCakeOptions = async (data) => {
    const response = await jwtAxios.post(`${prefix}/chat/options`, null, {
        params: data,
    });
    return response.data;
};

// 케이크 문구 추천
export const recommendCakeLettering = async (data) => {
    const response = await jwtAxios.post(`${prefix}/chat/lettering`, null, {
        params: data,
    });
    return response.data;
};

// 디자인 추천
export const recommendCakeImage = async (data) => {
    const response = await jwtAxios.post(`${prefix}/chat/design`, null, {
        params: data,
    });
    return response.data;
};

// 채팅 내역 조회
export const getChatHistory = async (sessionId) => {
    const response = await jwtAxios.get(`${prefix}/chat/history`, {
        params: { sessionId },
    });
    return response.data;
};
