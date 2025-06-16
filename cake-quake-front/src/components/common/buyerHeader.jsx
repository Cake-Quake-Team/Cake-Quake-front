import { Link, useNavigate } from "react-router";
import {Search, ShoppingCart, Menu, X} from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import { useState } from "react";

function BuyerHeader() {
    const {user, signOut} = useAuth()
    const navigate = useNavigate()

    const [sidebarOpen, setSidebarOpen] = useState(false)

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
                            {/* 로그인 버튼은 항상 보임 */}
                            <Link
                                to="/auth/signin"
                                className="w-[90px] text-sm text-center bg-teal-400 text-white px-3 py-2 rounded-lg hover:bg-teal-500 transition font-bold"
                            >
                                로그인
                            </Link>

                            {/* 데스크탑에서는 회원가입 바로 보임 */}
                            <Link
                                to="/auth/signup"
                                className="w-[90px] text-sm text-center bg-rose-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-rose-200 transition font-bold hidden md:inline"
                            >
                                회원 가입
                            </Link>

                            {/* 모바일 토글 버튼 */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="block md:hidden ml-2"
                                aria-label="Open signup sidebar"
                            >
                                <Menu className="w-6 h-6 text-gray-700" />
                            </button>
                        </>
                    )}
                </div>
            </div>
            {/* 사이드바 오버레이 (모바일 전용) */}
            {/* 배경 반투명 */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity ${
                    sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                style={{ backgroundColor: 'rgba(169, 169, 169, 0.7)' }}
                onClick={() => setSidebarOpen(false)}
            />

            {/* 사이드바 패널 */}
            <aside
                className={`fixed top-0 right-0 h-full w-60 bg-white shadow-lg z-50 transform transition-transform ${
                    sidebarOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h2 className="text-lg font-bold">메뉴</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <X className="w-6 h-6 text-gray-700" />
                    </button>
                </div>

                <nav className="flex flex-col p-4 space-y-4">
                    <Link
                        to="/auth/signup"
                        onClick={() => setSidebarOpen(false)}
                        className="block text-center bg-rose-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-rose-200 font-bold"
                    >
                        회원 가입
                    </Link>
                    {/* 여기 필요하면 다른 메뉴 항목 추가 가능 */}
                </nav>
            </aside>
        </header>
    );
}


export default BuyerHeader;
