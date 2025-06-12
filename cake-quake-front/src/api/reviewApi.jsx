
import jwtAxios from "../utils/jwtUtil.js";


export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api`;

//----------------------구매자--------------------------------

//리뷰 목록 전체 조회
export const getMyReviewList = async ({page =1,size=10}) =>{
    const res = await jwtAxios.get(`${prefix}/buyers/reviews`,{
        params: {page,size}
    });
    return res.data;
}

//리뷰 목록 단건 조회(상세 조회)
export const getMyReviewDetail = async(reviewId) => {
    const res = await jwtAxios.get(`${prefix}/buyers/reviews/${reviewId}`);
    return res.data
}

//리뷰 작성
export const createReview = async (orderId, formData) => {
    const res = await jwtAxios.post(`${prefix}/orders/${orderId}/reviews`,formData);
    return res.data
}

//리뷰 수정
export const updateMyReview = async (reviewId, payload) => {
    const res = await jwtAxios.patch(`${prefix}/buyers/reviews/${reviewId}`,payload);
    res.data
}

//리뷰 삭제
export const deleteMyReview = async (reviewId) => {
    await jwtAxios.delete(`${prefix}/buyers/reviews/${reviewId}`)
    return true
}

//----------------------------판매자---------------------------------------------

export const getShopReviews = async (shopId, {page =1, size =10, sort = 'regDate'}={})=>{
    const res = await jwtAxios.get(`${prefix}/shops/${shopId}/reviews`,
        {
        params: {page,size,sort}
    });
    return res.data
}
