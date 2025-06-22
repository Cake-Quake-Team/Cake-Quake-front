import jwtAxios from "../utils/jwtUtil.js";

export const API_SERVER_HOST = "http://localhost:8080"
const prefix = `${API_SERVER_HOST}/api`;

//관리자용 재료 전체 조회
export const getAllIngredients = async ({page = 1, size= 20, sortField = 'name'}={})=>{
    const res = await jwtAxios.get(`${prefix}/ingredients`,{
        params: {page,size, sortField},
    })
    return res.data
}
//관리자용 단건 조회
export const getIngredientById = async (ingredientId) => {
    const res = await jwtAxios.get(`${prefix}/ingredients/${ingredientId}`);
    return res.data
}
//관리자용 재료 생성
export const createIngredient = async (payload) =>{
    const res = await jwtAxios.post(`${prefix}/ingredients`,payload)
    return res.data
}

//관리자용 재료 수정
export const updateIngredient = async (ingredientId,payload) =>{
    const res = await jwtAxios.patch(`${prefix}/ingredients/${ingredientId}`,payload)
    return res.data
}

//관리자 재료 삭제
export const deleteIngredient = async (ingredientId) =>{
    await jwtAxios.delete(`${prefix}/ingredients/${ingredientId}`);
    return true;
}

