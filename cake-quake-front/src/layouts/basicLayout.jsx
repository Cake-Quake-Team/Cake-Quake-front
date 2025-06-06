// layouts/BasicLayout.jsx

import Footer from "../components/common/Footer";
import { Outlet } from "react-router";
import BuyerHeader from "../components/common/buyerHeader.jsx";

function BasicLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <BuyerHeader />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default BasicLayout;