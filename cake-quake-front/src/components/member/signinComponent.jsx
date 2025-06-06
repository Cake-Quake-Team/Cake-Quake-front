import { useState } from "react";
import { getToken } from "../../api/memberApi";
import kakaoIcon from "../../assets/kakao-loginicon.png";


const SigninComponent = () => {
    const [userid, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault()
        // 여기에 로그인 로직 추가
        console.log("ID:", userid, "PW:", password)

        try{
            // accessToken, refreshToken을 쿠키에 저장
            getToken(userid, password).then((res) => {
                const accessToken = res[0]
                const refreshToken = res[1]
    
                setCookie('access_token', accessToken, 1)
                setCookie('refresh_token', refreshToken, 7)
            })

            // 로그인 성공 후 페이지 이동 등 처리
            console.log("로그인 성공")
        } catch (err) {
            console.error("로그인 실패", err)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Please sign in</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="userid" className="block text-sm font-medium text-gray-700"></label>
                        <input
                            id="userid"
                            type="text"
                            value={userid}
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
                    <div className="flex items-center">
                        <input type="checkbox" id="remember" className="mr-2" />
                        <label htmlFor="remember" className="text-sm text-gray-600">
                            자동 로그인
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-teal-400 text-white py-2 rounded-lg hover:bg-teal-500 transition"
                    >
                        로그인
                    </button>

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