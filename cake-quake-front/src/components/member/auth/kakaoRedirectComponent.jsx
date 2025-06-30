import { Loader2 } from "lucide-react";

const KakaoRedirectComponent = ({
    authCode,
}) => {

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-yellow-50 text-gray-800">
            <div className="bg-white shadow-xl rounded-2xl px-8 py-10 flex flex-col items-center space-y-4 w-80 animate-fadeIn">
                <h2 className="text-xl font-semibold">카카오 계정 확인 중...</h2>
                <p className="text-sm text-gray-500 text-center">
                    로그인 처리 중입니다. 잠시만 기다려 주세요.
                </p>
                <Loader2 className="animate-spin w-6 h-6 text-yellow-500" />
            </div>
        </div>
    );

}

export default KakaoRedirectComponent;