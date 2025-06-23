import { Outlet, Link, useLocation } from "react-router"; // Changed from "react-router" to "react-router-dom" for Link and useLocation
import { useState } from "react";
import { Search } from "lucide-react";

export default function AdminLayout() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true); // 사이드바 상태

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
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Search"
                            className="border border-gray-300 rounded-full px-4 py-1 pl-8 w-64 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 ">
                        <Search className="w-5 h-5 cursor-pointer" />
                    </span>
                    </div>
                </div>

                {/* 우측: 필터 버튼들 */}
                <div className="flex items-center space-x-2">
                    <button className="bg-black text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1 shadow-sm hover:bg-gray-300 transition-colors duration-200">
                        <span>✔</span>
                        <span>New</span>
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm shadow-sm hover:bg-gray-300 transition-colors duration-200">
                        보류
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm shadow-sm hover:bg-gray-300 transition-colors duration-200">
                        거절
                    </button>
                </div>
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
                                to="/admin/shops"
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive("/admin/shops") ? "bg-blue-50 text-blue-700 font-medium" : ""
                                }`}
                            >
                                <span>문서 관리</span>
                                {isActive("/admin/shops")}
                            </Link>
                            <Link
                                to="/admin/shops/description" // Assuming a description page
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive("/admin/shops/description") ? "bg-blue-50 text-blue-700 font-medium" : ""
                                }`}
                            >
                                <span>Description</span>
                                {isActive("/admin/shops/description")}
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


                            <div className="text-sm font-semibold text-gray-500 mt-4 mb-2">회원 관리</div>
                            <Link
                                to="/admin/users/list" // Assuming a list page for "회원 목록/등급"
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive("/admin/users/list") ? "bg-blue-50 text-blue-700 font-medium" : ""
                                }`}
                            >
                                <span>회원 목록/등급</span>
                                {isActive("/admin/users/list")}
                            </Link>
                            <Link
                                to="/admin/users/points" // Assuming points management related to users
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive("/admin/users/points") ? "bg-blue-50 text-blue-700 font-medium" : ""
                                }`}
                            >
                                <span>회원 리스트</span> {/* Adjusted text based on typical admin panel structure */}
                                {isActive("/admin/users/points")}
                            </Link>

                            <div className="text-sm font-semibold text-gray-500 mt-4 mb-2">쿠폰 관리</div>
                            <Link
                                to="/admin/coupons/register" // Assuming a coupon registration page
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive("/admin/coupons/register") ? "bg-blue-50 text-blue-700 font-medium" : ""
                                }`}
                            >
                                <span>쿠폰 등록</span>
                                {isActive("/admin/coupons/register")}
                            </Link>
                            <Link
                                to="/admin/coupons/modify" // Assuming a coupon modification page
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive("/admin/coupons/modify") ? "bg-blue-50 text-blue-700 font-medium" : ""
                                }`}
                            >
                                <span>쿠폰 수정</span>
                                {isActive("/admin/coupons/modify")}
                            </Link>

                            <div className="text-sm font-semibold text-gray-500 mt-4 mb-2">이벤트 관리</div>
                            <Link
                                to="/admin/events/register" // Assuming event registration
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive("/admin/events/register") ? "bg-blue-50 text-blue-700 font-medium" : ""
                                }`}
                            >
                                <span>이벤트 등록</span>
                                {isActive("/admin/events/register")}
                            </Link>
                            <Link
                                to="/admin/events/modify" // Assuming event modification
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive("/admin/events/modify") ? "bg-blue-50 text-blue-700 font-medium" : ""
                                }`}
                            >
                                <span>이벤트 수정</span>
                                {isActive("/admin/events/modify")}
                            </Link>

                            <div className="text-sm font-semibold text-gray-500 mt-4 mb-2">포인트 관리</div>
                            <Link
                                to="/admin/points"
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100 ${
                                    isActive("/admin/points") ? "bg-blue-50 text-blue-700 font-medium" : ""
                                }`}
                            >
                                <span>포인트 관리</span>
                                {isActive("/admin/points")}
                            </Link>
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