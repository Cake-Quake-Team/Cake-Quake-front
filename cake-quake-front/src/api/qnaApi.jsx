import jwtAxios from "../utils/jwtUtil.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

//------------- Q&A (사용자)
// 내 문의 목록 조회
export const getMyQnAList = async ({page =1 , size =10} = {})=>{
    const res = await jwtAxios.get(`${baseUrl}/qna`,{
        params: {page,size}
    })
    return res.data
};

//내 문의 상세 조회
export const getMyQnADetail = async  (qnaId) => {
    const res = await jwtAxios.get(`${baseUrl}/qna/${qnaId}`);
    return res.data
};

//문의 작성
export const createQnA = async  (payload) =>{
    const res = await  jwtAxios.post(`${baseUrl}/qna`,payload);
    return res.data
}

//문의 수정
export const updateQnA = async (qnaId, payload) =>{
    const res = await  jwtAxios.patch(`${baseUrl}/qna/${qnaId}`,payload);
    return res.data;
};

//문의 삭제
export const deleteMyQnA = async (qnaId) => {
    await jwtAxios.delete(`${baseUrl}/qna/${qnaId}`);
    return true;
}

// -------------------QnA 관리자------------------
//유형별 문의 페이징 조회
export const listQnAByType = async (type, {page =1 , size = 10} = {} ) =>{
    const res = await jwtAxios.get(`${baseUrl}/admin/qna/type/${type}`,{
        params: {page,size}
    });
    return res.data;
}

//상태별 문의 페이징 조회
export const listQnAByStatus = async (status,{page =1 ,size =10} = {}) =>{
    const res = await  jwtAxios.get(`${baseUrl}/admin/qna/status/${status}`,{
        params:{page,size}
    });
    return res.data;
}

//전체 문의 최신순 페이징 조회
export const listAllQnA = async ({page=1,size =10} = {})=>{
    const res = await jwtAxios.get(`${baseUrl}/admin/qna`,{
        params:{page,size}
    })
    return res.data
}

//작성자 역활별 뮨의 조죄 (BUYER or SELLER)
export const listQnAByAuthorRole = async (role, {page = 1 ,size =10}={})=>{
    const res = await jwtAxios.get(`${baseUrl}/admin/qna/role/${role}`,{
        params:{page,size}
    });
    return res.data;
}

//관리자 답변 등록
export const respondToQnA = async ({qnaId, adminResponse}) => {
    await  jwtAxios.post(`${baseUrl}/admin/qna/respond`,{
        qnaId, adminResponse
    })
    return true;
}
//단건 조회
export const getQnADetailForAdmin = async (qnaId) => {
    const res = await jwtAxios.get(`${baseUrl}/admin/qna/${qnaId}`);
    return res.data;
};