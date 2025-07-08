import jwtAxios from "../utils/jwtUtil.js";

const prefix = import.meta.env.VITE_API_BASE_URL

// 대표 뱃지 설정
export const setProfileBadge = async (uid, badgeId) => {
    const response = await jwtAxios.put(`${prefix}/buyers/${uid}/badges/profile`, {badgeId}, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.data;
};

// 대표 뱃지 조회
export const getRepresentativeBadge = async (uid) => {
    const response = await jwtAxios.get(`${prefix}/buyers/${uid}/badges/profile`);
    return response.data;
};

// 뱃지 획득
export const acquireBadge = async (uid, badgeId) => {
    const response = await jwtAxios.post(`${prefix}/buyers/${uid}/badges/acquire`, {badgeId});
    return response.data;
};

// 획득한 뱃지 목록 조회
export const getMemberBadges = async (uid) => {
    const response = await jwtAxios.get(`${prefix}/buyers/${uid}/badges`);
    return response.data;
};

// 전체 뱃지 목록 조회
export const getAllBadgesWithAcquisitionStatus = async (uid) => {
    const response = await jwtAxios.get(`${prefix}/buyers/${uid}/badges/all`);
    return response.data;
};
