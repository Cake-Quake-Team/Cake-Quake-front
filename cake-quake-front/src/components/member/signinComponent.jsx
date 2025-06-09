import { useState } from "react";
import { getToken } from "../../api/memberApi";
import kakaoIcon from "../../assets/kakao-loginicon.png";
import { setCookie } from "../../utils/cookieUtil";
import { Link, useNavigate } from "react-router";


const SigninComponent = () => {
    const [userId, setUserId] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        setErrorMessage('') // 이전 에러 초기화

        try{
            // accessToken, refreshToken을 쿠키에 저장
            const {accessToken, refreshToken} = await getToken(userId, password)
    
                setCookie('access_token', accessToken, 1)
                setCookie('refresh_token', refreshToken, 7)

            // 로그인 성공 후 메인 페이지로 이동
            console.log("로그인 성공")
            navigate('/')
        } catch (err) {
            const msg = err?.response?.data?.message || '로그인 중 오류가 발생했습니다.'
            setErrorMessage(msg)
            console.error("로그인 실패", err)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Please sign in</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700"></label>
                        <input
                            id="userId"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="아이디 입력"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700"></label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="비밀번호 입력"
                            required
                        />
                    </div>
                    {/* <div className="flex items-center">
                        <input type="checkbox" id="remember" className="mr-2" />
                        <label htmlFor="remember" className="text-sm text-gray-600">
                            자동 로그인
                        </label>
                    </div> */}
                    {errorMessage && (
                        <div style={{ color: 'red', marginTop: '8px' }}>{errorMessage}</div>
                    )}
                    <button type="submit"
                            className="w-full bg-teal-400 text-white py-2 rounded-lg hover:bg-teal-500 transition font-bold">
                        로그인
                    </button>
                    <Link to="/auth/signup" className="w-full block text-center bg-rose-50 text-gray-700 py-2 rounded-lg hover:bg-rose-200 transition font-bold">
                        처음 방문하셨나요? 회원 가입(Sign up)
                    </Link>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Login with OAuth 2.0
                    </div>

                    <button className="w-full flex items-center justify-center">
                        <img src={kakaoIcon} alt="Kakao" className="mt-3 transition py-2 rounded-lg  gap-2" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SigninComponent;