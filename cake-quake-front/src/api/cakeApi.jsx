import jwtAxios from "../utils/jwtUtil.js";

const prefix = import.meta.env.VITE_API_BASE_URL

{/* -------------------------케이크 상품 ----------------------------*/}

// 케이크 목록 가져오기
export const getAllCakeList = async ({ page = 1, keyword, size = 8, sort = "regDate,desc" }) => {
    const params = { page, size, sort };
    if (keyword) params.keyword = keyword; // keyword가 있을 때만 추가

    const response = await jwtAxios.get(`${prefix}/cakes`, { params });
    return response.data;
}

// 케이크 등록
export const addCake = async (data) => {
    const response = await jwtAxios.post(`${prefix}/cakes`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    return response.data;
};

// 케이크 상세 조회
export const getCakeDetail = async (shopId, cakeId) => {
    const response = await jwtAxios.get(`${prefix}/shops/${shopId}/cakes/${cakeId}`);
    return response.data;
}

// 케이크 삭제
export const deleteCake = async (cakeId) => {
    const response = await jwtAxios.delete(`${prefix}/cakes/${cakeId}`);
    return response.data;
}

// 케이크 수정
export const updateCake = async (shopId, cakeId, data) => {
    const response = await jwtAxios.patch(`${prefix}/shops/${shopId}/cakes/${cakeId}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    return response.data;
}

{/* ------------------------케이크 옵션------------------------------- */}

// 옵션 타입 목록
export const getOptionTypes = async (shopId) => {
    const response = await jwtAxios.get(`${prefix}/shops/${shopId}/options/types`);
    return response.data.content;
}

// 옵션 값 목록
export const getOptionItems = async (shopId) => {
    const response = await jwtAxios.get(`${prefix}/shops/${shopId}/options/items`,{
        params: {
            page: 1,
            size: 1000
        }})
    return response.data.content;
}

// 옵션 타입 등록
export const addOptionType = async (shopId, data) => {
    const response = await jwtAxios.post(`${prefix}/shops/${shopId}/options/types`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.data;
}

// 옵션 값 등록
export const addOptionItem = async (shopId, data) => {
    const response = await jwtAxios.post(`${prefix}/shops/${shopId}/options/items`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.data;
}

// 옵션 타입 상세조회
export const getOptionTypeDetail = async (shopId, optionTypeId) => {
    const response = await jwtAxios.get(`${prefix}/shops/${shopId}/options/types/${optionTypeId}`);
    return response.data;
}

// 옵션 값 상세조회
export const getOptionItemDetail = async (shopId, optionItemId) => {
    const response = await jwtAxios.get(`${prefix}/shops/${shopId}/options/items/${optionItemId}`);
    return response.data;
}

// 옵션 타입 삭제
export const deleteOptionType = async (shopId, optionTypeId) => {
    const response = await jwtAxios.delete(`${prefix}/shops/${shopId}/options/types/${optionTypeId}`);
    return response.data;
}

// 옵션 값 삭제
export const deleteOptionItem = async (shopId, optionItemId) => {
    const response = await jwtAxios.delete(`${prefix}/shops/${shopId}/options/items/${optionItemId}`);
    return response.data;
}

// 옵션 타입 수정
export const updateOptionType = async (shopId, optionTypeId, data) => {
    const response = await jwtAxios.patch(`${prefix}/shops/${shopId}/options/types/${optionTypeId}`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

// 옵션 값 수정
export const updateOptionItem = async (shopId, optionItemId, data) => {
    const response = await jwtAxios.patch(`${prefix}/shops/${shopId}/options/items/${optionItemId}`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}
