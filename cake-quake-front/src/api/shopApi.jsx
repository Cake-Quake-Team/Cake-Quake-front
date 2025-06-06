import axios from 'axios';

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${ API_SERVER_HOST }/api`;

// 가게 목록 가져오기
export const getShopListInfinity = async ({ page = 1, keyword = "", size = 8 }) => {
    const response = await axios.get(`${prefix}/shops`, {
        params: { page, size, keyword },
    })
    return response.data;
}