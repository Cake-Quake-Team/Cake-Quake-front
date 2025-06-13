import { Link, useNavigate } from "react-router";
import {Search, ShoppingCart} from "lucide-react";
import { useAuth } from "../../store/AuthContext";

function BuyerHeader() {
    const {user, signOut} = useAuth()
    const navigate = useNavigate()

    // 로그아웃
    const handleSignOut = async () => {
        await signOut() // 쿠키 제거
        navigate('/auth/signin')
    }

    return (
        <header className="w-full border-b shadow-sm bg-white">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Cake Quake Logo" className="w-10 h-10" />
                    <h1 className="text-2xl font-bold">Cake Quake</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <Search className="w-5 h-5 cursor-pointer" />
                    <ShoppingCart className="w-5 h-5 cursor-pointer" />
                    {user ? (
                        <>
                            <span className="text-sm font-semibold text-gray-700">
                                {user.uname}님
                            </span>
                            <button
                                onClick={handleSignOut}
                                className="w-[90px] text-sm bg-blue-100 hover:bg-blue-300 font-bold py-2 px-3 rounded-lg text-center"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/auth/signin"
                                className="w-[90px] text-sm text-center bg-teal-400 text-white px-3 py-2 rounded-lg hover:bg-teal-500 transition font-bold"
                            >
                                로그인
                            </Link>
                            <Link
                                to="/auth/signup"
                                className="w-[90px] text-sm text-center bg-rose-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-rose-200 transition font-bold"
                            >
                                회원 가입
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}


export default BuyerHeader;
