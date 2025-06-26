
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

//매장별 상품 조회
export const getShopCakes = async (shopId, category, pageRequestDTO = { page: 1, size: 10 }) => {
    if (!shopId) throw new Error("shopId가 필요합니다.");
    const response = await jwtAxios.get(`${prefix}/shops/${shopId}/cakes`, {
        params: {
            page: pageRequestDTO.page,
            size: pageRequestDTO.size,
            category: category,
        }
    });

    return response.data; // content, hasNext 포함된 InfiniteScrollResponseDTO 형태
};

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

//매장 정보 수정 -> 수정해야함
export const updateShop=async (shopId,data)=>{
    console.log("api/shopApi - updateShop 호출됨"); // <--- 새로 추가
    console.log("api/shopApi - data 파라미터:", data); // <--- 새로 추가

    const formData = new FormData();


    if (data.dto) {
        // DTO를 JSON 문자열로 변환하여 'application/json' 타입의 Blob으로 FormData에 추가
        // 이렇게 해야 백엔드에서 @RequestPart("dto")로 JSON 객체로 파싱할 수 있습니다.
        formData.append('dto', new Blob([JSON.stringify(data.dto)], { type: 'application/json' }));
        console.log("FormData에 'dto' (Blob 형태) 추가됨. 값:", JSON.stringify(data.dto));
    }

    if (data.files && Array.isArray(data.files)) {
        data.files.forEach((file, index) => {
            formData.append('files', file);
            console.log(`FormData에 'files'(${index}) 추가됨. 파일명:`, file.name); // <--- 새로 추가
        });
    }

    // FormData 객체 내용 확인 (개발 및 디버깅용)
    console.log("--- FormData 내용 시작 ---");
    for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
            console.log(`${pair[0]}: File - ${pair[1].name} (${pair[1].type})`);
        } else if (pair[1] instanceof Blob) {
            console.log(`${pair[0]}: Blob - Type: ${pair[1].type}, Size: ${pair[1].size}`);
        } else {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
    }
    console.log("--- FormData 내용 끝 ---");

    const response = await jwtAxios.patch(`${prefix}/shops/${shopId}/update`, formData, {
        // ...
    });
    return response.data;
}



