import axios from "axios";
import {getCookie, setCookie} from "~/util/cookieUtil";

const jwtAxios = axios.create()

//요청 보내기 전에 추가 작업
const beforeReq = (config) => {
    console.log("---------요청 전 작업---------")

    const accessToken = getCookie("access_token")
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
}

// 요청 실패 처리
const requestFail = (err) => {
    console.log("---------요청 오류---------")

    return Promise.reject(err)
}

// 성공적인 응답이 왔을 때 추가 작업
const beforeRes = async (res) => {
    console.log("---------응답 전 처리---------")

    return res
}

// 응답 실패 시 추가 작업업
const responseFail = async (err) => {
    console.log("---------응답 실패 오류---------")
    console.log(err)

    // 401 unauthorized
    if (err.response?.status === 401) {
        const msg = getErrorMsg(err)

        // refresh 이용해서 다시 한 번 시도
        if (msg === "Expired token") {
            console.log("---------만료된 토큰을 새로 고침---------")

            try {
                // 토큰을 갱신한 후 원래 요청 재시도
                const newResponse = await refreshTokens(err.config)
                return newResponse
            } catch (refreshError) {
                console.log("Token refresh failed", refreshError)
            }
        } // end if
    } // end if

    return Promise.reject(err)
}

// 토큰 갱신 함수
async function refreshTokens(originalConfig) {

    const accessToken = getCookie("access_token")
    const refreshToken = getCookie("refresh_token")

    const header = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    }

    // 토큰 갱신 요청
    const res = await axios.post(
        "http://localhost:8080/api/v1/member/refresh",
        { refreshToken },
        header
    )

    const newAccessToken = res.data[0]
    const newRefreshToken = res.data[1]

    setCookie("access_token", newAccessToken, 1)
    setCookie("refresh_token", newRefreshToken, 7)

    // 원래 요청의 Authorization 헤더를 새로운 토큰으로 수정
    if (originalConfig) {
        originalConfig.headers = {
            ...originalConfig.headers,
            Authorization: `Bearer ${newAccessToken}`,
        }

        return axios(originalConfig)
    }

}

// 에러 메시지 추출
function getErrorMsg(err) {
    const errorObj = err.response?.data

    if (errorObj?.error) {
        const errorMsg = errorObj.error
        console.log("에러 메시지:", errorMsg)
        return errorMsg
    }
}

jwtAxios.interceptors.request.use(beforeReq, requestFail)

jwtAxios.interceptors.response.use(beforeRes, responseFail)

export default jwtAxios