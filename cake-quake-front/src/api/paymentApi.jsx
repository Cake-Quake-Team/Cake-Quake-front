import jwtAxios from "../utils/jwtUtil.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

/** 1. 결제 생성 */
export const createPayment = async ({ orderId, provider, amount }) => {
    const res = await jwtAxios.post(`${baseUrl}/payments`, { orderId, provider, amount });
    return res.data; // PaymentResponseDTO
};

/** 2. 내 결제 목록 조회 (현재 pagination 파라미터 무시됨) */ //0
export const listMyPayments = async ({ page = 1, size = 10 } = {}) => {
    const res = await jwtAxios.get(`${baseUrl}/payments`, {
        params: { page, size }
    });
    return res.data; // PaymentResponseDTO[]
};

/** 3. 단건 조회 */ //0
export const getPaymentDetail = async (paymentId) => {
    const res = await jwtAxios.get(`${baseUrl}/payments/${paymentId}`);
    return res.data; // PaymentResponseDTO
};

/** 4. 카카오 결제 승인 콜백 */
export const approveKakaoPayment = async ({ orderId, userId, pgToken }) => {
    const res = await jwtAxios.get(`${baseUrl}/payments/kakao/approve`, {
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
    const res = await jwtAxios.get(`${baseUrl}/payments/toss/success`, {
        params: { paymentKey, orderId }
    });
    return res.data; // PaymentResponseDTO
};

/** 6. (옵션) 토스 결제 실패 콜백 처리 */
export const failTossPayment = async ({ paymentKey, orderId, errorCode, errorMessage }) => {
    const res = await jwtAxios.get(`${baseUrl}/payments/toss/fail`, {
        params: { paymentKey, orderId, errorCode, errorMessage }
    });
    return res.data; // 실패 메시지 문자열
};

/** 7. (옵션) 결제 취소 */
export const cancelPayment = async (paymentId, { reason }) => {
    const res = await jwtAxios.post(`${baseUrl}/payments/${paymentId}/cancel`, { reason });
    return res.data; // PaymentResponseDTO
};

/** 8. (옵션) 결제 환불 */
export const refundPayment = async (paymentId, { refundAmount }) => {
    const res = await jwtAxios.post(`${baseUrl}/payments/${paymentId}/refund`, { refundAmount });
    return res.data; // PaymentResponseDTO
};

/** 주문별 결제 내역 조회 */
export const getOrderPayments = async (orderId) => {
    const res = await jwtAxios.get(`${baseUrl}/payments/order/${orderId}`)
    return res.data  // PaymentResponseDTO[]
}
