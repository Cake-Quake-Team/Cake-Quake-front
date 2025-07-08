import jwtAxios from "../utils/jwtUtil.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

//관리자용 재료 전체 조회
export const getAllIngredients = async ({page = 1, size= 20, sortField = 'name'}={})=>{
    const res = await jwtAxios.get(`${baseUrl}/ingredients`,{
        params: {page,size, sortField},
    })
    console.log('⚙️ full axiosRes:', res);
    console.log('⚙️ axiosRes.data:', res.data);
    return res.data
}
//관리자용 단건 조회
export const getIngredientById = async (ingredientId) => {
    const res = await jwtAxios.get(`${baseUrl}/ingredients/${ingredientId}`);
    return res.data
}
//관리자용 재료 생성
export const createIngredient = async (payload) =>{
    const res = await jwtAxios.post(`${baseUrl}/ingredients`,payload)
    return res.data
}

//관리자용 재료 수정
export const updateIngredient = async (ingredientId,payload) =>{
    const res = await jwtAxios.patch(`${baseUrl}/ingredients/${ingredientId}`,payload)
    return res.data
}

//관리자 재료 삭제
export const deleteIngredient = async (ingredientId) =>{
    await jwtAxios.delete(`${baseUrl}/ingredients/${ingredientId}`);
    return true;
}

