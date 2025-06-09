import axios from 'axios';

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api`;

// axios 전역 설정: 토큰을 자동으로 헤더에 추가
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//리뷰 목록 전체 조회
export const getMyReviewList = async ({page =1,size=10}) =>{
    const res = await axios.get(`${prefix}/buyers/reviews`,{
        params: {page,size}
    });
    return res.data;
}

//리뷰 목록 단건 조회(상세 조회)
export const getMyReviewDetail = async(reviewId) => {
    const res = await axios.get(`${prefix}/buyers/reviews/${reviewId}`);
    return res.data
}

//리뷰 작성
export const creatReview = async (orderId, payload) => {
    const res = await axios.post(`${prefix}/orders/${orderId}/reviews`,payload);
    return res.data
}

//리뷰 수정
export const updateMyReview = async (reviewId, payload) => {
    const res = await axios.post(`${prefix}/reviews/${reviewId}`,payload);
    res.data
}

//리뷰 삭제
export const deleteMyReview = async (reviewId) => {
    await axios.delete(`${prefix}/buyers/review/${reviewId}`)
    return true
}