import {Link, useNavigate} from "react-router";
import {MessageCircle  , ShoppingCart, Menu, X, Bot} from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import {useEffect, useRef, useState} from "react";
import NotificationBell from "./notificationBell.jsx";
import ChatListModal from "../chatting/chatListModal.jsx";


function BuyerHeader() {
    const {user, signOut} = useAuth()
    const navigate = useNavigate()
    const headerRef = useRef(null);

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isChatListModalOpen, setIsChatListModalOpen] = useState(false); // 채팅 목록 모달 상태

    const chatIconRef = useRef(null);
    const [chatModalPosition, setChatModalPosition] = useState({});

    //채팅 아이콘 위치에 따라 모달 위치를 계산
    useEffect(() => {
        if (isChatListModalOpen && headerRef.current && chatIconRef.current) {
            const headerRect = headerRef.current.getBoundingClientRect();
            const iconRect = chatIconRef.current.getBoundingClientRect();

            const modalWidth = 320;
            const modalHeight = 500;

            const padding = 10;

            let calculatedTop = headerRect.bottom + padding;

            let calculatedRight = window.innerWidth - (iconRect.left + iconRect.width / 2) - (modalWidth / 2) + padding;

            calculatedRight = Math.max(calculatedRight, padding);

            if (window.innerWidth - calculatedRight - modalWidth < padding) {
                calculatedRight = window.innerWidth - modalWidth - padding;
            }

            calculatedTop = Math.max(calculatedTop, padding);

            if (calculatedTop + modalHeight > window.innerHeight - padding) {
                calculatedTop = window.innerHeight - modalHeight - padding;
            }
            calculatedTop = Math.max(calculatedTop, padding); // 다시 한번 최소 top 값 확인


            setChatModalPosition({
                top: `${calculatedTop}px`,
                right: `${calculatedRight}px`,
            });
        }
    }, [isChatListModalOpen]);

    // 로그아웃
    const handleSignOut = async () => {
        await signOut() // 쿠키 제거
        navigate('/auth/signin')
    }


    const handleOpenChatListModal = () => {
        setIsChatListModalOpen(true);
    };

    const handleCloseChatListModal = () => {
        setIsChatListModalOpen(false);
    };

    // ⭐ 추가된 채팅 관리 버튼 클릭 핸들러
    const handleChatManagement = () => {
        navigate(`/shops/${user.shopId}/chatting`);

    };

    return (
        <header ref={headerRef} className="w-full border-b border-gray-200 bg-white">
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

                    {/*buyer인 경우 채팅 모달*/}
                    {user?.role === "BUYER" && (
                        <>
                            <MessageCircle
                                ref={chatIconRef}
                                className="w-5 h-5 cursor-pointer text-gray-700 hover:text-blue-600"
                                onClick={handleOpenChatListModal}
                            />

                            {isChatListModalOpen && (
                                <ChatListModal
                                    isOpen={isChatListModalOpen}
                                    onClose={handleCloseChatListModal}
                                    positionStyles={chatModalPosition}
                                />
                            )}
                        </>
                    )}

                    {/*seller인 경우 채팅 목록 페이지 이동*/}
                    {user?.role ==="SELLER" && (
                        <MessageCircle
                            className="w-5 h-5 cursor-pointer text-gray-700 hover:text-blue-600"
                            onClick={handleChatManagement}
                        />

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
                            <Link to={user.role === 'BUYER' ? '/buyer/profile' : '/seller/profile'}>
                              <span className="text-sm font-semibold text-gray-700">
                                {user.uname}님
                              </span>
                            </Link>
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
