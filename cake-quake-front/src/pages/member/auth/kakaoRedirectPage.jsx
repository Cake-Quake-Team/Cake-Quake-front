import { data, useNavigate, useSearchParams } from "react-router";
import KakaoRedirectComponent from "../../../components/member/auth/kakaoRedirectComponent";
import { useEffect } from "react";
import { getKakaoAccessToken, getMemberWithAccessToken, getSigninUserInfo } from "../../../api/authApi";
import { useAuth } from "../../../store/AuthContext";
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
            // console.log("KakaoAccessToken:", kakaoAccessToken)

            // 로그인이 필요한 경우 토큰이 포함된 응답, 회원가입이 필요한 경우 카카오 유저의 정보가 포함된 응답이 옴.
            const loginResult = await getMemberWithAccessToken(kakaoAccessToken)
            // const { exists, ...rest } = loginResult.data
            const { exists, email, nickname } = loginResult.data
            // console.log("loginResult.data:", loginResult.data)
            // console.log("email:", email)

            // exists가 true면 이미 가입된 유저.
            if (exists) {
                // 이미 가입된 유저라면 서버가 HTTPOnly 쿠키로 토큰 내려줌

                // 토큰을 파싱한 사용자 정보를 받아와서 저장
                const userInfo = await getSigninUserInfo()
                setUser(userInfo)
                
                // 구매자 홈페이지로 이동
                navigate("/buyer")
            } else {
                // 신규 회원
                setKakaoInfo({ email, nickname }) // 이메일과 닉네임 상태 저장
                console.log("email, nickname 저장")
                navigate("/auth/signup/kakao")
            }
        } catch (error) {
            console.error("카카오 로그인 실패:", error)
            // setErrorMessage("카카오 로그인 중 오류가 발생했습니다.")
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