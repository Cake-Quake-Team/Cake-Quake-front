import { useEffect, useState } from "react";
import { setCookie } from "../../../utils/cookieUtil";
import { useNavigate } from "react-router";
import SigninComponent from "../../../components/member/auth/signinComponent";
import { useAuth } from "../../../store/AuthContext";
import { parseJwt } from "../../../utils/parseJwt";
import { getKakaoLoginLink, getToken } from "../../../api/authApi";

const SigninPage = () => {

    // 스크롤 제일 위로 이동
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [userId, setUserId] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState('')

    const { user, setUser } = useAuth()

    const navigate = useNavigate()

    const kakaoLink = getKakaoLoginLink()

    // 역할에 따라 로그인 후 이동 페이지 분리 -> SELLER, BUYER
    useEffect(() => {
        if (user && user.role) {
            // 역할에 따라 이동할 페이지 결정
            if (user.role === "SELLER") {
                navigate(`/shops/${user.shopId}`)
            } else if (user.role === "ADMIN") {
                navigate("/admin")
            } else if (user.role === "BUYER") {
                navigate("/buyer")
            }
        }
    }, [user, navigate])

    const handleSubmit = async(e) => {
        e.preventDefault()
        setErrorMessage('') // 이전 에러 초기화

        try{
            // accessToken, refreshToken을 쿠키에 저장
            const data = await getToken(userId, password)

            // localStorage.setItem("userId", data.userId)

            setCookie('access_token', data.accessToken, 1)
            setCookie('refresh_token', data.refreshToken, 7)

            // 로그인 성공 후 메인 페이지로 이동
            console.log("로그인 성공")
            // 받은 토큰 파싱
            const payload = parseJwt(data.accessToken)

            if (payload?.uid && payload?.userId && payload?.uname && payload?.role) {
                // shopId가 있는 경우에만 setUser 호출
                if (payload.role === "SELLER" && payload.shopId) {
                    setUser({ shopId: payload.shopId, uid: payload.uid, userId: payload.userId, uname: payload.uname, role: payload.role })
                } else if (payload.role === "ADMIN") {
                    setUser({ uid: payload.uid, userId: payload.userId, uname: payload.uname, role: payload.role })
                } else if (payload.role === "BUYER") {
                    setUser({ uid: payload.uid, userId: payload.userId, uname: payload.uname, role: payload.role })
                } else {
                    // 역할이 정의되지 않았거나 shopId가 없는 경우 처리
                    setErrorMessage('판매자 정보가 올바르지 않습니다.') // 예외 메시지
                    return
                }
            } // end if
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
                kakaoLink={kakaoLink}
            />
        </div>
    )
}



export default SigninPage;