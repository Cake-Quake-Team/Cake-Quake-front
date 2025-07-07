import jwtAxios from "../utils/jwtUtil.js";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${ API_SERVER_HOST }/api/v1`;

// 1. 달력에서 날짜 선택 (예: 2025-06-25) 후, 특정 매장의 가능한 시간 조회
export const getAvailableTimes = async (shopId, date) =>{

    const response = await jwtAxios.get(`${prefix}/schedule/available-times`, {
        params: {
            shopId: shopId,
            date: date
        }
    });
    const times = response.data;
    console.log(`API 응답 - 매장 ${shopId}, 날짜 ${date}의 예약 가능한 시간:`, times);
    return times;

}

// 2. 날짜 (예: 2025-06-25)와 시간 (예: 14:00) 선택 후, 가능한 매장 조회 (모달에 표시)
export const getAvailableShops=async (date, time = null, checkSlots = true) => {

    const response = await jwtAxios.get(`${prefix}/schedule/available-shops-by-date`, {
        params: {
            date: date,
            // time 값이 null이 아닐 때만 'time' 파라미터를 추가
            ...(time && {time: time}),
            checkSlots: checkSlots
        }
    });
    const shops = response.data;
    console.log(`API 응답 - 날짜 ${date}, 시간 ${time}, 슬롯 체크 ${checkSlots}의 예약 가능한 매장:`, shops);
    return shops;

}

/**
 * 특정 매장의 특정 날짜에 대한 운영 시간 정보를 조회
 * 백엔드: GET /api/v1/schedule/shops/{shopId}/operating-hours
*/
export const getShopOperatingHours = async (shopId, date) => {
    try {
        const response = await jwtAxios.get(`${prefix}/schedule/shops/${shopId}/operating-hours`, {
            params: { date }
        });
        console.log(`API 응답 - 매장 ${shopId}, 날짜 ${date}의 운영 시간:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching operating hours for shop ${shopId} on ${date}:`, error);
        throw error;
    }
};

/**
 * 특정 매장, 특정 날짜에 예약이 가득 찬 (더 이상 예약 불가능한) 시간 목록을 HH:MM 문자열 형식으로 조회합
 * 백엔드: GET /api/v1/schedule/shops/{shopId}/occupied-time-slots
*/
export const getOccupiedTimeSlots = async (shopId, date) => {
    try {
        const response = await jwtAxios.get(`${prefix}/schedule/shops/${shopId}/occupied-time-slots`, {
            params: { date }
        });
        console.log(`API 응답 - 매장 ${shopId}, 날짜 ${date}의 예약된 시간 슬롯:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching occupied time slots for shop ${shopId} on ${date}:`, error);
        throw error;
    }
};
//api 다시 확인
