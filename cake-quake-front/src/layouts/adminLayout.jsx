import { Outlet, Link, useLocation, useNavigate } from "react-router"; // Changed from "react-router" to "react-router-dom" for Link and useLocation
import { useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "../store/AuthContext";

export default function AdminLayout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true); // 사이드바 상태

    const navigate = useNavigate()
    const {user, signOut} = useAuth()

    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)

    // 로그아웃
    const handleSignOut = async () => {
        await signOut() // 쿠키 제거
        navigate('/auth/signin')
    }

    // 현재 경로를 보고 체크 표시를 줄 함수 (예: /admin/shops 일 때 체크 표시)
    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-gray-100"> {/* Added bg-gray-100 to the overall container */}
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
                {/* 좌측: 햄버거 메뉴 및 검색 */}
                <div className="flex items-center space-x-5">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 text-2xl hover:text-gray-300 transition-colors duration-200">
                        ☰
                    </button>
                    <Link to="/admin?page=1$size=10">
                        <h1 className="text-2xl font-bold">Cake Quake</h1>
                    </Link>
                </div>

                {/* 로그아웃 버튼 */}
                {user && (
                    <div className="text-sm font-semibold bg-gray-200 text-gray-700 px-3 py-1 rounded-full flex justify-end mt-4 mb-2 hover:bg-gray-400">
                        <button
                            onClick={() => {
                                setSidebarOpen(false)
                                handleSignOut()
                            }}
                            
                            >
                            로그아웃({user.userId})
                        </button>
                    </div>
                )}
            </header>

            {/* 본문: 사이드바 + 메인 컨텐츠 */}
            <div className="flex flex-grow">
                {/* 사이드바 */}
                <aside
                    className={`bg-white text-gray-800 border-r border-gray-200 p-6 transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 ${
                        sidebarOpen ? "w-64" : "w-0"
                    }`}
                >
                    {sidebarOpen && (
                        <nav className="flex flex-col space-y-1" style={{ width: '16rem' }}>
                            <div className="text-sm font-semibold text-gray-500 mb-2">매장 승인/거부</div>
                            <Link
                                to={`/admin/sellers/pending?page=${page}&size=${size}`}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive("/admin/sellers/pending") ? "bg-blue-50 text-blue-700 font-medium" : ""
                                }`}
                            >
                                <span>승인 관리</span>
                                {isActive("/admin/sellers/pending")}
                            </Link>

                            <div className="text-sm font-semibold text-gray-500 mt-4 mb-2">리뷰 관리</div>
                            <Link
                                to="/admin/review-deletion-requests"
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive("/admin/reviews") ? "bg-blue-50 text-blue-700 font-medium" : ""
                                }`}
                            >
                                <span>리뷰 삭제 요청</span>
                                {isActive("/admin/review-deletion-requests")}
                            </Link>

                            <div className="text-sm font-semibold text-gray-500 mt-4 mb-2">발주 관리</div>
                            <Link
                                to="/admin/procurements" // Assuming a list page for "회원 목록/등급"
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive("/admin/procurements") ? "bg-blue-50 text-blue-700 font-medium" : ""
                                }`}
                            >
                                <span>발주 관리</span>
                                {isActive("/admin/procurements")}
                            </Link>
                            <Link
                                to="/admin/ingredients" // Assuming points management related to users
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive("/admin/ingredients") ? "bg-blue-50 text-blue-700 font-medium" : ""
                                }`}
                            >
                                <span>발주 아이템</span> {/* Adjusted text based on typical admin panel structure */}
                                {isActive("/admin/ingredients")}
                            </Link>

                            {/* 문의 관리 */}
                            <div className="text-sm font-semibold text-gray-500 mb-2">문의 관리</div>
                            <Link
                                to="/admin/qna"
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive('/admin/qna/list') ? 'bg-blue-50 text-blue-700 font-medium' : ''
                                }`}
                            >
                                <span>문의 목록</span>
                            </Link>

                            {/* 로그아웃 버튼 */}
                            {user && (
                                <div className="text-sm font-semibold text-gray-500 mt-4 mb-2 hover:bg-gray-100">
                                    <button
                                        onClick={() => {
                                            setSidebarOpen(false)
                                            handleSignOut()
                                        }}
                                        
                                        >
                                        로그아웃({user.userId})
                                    </button>
                                </div>
                            )}
                        </nav>
                    )}
                </aside>

                {/* 메인 컨텐츠 */}
                <main className="flex-grow bg-white p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
            {/* Footer removed as it's not present in the image */}
        </div>
    );
}