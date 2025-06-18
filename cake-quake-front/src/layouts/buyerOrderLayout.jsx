import { Outlet } from "react-router";
import BuyerHeader from "../components/common/BuyerHeader";
import Footer from "../components/common/Footer";

const BuyerOrderLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <BuyerHeader />
            <main className="flex-grow px-4 py-6 max-w-4xl mx-auto">
                <Outlet /> {/* 여기에 주문 관련 페이지들이 렌더링됨 */}
            </main>
            <Footer />
        </div>
    );
};

export default BuyerOrderLayout;
