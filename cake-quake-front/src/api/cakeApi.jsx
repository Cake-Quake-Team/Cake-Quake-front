import jwtAxios from "../utils/jwtUtil.js";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${ API_SERVER_HOST }/api`;

// 케이크 목록 가져오기
export const getAllCakeList = async ({ page = 1, keyword = "LETTERING", size = 8 }) => {
    const response = await jwtAxios.get(`${prefix}/cakes`, {
        params: { page, size, keyword },
    })
    return response.data;
}

// 옵션 타입 가져오기
export const getOptionTypes = async (shopId) => {
    const response = await jwtAxios.get(`${prefix}/shops/${shopId}/options/types`);
    return response.data.content;
}

// 옵션 값 가져오기
export const getOptionItems = async (shopId) => {
    const response = await jwtAxios.get(`${prefix}/shops/${shopId}/options/items`);
    return response.data.content;
}

// 케이크 등록
export const addCake = async (shopId, dataToSend) => {
    const response = await jwtAxios.post(`http://localhost:8080/api/shops/${shopId}/cakes`, dataToSend, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    return response.data;
};
