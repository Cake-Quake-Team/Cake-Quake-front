
import jwtAxios from "../utils/jwtUtil.js";
import axios from "axios";


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

export const getShopReviewDetail = async (shopId, reviewId) => {
    const res = await jwtAxios.get(`${prefix}/shops/${shopId}/reviews/${reviewId}`);
    return res.data;
}

export const replyToShopReview = async (shopId, reviewId, {reply})=>{
    await jwtAxios.post(`${prefix}/shops/${shopId}/reviews/${reviewId}/reply`, {reply});
    return true;
}

export const requestDeleteShopReview = async (shopId, reviewId,reason)=>{
    await jwtAxios.post(
        `${prefix}/shops/${shopId}/reviews/${reviewId}/delete`,
        null,
    {params:{reason}}
    );
    return true
}


// //---------------------관리자--------------------------------
// // 삭제 요청 목록 조회
// export const getDeletionRequests = async ({ page = 1, size = 10 }) => {
//     const res = await jwtAxios.get(`${prefix}/admin/review-deletion-request`, {
//         params: { page, size },
//     });
//     console.log("res.data=" , res.data);
//     return res.data;
// };

export const getDeletionRequests = async ({ page = 1, size = 10 }) => {
    // jwtAxios가 자동으로 JWT 토큰을 헤더에 붙이고,
    // 인터셉터가 response.data를 리턴하므로 res 자체가 payload입니다.
    const payload = await jwtAxios.get(
        `${prefix}/admin/review-deletion-request`,
        { params: { page, size } }
    );
    console.log('getDeletionRequests payload →', payload);
    return payload;  // { content: [...], hasNext: boolean, totalCount: number }
};


// 요청 승인(리뷰 실제 삭제)
export const approveDeletionRequest = async (requestId) => {
    await jwtAxios.patch(
        `${prefix}/admin/review-deletion-request/${requestId}/approve`
    );
    return true;
};

// 요청 거절(삭제 요청 취소)
export const rejectDeletionRequest = async (requestId) => {
    await jwtAxios.patch(
        `${prefix}/admin/review-deletion-request/${requestId}/reject`
    );
    return true;
};