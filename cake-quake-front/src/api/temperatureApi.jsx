import jwtAxios from "../utils/jwtUtil.js";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/temperature`;

//온도 조회
export const getTemperature=async ()=>{
    console.log("getTemperature 요청");
    const {data} = await jwtAxios.get(`${prefix}/{uid}`);
    console.log("getTemperature 응답 : ",data);
    return data.currentTemperature;
};

//이력 조회
export const getTemperatureHistory=async ({page = 1, size = 10}) => {
    console.log("getTemperatureHistoy 요청");
    const {data} = await jwtAxios.get(`${prefix}/history`, {
        params: {page, size},
    });
    console.log("📥 getPointHistory 응답:", data.content, "hasNext:", data.hasNext);
    return {
        items: data.content,
        hasNext: data.hasNext,
    };
}

//수동 업데이트
