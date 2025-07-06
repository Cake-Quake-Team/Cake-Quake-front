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
        <header className="w-full border-b border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    {/* 로고 이미지 */}
                    {user?.role === "BUYER" ? (
                        <Link to="/buyer">
                            <img src="/logo.png" alt="Cake Quake Logo" className="w-15 h-15" />
                        </Link>
                    ) : user?.role === "SELLER" ? (
                        <Link to={`shops/${user.shopId}`}>
                            <img src="/logo.png" alt="Cake Quake Logo" className="w-15 h-15" />
                        </Link>
                    ) : (
                        <img src="/logo.png" alt="Cake Quake Logo" className="w-15 h-15" />
                    )}

                    {/* 텍스트 */}
                    {user?.role === "BUYER" ? (
                        <Link to="/buyer">
                            <h1 className="text-2xl font-bold">Cake Quake</h1>
                        </Link>
                    ) : user?.role === "SELLER" ? (
                        <Link to={`shops/${user.shopId}`}>
                            <h1 className="text-2xl font-bold">Cake Quake</h1>
                        </Link>
                    ) : (
                        <h1 className="text-2xl font-bold">Cake Quake</h1>
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

                    {user?.role === "BUYER" && "SELLER" && (
                    <MessageCircle   className="w-5 h-5 cursor-pointer" />
                    )}

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
                                className=" text-sm text-center px-3 py-2 hover:underline transition"
                            >
                                로그인
                            </Link>

                            {/* 회원가입 - 데스크탑 */}
                            <Link
                                to="/auth/signup"
                                className="text-sm text-center hover:underline transition hidden md:inline"
                            >
                                회원가입
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
                            {user.role !== "ADMIN" && (
                                <>
                                    {/* 마이페이지 */}
                                    <Link
                                        to={user.role === "SELLER" ? "/seller/profile" : "/buyer/profile"}
                                        onClick={() => setSidebarOpen(false)}
                                        className="block text-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 font-bold"
                                    >
                                        마이페이지
                                    </Link>

                                    {/* 문의 페이지 */}
                                    <Link
                                        to={user.role === "SELLER" ? "/seller/qna" : "/buyer/qna"}
                                        onClick={() => setSidebarOpen(false)}
                                        className="block text-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 font-bold"
                                    >
                                        고객 센터
                                    </Link>
                                </>
                            )}
                            {user.role === "ADMIN" && (
                                <Link
                                    to="/admin"
                                    className="block text-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 font-bold"
                                >
                                    관리자 페이지
                                </Link>
                            )}

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
