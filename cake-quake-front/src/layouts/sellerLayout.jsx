// layouts/SellerLayout.jsx
import { Outlet } from "react-router";
import Footer from "../components/common/footer";
import SellerHeader from "../components/common/sellerHeader";
import BuyerHeader from "../components/common/buyerHeader.jsx";

function SellerLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <BuyerHeader/>
            <SellerHeader />
            <main className="flex-grow px-4 py-6 max-w-5xl mx-auto">
                <Outlet />
            </main>
            <Footer/>
        </div>
    );
}

export default SellerLayout;

