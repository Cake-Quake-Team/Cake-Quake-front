import jwtAxios from "../utils/jwtUtil.js";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${ API_SERVER_HOST }/api/v1`;

// 1. 달력에서 날짜 선택 (예: 2025-06-25) 후, 특정 매장의 가능한 시간 조회
async function getAvailableTimes(shopId, date) {

    const response = jwtAxios.get(`${prefix}/schedule/available-times?shopId=${shopId}&date=${date}`);
    const times = response.data;
    console.log('사용 가능한 시간:', times);

}

// 2. 날짜 (예: 2025-06-25)와 시간 (예: 14:00) 선택 후, 가능한 매장 조회 (모달에 표시)
async function getAvailableShops(date, time) {

    const response = jwtAxios.get(`${prefix}/schedule/available-shops?date=${date}&time=${time}`);
    const shops = response.data;
    console.log('예약 가능한 매장:', shops);

}

//api 다시 확인
