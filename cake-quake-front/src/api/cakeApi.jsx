import axios from 'axios';

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${ API_SERVER_HOST }/api`;

// 케이크 목록 가져오기
export const getCakeListInfinity = async ({ page = 1, keyword = "LETTERING", size = 8 }) => {
    const response = await axios.get(`${prefix}/cakes`, {
        params: { page, size, keyword },
    })
    return response.data;
}