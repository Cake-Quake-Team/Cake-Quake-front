import axios from 'axios';
import jwtAxios from '../utils/jwtUtil';

const rest_api_key = import.meta.env.VITE_KAKAO_LOGIN_REST_API_KEY
const redirect_uri = import.meta.env.VITE_KAKAO_REDIRECT_URI

const auth_code_path = import.meta.env.VITE_KAKAO_AUTH_CODE_PATH
const access_token_url = import.meta.env.VITE_KAKAO_ACCESS_TOKEN_URL

const baseUrl = import.meta.env.VITE_API_BASE_URL
const endpoints = {
    signupBuyers: 'auth/signup/buyers',
    signupSellerStep1: 'auth/signup/sellers/step1',
    signupSellerStep2: 'auth/signup/sellers/step2',
    signupSocial: 'auth/signup/social',
    signin: 'auth/signin',
    myInfo: 'auth/members/me',
    signout: 'auth/signout',
    signinKakao: 'auth/signin/kakao',
    otpSend: 'auth/otp/send',
    otpVerify: 'auth/otp/verify',
    verifyBusiness: 'auth/business/verify',
    verifyPassword: 'auth/password/verify',
    password: 'auth/password',

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

// // 로그인 해서 토큰 얻어오기
// export const getToken = async(userId, password) => {
//     try {
//         const res = await axios.post(`${baseUrl}/${endpoints.signin}`, {userId, password}, {
//             headers: { 'Content-Type': 'application/json' }
//         })
//         console.log(res.data)
//         return res.data

//     } catch (error) {
//         throw error
//     }
// }
// 로그인 해서 토큰 얻어오기
export const getToken = async(userId, password) => {
    try {
        const res = await axios.post(`${baseUrl}/${endpoints.signin}`, { userId, password }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true  // 서버 쿠키를 저장하는 데 필요함.
        })
        console.log(res.data)
        return res.data

    } catch (error) {
        throw error
    }
}

// 로그인 후 서버에서 토큰 파싱한 정보 가져오기_uid, userId, username, role, shopId
export const getSigninUserInfo = async() => {

    try {
        const res = await jwtAxios.get(`${baseUrl}/${endpoints.myInfo}`)
        console.log(res.data)
        return res.data

    } catch (error) {
        throw error
    }
    
}

// 로그아웃 (토큰 삭제)
export const postSignout = async() => {

    try {
        await jwtAxios.post(`${baseUrl}/${endpoints.signout}`)

    } catch (error) {
        throw error
    }
    
}

// [카카오로그인] 링크
export const getKakaoLoginLink = () => {

    const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`

    return kakaoURL
}

// [카카오로그인] 액세스 토큰 얻기
export const getKakaoAccessToken = async (authCode) => {
 
    const header = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }
    const params = {
        grant_type: "authorization_code",
        client_id: rest_api_key,
        redirect_uri: redirect_uri,
        code: authCode
    }
    try {
        const res = await axios.post(access_token_url, params , header)
    
        const accessToken = res.data.access_token
    
        return accessToken
    } catch (error) {

        console.error("카카오 토큰 요청 에러", error);
        throw error
    }
}

// [카카오로그인] 토큰으로 유저 정보 획득
export const getMemberWithAccessToken = async (accessToken) => {

    const res = await axios.post(
        `${baseUrl}/${endpoints.signinKakao}`,
        {},
        {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true
        }
    )

    console.log("getMemberWithAccessToken---res.data: ", res.data)

    return res.data
}

// [카카오로그인] 회원 가입
export const singupKakao = async(signupData) => {
    try {
        const res = await axios.post(`${baseUrl}/${endpoints.signupSocial}`, signupData, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
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
        // console.log(res.data)
        return res.data

    } catch (error) {
        throw error
    }
}

// (탈퇴 전)비밀번호 확인
export const verifyPassword = async(form) => {
    try {
        const res = await jwtAxios.post(`${baseUrl}/${endpoints.verifyPassword}`, form)

        console.log(res.data)
        return res.data
    } catch (error) {
        console.log("접근 오류:")
        throw error
    }
}

// 비밀번호 변경
export const changePassword = async(form) => {
    try {
        const res = await jwtAxios.patch(`${baseUrl}/${endpoints.password}`, form)

        console.log(res.data)
        return res.data
    } catch (error) {
        console.log("접근 오류:")
        throw error
    }
}




// ---------------------------테스트용------------------------------

// [TEST] 로그인 후 토큰 접근 테스트 (토큰 검증용)
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

// [TEST] 판매자 접근 권한 테스트
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

// [TEST] 관리자 접근 권한 테스트
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


