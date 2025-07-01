import { useEffect } from "react";
import SignupKakaoUserComponent from "../../../components/member/auth/signupKakaoUserComponent";
import useKakaoSignupStore from "../../../store/useKakaoSignupStore";

const SignupKakaoUserPage = () => {

    // 스크롤 제일 위로 이동
        useEffect(() => {
            window.scrollTo(0, 0)
        }, [])

    // 스토어에 저장된 정보 가져오기
    const { kakaoInfo, reset } = useKakaoSignupStore()
    // console.log(kakaoInfo.email, kakaoInfo.nickname)

    return (
        <div>
            <SignupKakaoUserComponent
                 />
        </div>
     );

}

export default SignupKakaoUserPage;