import jwtAxios from "../utils/jwtUtil.js";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${ API_SERVER_HOST }/api`;

// 알림 목록 조회
export const getMyNotifications = async () => {
    const response = await jwtAxios.get(`${prefix}/notifications`)
    return response.data;
}

// 알림 읽음 표시
export const markAsRead = async (notificationId) => {
    const response = await jwtAxios.patch(`${prefix}/notifications/${notificationId}/read`);
    return response.data;
}