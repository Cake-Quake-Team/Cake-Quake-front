
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

//공지사항 목록 가져오기
export const getShopNotices = async (shopId, pageRequest = { page: 1, size: 10 }) => {
    const response = await jwtAxios.get(`${prefix}/shops/${shopId}/notices`, {
        params: {
            page: pageRequest.page,
            size: pageRequest.size
        }
    });
    return response.data;
}

//공지사항 상세 조회
export const getShopNoticeDetail=async(shopId,noticeId)=>{
    const response = await jwtAxios.get(`${prefix}/shops/${shopId}/notices/${noticeId}`);
    return response.data;
}

//공지사항 삭제
export const deleteShopNotice = async(shopId,noticeId) =>{
    const response= await jwtAxios.delete(`${prefix}/shops/${shopId}/notices/${noticeId}`);
    return response.data;

}

//공지사항 생성
export const createShopNotice = async (shopId,noticeData) =>{
    const response=await jwtAxios.post(`${prefix}/shops/${shopId}/notices`,noticeData)
    return response.data;
}

//공지사항 수정
export const updateShopNotice=async(shopId,noticeId,noticeData)=>{
    const response = await jwtAxios.put(`${prefix}/shops/${shopId}/notices/${noticeId}`, noticeData);
    return response.data;
}



