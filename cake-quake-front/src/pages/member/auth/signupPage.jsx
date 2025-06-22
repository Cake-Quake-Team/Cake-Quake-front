import { useEffect } from "react";
import SignupComponent from "../../../components/member/auth/signupComponent";

// 일반 가입 / 판매자 가입 이동 버튼이 있는 페이지
const SignupPage = () => {

    // 스크롤 제일 위로 이동
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="p-4">
            <SignupComponent />
        </div>
    );
}

export default SignupPage;