
import jwtAxios from "../utils/jwtUtil.js";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${ API_SERVER_HOST }/api`;

// 가게 목록 가져오기
export const getShopListInfinity = async ({ page = 1, keyword = "", size = 8 }) => {
    const response = await jwtAxios.get(`${prefix}/shops`, {
        params: { page, size, keyword },
    })
    return response.data;
}
//가게 상세 조회
export const getShopDetail=async (shopId)=>{
    const response= await jwtAxios.get(`${prefix}/shops/${shopId}`)
    return response.data;
}