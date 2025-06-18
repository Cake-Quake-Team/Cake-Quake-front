// ✅ 인터셉터만 사용
import jwtAxios from "../utils/jwtUtil.js";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/payments`;


// export const requestKakaoPayment = async (shopId, orderId, amount) => {
//     const res = await kakaoAxios.post('/api/v1/payments', {
//         shopId,
//         orderId,
//         provider: 'KAKAO',
//         amount,
//     });
//     const payload = JSON.parse(atob(getCookie('access_token').split('.')[1]));
//     console.log("JWT Payload =", payload);
//
//     console.log('access_token =', getCookie('access_token'));
//     return res.data;
// };


export const getMyPaymentList = async ({page =1 ,size =10}={})=>{
    const res = await jwtAxios.get(prefix,{
        params: {page,size}
    })
    return res.data;
}


export const getPaymentDetail = async (paymentId) =>{
    const res = await jwtAxios.get(`${prefix}/${paymentId}`);
    return res.data
}