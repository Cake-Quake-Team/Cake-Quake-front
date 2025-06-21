import jwtAxios from "../utils/jwtUtil.js";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/temperature`;

//온도 조회
export const getTemperature=async (uid)=>{
    console.log("getTemperature 요청 - UID:", uid);
    const {data} = await jwtAxios.get(`${prefix}/${uid}`);
    console.log("getTemperature 응답 : ",data);
    return data;
};

//이력 조회
export const getTemperatureHistory=async ({uid,page = 1, size = 10}) => {
    console.log("getTemperatureHistory 요청 - UID:", uid);
    const {data} = await jwtAxios.get(`${prefix}/${uid}/histories`, {
        params: {page, size},
    });
    console.log("📥 getPointHistory 응답:", data.content, "hasNext:", data.hasNext);
    return {
        items: data.content,
        hasNext: data.hasNext,
    };
}

//수동 업데이트
