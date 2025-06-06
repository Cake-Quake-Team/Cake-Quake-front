import axios from 'axios';


const baseUrl = import.meta.env.VITE_API_BASE_URL
const endpoints = {
    signin: 'auth/signin',
    signup: 'auth/signup',
} 

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
        console.error("로그인 오류:", error)
        throw error
    }

}


