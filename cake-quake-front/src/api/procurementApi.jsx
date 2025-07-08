import jwtAxios from "../utils/jwtUtil.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;


//-------------------------매장 관련 발주
//매장별 발주 목록
export const getStoreRequests = async (shopId,{page =1 , size = 10, sortField = "procurementId"} ={})=>{
    const res = await jwtAxios.get(`${baseUrl}/shops/${shopId}/procurements`,{
        params:{page,size,sortField}
    }) ;
    return res.data
}

//마이페이지용 상위 3개만 보여주는 헬퍼
export const getTopStoreRequests = (shopId) => getStoreRequests(shopId,{page:1,size:3});


//상태별 발주 목록 조회
export const getRequestByStatus = async (status,{page = 1, size =10,sortField="procurementId"} = {}) =>{
    const res = await jwtAxios.get(`${baseUrl}/procurements/status/${status}`,{
        params: {page, size, sortField}
    });
    return res.data
}

//매장 + 상태 복합 조회
export const getStoreRequestByStatus = async (shopId, status, {page=1,size = 10, sortField="procurementId"} ={} ) =>{
    const res = await  jwtAxios.get(`${baseUrl}/shops/${shopId}/procurements/status/${status}`,{
        params:{page,size,sortField}
        });
    return res.data
}


//단건 발주 상세 조회
export const getRequestDetail = async (shopId, procurementId) =>{
    const res = await jwtAxios.get(`${baseUrl}/shops/${shopId}/procurements/${procurementId}`,)
    return res.data
}

//신규 발주 생성
export const createRequest = async (shopId, {note, items}) =>{
    const payload = {shopId,note,items};
    const res = await jwtAxios.post(`${baseUrl}/shops/${shopId}/procurements`,payload);
    return res.data
}

//판매자용 발주 취소
export const cancelRequestBySeller = async (shopId,procurementId, {reason}) =>{
    const res = await jwtAxios.post(
        `${baseUrl}/shops/${shopId}/procurements/${procurementId}/cancel`,
        { reason }
    );
    return res.data
}

// -------------------관리자 관련 발주
// //관리자 발주 확정(일정 지정)
// export const confirmRequest =async (procurementId, {scheduledDate}) =>{
//     const res =await jwtAxios.post(`${prefix}/procurements/${procurementId}/confirm`,{scheduledDate});
//     return res.data
// }


//관리자: 단건 발주 조회
export const getAdminRequestDetail =async (procurementId) =>{
    const res = await jwtAxios.get(`${baseUrl}/procurements/${procurementId}`);
    return res.data
}

//관리자: 발주 전체 조회
export const getAllRequests = async ({page = 1, size = 10, sortField="procurementId"}={}) =>{
    const res = await jwtAxios.get(`${baseUrl}/procurements`,{
        params: {page,size,sortField}
    });
    return res.data
}

// 관리자용 발주 취소
export const cancelRequestByAdmin = async (procurementId, {reason}) => {
    const res = await jwtAxios.post(
        `${baseUrl}/procurements/${procurementId}/cancel`,
        {reason}
    );
    return res.data;
}