// utils/kakaoAxios.js
import axios from 'axios';
import { getCookie } from './cookieUtil';

const kakaoAxios = axios.create({
    baseURL: 'https://5832-203-247-166-251.ngrok-free.app', // ✅ 결제용 ngrok 주소
});

kakaoAxios.interceptors.request.use((config) => {

    console.log("access_token =", getCookie("access_token"));
    const token = getCookie("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default kakaoAxios;
