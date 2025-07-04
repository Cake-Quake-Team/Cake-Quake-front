// import { Cookies } from "react-cookie";
 
// const cookies = new Cookies()
 
// export const setCookie = (name, value, days) => {
 
//     const expires = new Date()
//     expires.setUTCDate(expires.getUTCDate() + days ) //보관기한

//     // 경로설정. 앱 전체에서 사용
//     return cookies.set(name, value, {path: '/', expires: expires})

//     // https용
//     // return cookies.set(name, value, {path: '/', expires: expires, secure: true, sameSite: 'none'})
 
// }
 
// export const getCookie = (name) => {
 
//     return cookies.get(name)
// }
 
// export const removeCookie = (name , path = "/") => {
 
//     cookies.remove(name, {path})
// }