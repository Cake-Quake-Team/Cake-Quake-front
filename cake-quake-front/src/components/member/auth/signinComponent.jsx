import kakaoIcon from "../../../assets/kakao-loginicon.png";
import { Link } from "react-router";


const SigninComponent = ({
    userId,
    password,
    errorMessage,
    onUserIdChange,
    onPasswordChange,
    handleSubmit,
    kakaoLink,
}) => {

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-heading font-bold text-primary-color text-center">
                    Cake Quake
                </h2>
                <p className="text-xs text-gray-500 text-center">
                    당신만의 특별한 순간을 함께합니다
                </p>


                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 아이디 */}
                    <div>
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-600 mb-1 mt-6">
                            ID
                        </label>
                        <input
                            id="userId"
                            type="text"
                            value={userId}
                            onChange={onUserIdChange}
                            placeholder="아이디를 입력하세요"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-color transition"
                            required
                        />
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={onPasswordChange}
                            placeholder="비밀번호를 입력하세요"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-color transition"
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="remember" className="mr-2" />
                        <label htmlFor="remember" className="text-sm text-gray-600">
                            자동 로그인
                        </label>
                    </div>
                    {errorMessage && (
                        <div style={{ color: 'red', marginTop: '8px' }}>{errorMessage}</div>
                    )}
                    <div className="space-y-3 pt-2">
                        <button
                            type="submit"
                            className="w-full bg-teal-400 text-white py-3 rounded-lg hover:bg-teal-500 transition font-semibold text-base"
                        >
                            로그인
                        </button>
                        <Link
                            to="/auth/signup"
                            className="w-full block text-center bg-rose-100 text-gray-700 py-3 rounded-lg hover:bg-rose-200 transition font-semibold text-base"
                        >
                            회원가입
                        </Link>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Login with OAuth 2.0
                    </div>

                    <Link to={kakaoLink} className="w-full flex items-center justify-center">
                        <img src={kakaoIcon} alt="Kakao" className="mt-3 transition py-2 rounded-lg  gap-2" />
                    </Link >
                </form>
            </div>
        </div>
    )
}

export default SigninComponent;