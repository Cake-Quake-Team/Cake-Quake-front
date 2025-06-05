// layouts/BasicLayout.jsx

import Footer from "../components/common/Footer";
import { Outlet } from "react-router";
import BuyerHeader from "../components/common/buyerHeader.jsx";

function BasicLayout() {
    return (
        <div className="min-h-screen flex flex-col"> {/* <-- 이 구조가 Tailwind 적용을 전제로 함 */}
            <BuyerHeader />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer /> {/* <-- 여기에 푸터가 위치 */}
        </div>
    );
}

export default BasicLayout;