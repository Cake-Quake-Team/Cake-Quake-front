import jwtAxios from "../utils/jwtUtil.js";

const prefix = import.meta.env.VITE_API_BASE_URL

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

// 알림 삭제
export const deleteNotification = async (notificationId) => {
    try {
        const response = await jwtAxios.delete(`${prefix}/notifications/${notificationId}`);
        return response.data;
    } catch (error) {
        console.error(`알림 삭제 실패 (ID: ${notificationId}):`, error);
        throw error;
    }
};