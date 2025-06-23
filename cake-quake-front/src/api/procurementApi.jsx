import jwtAxios from "../utils/jwtUtil.js";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api`;


//-------------------------매장 관련 발주
//매장별 발주 목록
export const getStoreRequests = async (shopId,{page =1 , size = 10, sortField = "procurementId"} ={})=>{
    const res = await jwtAxios.get(`${prefix}/shops/${shopId}/procurements`,{
        params:{page,size,sortField}
    }) ;
    return res.data
}

//상태별 발주 목록 조회
export const getRequestByStatus = async (status,{page = 1, size =10,sortField="procurementId"} = {}) =>{
    const res = await jwtAxios.get(`${prefix}/procurements/status/${status}`,{
        params: {page, size, sortField}
    });
    return res.data
}

//매장 + 상태 복합 조회
export const getStoreRequestByStatus = async (shopId, status, {page=1,size = 10, sortField="procurementId"} ={} ) =>{
    const res = await  jwtAxios.get(`${prefix}/shops/${shopId}/procurements/status/${status}`,{
        params:{page,size,sortField}
        });
    return res.data
}


//단건 발주 상세 조회
export const getRequestDetail = async (shopId, procurementId) =>{
    const res = await jwtAxios.get(`${prefix}/shops/${shopId}/procurements/${procurementId}`,)
    return res.data
}

//신규 발주 생성
export const createRequest = async (shopId, {note, items}) =>{
    const payload = {shopId,note,items};
    const res = await jwtAxios.post(`${prefix}/shops/${shopId}/procurements`,payload);
    return res.data
}


// -------------------관리자 관련 발주
//관리자 발주 확정(일정 지정)
export const confirmRequest =async (procurementId, {scheduledDate}) =>{
    const res =await jwtAxios.post(`${prefix}/procurements/${procurementId}/confirm`,{scheduledDate});
    return res.data
}


//관리자: 단건 발주 조회
export const getAdminRequestDetail =async (procurementId) =>{
    const res = await jwtAxios.get(`${prefix}/procurements/${procurementId}`);
    return res.data
}

//관리자: 발주 전체 조회
export const getAllRequests = async ({page = 1, size = 10, sortField="procurementId"}={}) =>{
    const res = await jwtAxios.get(`${prefix}/procurements`,{
        params: {page,size,sortField}
    });
    return res.data
}