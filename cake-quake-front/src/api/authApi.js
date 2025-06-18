import axios from 'axios';
import jwtAxios from '../utils/jwtUtil';


const baseUrl = import.meta.env.VITE_API_BASE_URL
const endpoints = {
    signupBuyers: 'auth/signup/buyers',
    signupSellerStep1: 'auth/signup/sellers/step1',
    signupSellerStep2: 'auth/signup/sellers/step2',
    signin: 'auth/signin',
    signout: 'auth/signout',
    otpSend: 'auth/otp/send',
    otpVerify: 'auth/otp/verify',
    verifyBusiness: 'auth/business/verify',

    // 토큰-시큐리티 어노테이션 접근 테스트용 url
    tokenTest: 'auth/token-test',
    sellerOnly: 'auth/seller-only',
    adminOnly: 'auth/admin-only',
} 

// 회원가입(구매자)
export const singup = async(signupData) => {
    try {
        const res = await axios.post(`${baseUrl}/${endpoints.signupBuyers}`, signupData, {
            headers: { 'Content-Type': 'application/json' }
        })

        console.log(res.data)
        return res.data

    } catch (error) {
        throw error
    }
}

// 회원가입(판매자-1단계)
export const postSellerSignupStep1 = async (formData) => {

    try {
        const res = await axios.post(`${baseUrl}/${endpoints.signupSellerStep1}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        console.log(res.data)
        return res.data

    } catch (error) {
        throw error
    }
}

// 회원가입(판매자-2단계)
export const postSellerSignupStep2 = async (formData) => {

    try {
        const res = await axios.post(`${baseUrl}/${endpoints.signupSellerStep2}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        console.log(res.data)
        return res.data

    } catch (error) {
        throw error
    }
}

// 휴대폰 인증 호출 - 인증 코드 받기
export const getVerificationCode = async(data) => {
    try {
        const res = await axios.post(`${baseUrl}/${endpoints.otpSend}`, data, {
            headers: { 'Content-Type': 'application/json' }
        })
        // console.log(res.data)
        return res.data

    } catch (error) {
        throw error
    }
}

// 휴대폰 인증 검증
export const verifyCode = async(data) => {
    try {
        const res = await axios.post(`${baseUrl}/${endpoints.otpVerify}`, data, {
            headers: { 'Content-Type': 'application/json' }
        })
        // console.log(res.data)
        return res.data

    } catch (error) {
        throw error
    }
}

// 사업자 진위여부 확인
export const verifyBusiness = async(businessData) => {

    const payload = {
        b_no: businessData.businessNumber,
        start_dt: businessData.openingDate,
        p_nm: businessData.bossName,
    }
    try {
        const res = await axios.post(`${baseUrl}/${endpoints.verifyBusiness}`, payload, {
            headers: { 'Content-Type': 'application/json' }
        })
        console.log(res.data)
        return res.data

    } catch (error) {
        throw error
    }
}


// 로그인 해서 토큰 얻어오기
export const getToken = async(userId, password) => {
    try {
        const res = await axios.post(`${baseUrl}/${endpoints.signin}`, {userId, password}, {
            headers: { 'Content-Type': 'application/json' }
        })
        console.log(res.data)
        return res.data

    } catch (error) {
        throw error
    }
}


/*
    테스트용
*/
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
        const res = await jwtAxios.get(`${baseUrl}/${endpoints.sellerOnly}`, header)

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


