import jwtAxios from "../utils/jwtUtil.js";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${ API_SERVER_HOST }/api`;

// 간단한 질의응답
export const generateAnswer = async (data) => {
    const response = await jwtAxios.post(`${prefix}/ai/chat`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.data;
}

// 케이크 옵션 추천
export const recommendCakeOptions = async (data) => {
    const response = await jwtAxios.post(`${prefix}/ai/recommend/options`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.data;
}

// 케이크 문구 추천
export const recommendCakeLettering = async (data) => {
    const response = await jwtAxios.post(`${prefix}/ai/recommend/lettering`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.data;
}

// 디자인 추천
export const recommendCakeImage = async (data) => {
    const response = await jwtAxios.post(`${prefix}/ai/recommend/image`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.data;
}