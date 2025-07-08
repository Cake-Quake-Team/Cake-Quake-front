import jwtAxios from "../utils/jwtUtil.js";

const prefix = "/api/v1";

// 채팅방 생성 또는 조회
export const createOrGetChatRoom = async ({ sellerUid, buyerUid, shopId }) => {
    const response = await jwtAxios.post(`${prefix}/chatting/rooms`, { sellerUid, buyerUid, shopId });
    return response.data;
};

// 과거 채팅 메시지 조회
export const getChatMessages = async (roomId) => {
    const response = await jwtAxios.get(`${prefix}/chatting/rooms/${roomId}/messages`);
    return response.data;
};

// 판매자 채팅방 목록 조회
export const getSellerChatRooms = async (shopId) => {
    const response = await jwtAxios.get(`${prefix}/chatting/seller/rooms/${shopId}`);
    return response.data;
};