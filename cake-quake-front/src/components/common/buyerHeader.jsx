import {Link, useNavigate} from "react-router";
import {MessageCircle  , ShoppingCart, Menu, X, Bot} from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import { useState } from "react";
import NotificationBell from "./notificationBell.jsx";

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
                    {user?.role === "BUYER" && (
                    <Link to="/buyer">
                    <img src="/logo.png" alt="Cake Quake Logo" className="w-10 h-10" />
                    </Link>
                    )}
                    {user?.role === "SELLER" && (
                        <Link to={`shops/${user.shopId}`}>
                            <img src="/logo.png" alt="Cake Quake Logo" className="w-10 h-10" />
                        </Link>
                    )}
                    {user?.role === "BUYER" && (
                        <Link to="/buyer">
                            <h1 className="text-2xl font-bold">Cake Quake</h1>
                        </Link>
                    )}
                    {user?.role === "SELLER" && (
                         <Link to={`shops/${user.shopId}`}>
                        <h1 className="text-2xl font-bold">Cake Quake</h1>
                        </Link>
                    )}


                </div>

                <div className="flex items-center space-x-4">

                    {/* GPT 아이콘 - BUYER만 보임 */}
                    {user?.role === "BUYER" && (
                        <Link to="/buyer/ai" title="CQ봇">
                            <Bot className="w-5 h-5 text-pink-500 hover:text-pink-600 cursor-pointer" />
                        </Link>
                    )}

                    {/* 🔔 알림 종 아이콘 추가 */}
                    <NotificationBell />


                    <MessageCircle   className="w-5 h-5 cursor-pointer" />

                    {/* 장바구니 - BUYER만 보임*/}
                    {user?.role === "BUYER" && (
                    <ShoppingCart
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => navigate('/buyer/cart')}
                    />
                    )}


                    {user ? (
                        <>
                            <span className="text-sm font-semibold text-gray-700">
                                {user.uname}님
                            </span>
                            {/* 토글 버튼 (로그인 상태에도 보이게) */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="block  ml-2"
                                aria-label="Open menu sidebar"
                            >
                                <Menu className="w-6 h-6 text-gray-700" />
                            </button>
                        </>
                    ) : (
                        <>
                            {/* 로그인 버튼 */}
                            <Link
                                to="/auth/signin"
                                className="w-[90px] text-sm text-center bg-teal-400 text-white px-3 py-2 rounded-lg hover:bg-teal-500 transition font-bold"
                            >
                                로그인
                            </Link>

                            {/* 회원가입 - 데스크탑 */}
                            <Link
                                to="/auth/signup"
                                className="w-[90px] text-sm text-center bg-rose-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-rose-200 transition font-bold hidden md:inline"
                            >
                                회원 가입
                            </Link>

                            {/* 모바일 메뉴 토글 */}
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
                    {user ? (
                        <>
                            <Link
                                to={user.role === "SELLER" ? "/seller/profile" : "/buyer/profile"}
                                onClick={() => setSidebarOpen(false)}
                                className="block text-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 font-bold"
                            >
                                마이페이지
                            </Link>
                            <button
                                onClick={() => {
                                    setSidebarOpen(false);
                                    handleSignOut();
                                }}
                                className="block text-center bg-blue-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-blue-200 font-bold"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/auth/signup"
                            onClick={() => setSidebarOpen(false)}
                            className="block text-center bg-rose-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-rose-200 font-bold"
                        >
                            회원 가입
                        </Link>
                    )}
                </nav>
            </aside>
        </header>
    );
}


export default BuyerHeader;
