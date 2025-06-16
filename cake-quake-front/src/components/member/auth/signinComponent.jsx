import kakaoIcon from "../../../assets/kakao-loginicon.png";
import { Link } from "react-router";


const SigninComponent = ({
  userId,
  password,
  errorMessage,
  onUserIdChange,
  onPasswordChange,
  handleSubmit,
}) => {

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Please sign in</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700"></label>
                        <input
                            id="userId"
                            type="text"
                            value={userId}
                            onChange={onUserIdChange}
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
                            onChange={onPasswordChange}
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
                        회원 가입
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
    )
}

export default SigninComponent;