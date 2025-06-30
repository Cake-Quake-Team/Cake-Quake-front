import { useNavigate, useSearchParams } from "react-router";
import KakaoRedirectComponent from "../../../components/member/auth/kakaoRedirectComponent";
import { useEffect } from "react";
import { getKakaoAccessToken, getMemberWithAccessToken } from "../../../api/authApi";
import { useAuth } from "../../../store/AuthContext";
import { setCookie } from "../../../utils/cookieUtil";
import useKakaoSignupStore from "../../../store/useKakaoSignupStore";

const KakaoRedirectPage = () => {

    const [searchParams] = useSearchParams()

    const authCode = searchParams.get('code')

    const { setUser } = useAuth()
    const{ setKakaoInfo } = useKakaoSignupStore()

    const navigate = useNavigate()

    useEffect(() => {
        if (authCode) {
            handleKakaoLogin(authCode)
        }
    }, [authCode])

    // code 받아온 게 없으면
    if(!authCode) {
        return (<div>로그인 실패</div>)
    }

    const handleKakaoLogin = async (authCode) => {
        try {
            const kakaoAccessToken = await getKakaoAccessToken(authCode)
            console.log("KakaoAccessToken:", kakaoAccessToken)

            // 로그인이 필요한 경우 토큰이 포함된 응답, 회원가입이 필요한 경우 카카오 유저의 정보가 포함된 응답이 옴.
            const loginResult = await getMemberWithAccessToken(kakaoAccessToken)
            const { exists, ...rest } = loginResult.data

            // exists가 true면 이미 가입된 유저.
            if (exists) {
                // 쿠키에 토큰 저장.
                setCookie('access_token', rest.accessToken, 1)
                setCookie('refresh_token', rest.refreshToken, 7)

                // 토큰 파싱해서 컨텍스트에 정보 저장.
                const payload = parseJwt(rest.accessToken)

                if (payload?.userId && payload?.uname && payload?.role) {
                    setUser({ userId: payload.userId, uname: payload.uname, role: payload.role })
                }
                
                // 구매자 홈페이지로 이동
                navigate("/buyer")
            } else {
                setKakaoInfo(rest.data)
                console.log("email, nickname 저장")
                navigate("/auth/signup/kakao")
            }
        } catch (error) {
            console.error("카카오 로그인 실패:", error)
            setErrorMessage("카카오 로그인 중 오류가 발생했습니다.")
        }
    }


    return (
        <div>
            <KakaoRedirectComponent
                authCode={authCode} />
        </div>
     );

}

export default KakaoRedirectPage;