import axios from 'axios';
import jwtAxios from '../utils/jwtUtil';


const baseUrl = import.meta.env.VITE_API_BASE_URL
const endpoints = {
    signin: 'auth/signin',
    signup: 'auth/signup',
    // 토큰-시큐리티 어노테이션 접근 테스트용 url
    tokenTest: 'auth/token-test',
    sellerOnly: 'auth/seller-only',
    adminOnly: 'auth/admin-only',
} 

// 로그인 해서 토큰 얻어오기
export const getToken = async(userId, password) => {

    const header = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
        const res = await axios.post(`${baseUrl}/${endpoints.signin}`, {userId, password}, header)

        console.log(res.data)
        return res.data

    } catch (error) {
        throw error
    }
}

// 로그인 -> 쿠키에 저장된 토큰으로 다른 경로 접근
export const testToken = async() => {
    try {
        const res = await jwtAxios.get(`${baseUrl}/${endpoints.tokenTest}`)

        console.log(res.data)
        return res.data
    } catch (error) {
        console.log("접근 오류:")
        throw error
    }
}

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
        const res = await jwtAxios.get(`${baseUrl}/${endpoints.adminOnly}`, header)

        console.log(res.data)
        return res.data
    } catch (error) {
        console.error("관리자만 접근 가능:")
        throw error
    }
}


