
import jwtAxios from "../utils/jwtUtil.js";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${ API_SERVER_HOST }/api/v1`;


// 가게 목록 가져오기
export const getShopListInfinity = async ({ page = 1, size = 8 ,keyword="",filter="",sort="shopId"}) => {
    const response = await jwtAxios.get(`${prefix}/shops`, {
        params: { page, size, keyword ,filter,sort},
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
    const response = await jwtAxios.patch(`${prefix}/shops/${shopId}/notices/${noticeId}`, noticeData);
    return response.data;
}

//매장 정보 수정
export const updateShop=async (shopId,shopData)=>{
    const formData = new FormData();

    // DTO 데이터를 JSON 문자열로 변환하여 'dto' 파트에 추가
    formData.append('dto', new Blob([JSON.stringify(shopData.dto)], { type: 'application/json' }));

    // files 배열이 존재하고 비어있지 않다면 'files' 파트에 추가
    if (shopData.files && shopData.files.length > 0) {
        shopData.files.forEach((file) => {
            formData.append('files', file); // 백엔드의 @RequestPart("files")와 일치해야 합니다.
        });
    }

    const response = await jwtAxios.patch(`${prefix}/shops/${shopId}/update`, formData, {
        headers: {
            // FormData를 사용할 때는 Axios가 Content-Type을 'multipart/form-data'로 자동으로 설정합니다.
            // 명시적으로 "Content-Type": "multipart/form-data"를 넣어도 되지만,
            // 보통 Axios의 기본 동작에 맡기는 것이 더 안전합니다.
        },
        withCredentials: true // 필요한 경우 인증 정보를 포함합니다.
    });
    return response.data;
}



