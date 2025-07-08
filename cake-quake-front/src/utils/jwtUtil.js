import axios from "axios";


/*
    25.07.02 리액트 쿠키에서 HTTPOnly 쿠키로 변경. 백 서버에서 토큰을 받아옴.
*/
// const jwtAxios = axios.create()
const jwtAxios = axios.create({
    // baseURL: 'http://localhost:8080',
    withCredentials: true // HTTPOnly 쿠키 저장을 위해 사용.
})
const baseUrl = import.meta.env.VITE_API_BASE_URL

// //요청 보내기 전에 추가 작업
// const beforeReq = (config) => {
//     console.log("---------요청 전 작업---------")

//     const accessToken = getCookie("access_token")

//     if (accessToken) {
//         const payload = JSON.parse(atob(accessToken.split('.')[1]));
//         console.log("로그인 유저 role:", payload.role);
//     }

//     config.headers.Authorization = `Bearer ${accessToken}`
//     return config
// }
    // 요청 인터셉터
    const beforeReq = (config) => {
        console.log("요청 전 작업 (HttpOnly 쿠키 기반)")
        return config
    }

// // 요청 실패 처리
// const requestFail = (err) => {
//     console.log("---------요청 오류---------")

//     return Promise.reject(err)
// }
    // 요청 실패
    const requestFail = (err) => {
        console.error("요청 오류:", err)
        return Promise.reject(err)
    }

    // 성공적인 응답이 왔을 때 추가 작업
    const beforeRes = async (res) => {
        console.log("---------응답 전 처리---------")

        return res
    }


// // 응답 실패 시 추가 작업
// const responseFail = async (err) => {
//     console.log("---------응답 실패 오류---------")
//     console.log(err)

//     // 401 unauthorized
//     if (err.response?.status === 401) {
//         // const msg = getErrorMsg(err)
//         const errorCode = err.response.data?.code

//         // refresh 이용해서 다시 한 번 시도
//         // if (msg === "Expired token") {
//         if (errorCode === 804) {
//             console.log("---------만료된 토큰을 새로 고침---------")

//             try {
//                 // 토큰을 갱신한 후 원래 요청 재시도
//                 const newResponse = await refreshTokens(err.config)
//                 return newResponse
//             } catch (refreshError) {
//                 console.log("Token refresh failed", refreshError)
//                 // window.location.href = "/auth/signin"
//             }
//         } // end if
//     } // end if

//     return Promise.reject(err)
// }
    const responseFail = async (err) => {
        console.log("---------응답 실패 오류---------")
        console.log(err)
        if (err.response?.status === 401) {
            // console.warn("401 에러 - 인증 만료일 수 있음")

            const errorCode = err.response.data?.code

            // 서버에서 에러 코드 802: 액세스 토큰 만료
            if (errorCode === 802) {
                console.log("---------만료된 토큰을 새로 고침---------")
                try {
                    // 리프레시 요청 (쿠키 자동 전송)
                    console.log("---토큰 재발급 요청 시작")
                    const res = await axios.post(`${baseUrl}/auth/refresh`, {}, {
                        withCredentials: true
                    })
                    // console.log("리프레시토큰 요청 후: ", res)

                } catch (refreshError) {
                    console.log("Token refresh failed", refreshError)
                    const refreshErrorCode = refreshError.response?.data?.code
                    // refreshToken 도 유효하지 않음 (재발급 실패)
                    if (refreshErrorCode === 803) {
                        console.log("---재로그인 필요 (refreshToken도 만료됨)")
                        // 아래 페이지는 로그인 없이 이동 가능
                        const allowedPaths = [
                            "/auth/signin", 
                            "/", 
                            "/auth/kakao", 
                            "/auth/signup", 
                            "/auth/signup/buyer",
                            "/auth/signup/seller-step1",
                            "/auth/signup/seller-step2",
                        ]
                        if (!allowedPaths.includes(location.pathname)) {
                            window.location.replace("/auth/signin")
                        }
                        return;
                    }// end if
                } // try~catch
            }// end if
            
        }// end if

        return Promise.reject(err)
    };

// // 토큰 갱신 함수
// async function refreshTokens(originalConfig) {
//     console.log("---토큰 재발급 요청 시작")

//     const accessToken = getCookie("access_token")
//     const refreshToken = getCookie("refresh_token")

//     const header = {
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json",
//         },
//     }

//     // 토큰 갱신 요청
//     const res = await axios.post(
//         `${baseUrl}/auth/refresh`,
//         { refreshToken },
//         header
//     )

//     const newAccessToken = res.data.accessToken;
//     const newRefreshToken = res.data.refreshToken;

//     setCookie("access_token", newAccessToken, 1)
//     setCookie("refresh_token", newRefreshToken, 7)

//     console.log("토큰 재발급 성공")

//     // 원래 요청의 Authorization 헤더를 새로운 토큰으로 수정
//     if (originalConfig) {
//         originalConfig.headers = {
//             ...originalConfig.headers,
//             Authorization: `Bearer ${newAccessToken}`,
//         }

//         eturn axios(originalConfig)r
//     }

// }

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