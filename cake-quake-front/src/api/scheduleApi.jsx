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

//api 다시 확인
