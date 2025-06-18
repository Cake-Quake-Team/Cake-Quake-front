// layouts/SellerLayout.jsx
import { Outlet } from "react-router";
import Footer from "../components/common/footer";
import SellerHeader from "../components/common/sellerHeader";

function SellerLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <SellerHeader />
            <main className="flex-grow px-4 py-6 max-w-5xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default SellerLayout;
