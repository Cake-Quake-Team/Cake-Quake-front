import jwtAxios from "../utils/jwtUtil.js";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/payments`;

/** 1. 결제 생성 */
export const createPayment = async ({ orderId, provider, amount }) => {
    const res = await jwtAxios.post(prefix, { orderId, provider, amount });
    return res.data; // PaymentResponseDTO
};

/** 2. 내 결제 목록 조회 (현재 pagination 파라미터 무시됨) */
export const listMyPayments = async ({ page = 1, size = 10 } = {}) => {
    const res = await jwtAxios.get(prefix, {
        params: { page, size }
    });
    return res.data; // PaymentResponseDTO[]
};

/** 3. 단건 조회 */
export const getPaymentDetail = async (paymentId) => {
    const res = await jwtAxios.get(`${prefix}/${paymentId}`);
    return res.data; // PaymentResponseDTO
};

/** 4. 카카오 결제 승인 콜백 */
export const approveKakaoPayment = async ({ orderId, userId, pgToken }) => {
    const res = await jwtAxios.get(`${prefix}/kakao/approve`, {
        params: {
            partner_order_id: orderId,
            partner_user_id:  userId,
            pg_token:         pgToken,
        }
    });
    return res.data; // PaymentResponseDTO
};

/** 5. 토스 결제 승인 콜백 */
export const approveTossPayment = async ({ paymentKey, orderId }) => {
    const res = await jwtAxios.get(`${prefix}/toss/success`, {
        params: { paymentKey, orderId }
    });
    return res.data; // PaymentResponseDTO
};

/** 6. (옵션) 토스 결제 실패 콜백 처리 */
export const failTossPayment = async ({ paymentKey, orderId, errorCode, errorMessage }) => {
    const res = await jwtAxios.get(`${prefix}/toss/fail`, {
        params: { paymentKey, orderId, errorCode, errorMessage }
    });
    return res.data; // 실패 메시지 문자열
};

/** 7. (옵션) 결제 취소 */
export const cancelPayment = async (paymentId, { reason }) => {
    const res = await jwtAxios.post(`${prefix}/${paymentId}/cancel`, { reason });
    return res.data; // PaymentResponseDTO
};

/** 8. (옵션) 결제 환불 */
export const refundPayment = async (paymentId, { refundAmount }) => {
    const res = await jwtAxios.post(`${prefix}/${paymentId}/refund`, { refundAmount });
    return res.data; // PaymentResponseDTO
};
