import { useEffect, useState } from "react";
import { getToken } from "../../../api/memberApi";
import { getCookie, setCookie } from "../../../utils/cookieUtil";
import { Link, useNavigate } from "react-router";
import SigninComponent from "../../../components/member/auth/signinComponent";
import { useAuth } from "../../../store/AuthContext";
import { parseJwt } from "../../../utils/parseJwt";

const SigninPage = () => {
    const [userId, setUserId] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState('')

    const { user, setUser } = useAuth();

    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            // 로그인 상태라면 홈 또는 마이페이지 등으로 리디렉트
            navigate("/")
        }
    }, [user, navigate])

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
                // 받은 토큰 파싱
            const payload = parseJwt(accessToken);

            if (payload?.userId && payload?.uname && payload?.role) {
                setUser({ userId: payload.userId, uname: payload.uname, role: payload.role }); // 전역 상태 등록
            }
            navigate('/')
        } catch (err) {
            const msg = err?.response?.data?.message || '로그인 중 오류가 발생했습니다.'
            setErrorMessage(msg)
            console.error("로그인 실패", err)
        }
    }
    
    return (
        <div className="p-4">
            <SigninComponent
                userId={userId}
                password={password}
                errorMessage={errorMessage}
                onUserIdChange={(e) => setUserId(e.target.value)}
                onPasswordChange={(e) => setPassword(e.target.value)}
                handleSubmit={handleSubmit}
            />
        </div>
    )
}



export default SigninPage;