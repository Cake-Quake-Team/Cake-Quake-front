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
export const getAvailableShops=async (date, time = null, checkSlots = true, page = 0, size = 10) => {

    const response = await jwtAxios.get(`${prefix}/schedule/available-shops-by-date`, {
        params: {
            date: date,
            // time 값이 null이 아닐 때만 'time' 파라미터를 추가
            ...(time && {time: time}),
            checkSlots: checkSlots,
            page: page,
            size: size
        }
    });
    console.log(`API 응답 - 날짜 ${date}, 시간 ${time}, 슬롯 체크 ${checkSlots}, 페이지 ${page}, 사이즈 ${size}의 예약 가능한 매장:`, response.data);

    return {
        content: response.data.content, // 실제 매장 데이터 배열
        last: response.data.last       // 마지막 페이지인지 여부
    };

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
// ⭐⭐⭐ 이 부분을 파일의 맨 아래에 추가하거나, 다른 export 함수들 사이에 추가해주세요! ⭐⭐⭐
/**
 * 특정 매장의 상세 정보를 조회합니다.
 * 백엔드: GET /api/v1/shops/{shopId}
 */
export const getShopDetails = async (shopId) => {
    try {
        // 실제 백엔드 API 엔드포인트에 맞게 수정해주세요.
        // 예를 들어, 매장 상세 정보를 제공하는 API가 /api/v1/shops/{shopId} 라고 가정합니다.
        const response = await jwtAxios.get(`${API_SERVER_HOST}/api/v1/shops/${shopId}`); // prefix 대신 API_SERVER_HOST를 사용하거나, 새 prefix 변수 필요.
        console.log(`API 응답 - 매장 ${shopId}의 상세 정보:`, response.data);
        return response.data; // 매장 상세 정보 객체 반환 (shopName, address 등 포함)
    } catch (error) {
        console.error(`Error fetching shop details for shopId ${shopId}:`, error);
        throw error;
    }
};

//api 다시 확인
