import jwtAxios from "../utils/jwtUtil"


const baseUrl = import.meta.env.VITE_API_BASE_URL
const endpoints = {
    sellerProfile: 'sellers/profile',
}

export const getSellerProfile = async() => {
    try {
        const res = await jwtAxios.get(`${baseUrl}/${endpoints.sellerProfile}`)

        console.log(res.data)
        return res.data
    } catch (error) {
        console.log("접근 오류:")
        throw error
    }
}


export const modifySellerProfile = async(uid, form) => {
// 판매자만 접근 가능. 역할 테스트
export const testSellerOnly = async() => {
    try {
        const res = await jwtAxios.get(`${baseUrl}/${endpoints.sellerOnly}`)

        console.log(res.data)
        return res.data
    } catch (error) {
        console.error("판매자만 접근 가능:")
        throw error
    }
}

// 관리자만 접근 가능. 역할 테스트
export const testAdminOnly = async() => {

    try {
        const res = await jwtAxios.patch(`${baseUrl}/${endpoints.sellerProfile}/${uid}`, form)

        console.log(res.data)
        return res.data
    } catch (error) {
        console.log("접근 오류:")
        throw error
    }
}