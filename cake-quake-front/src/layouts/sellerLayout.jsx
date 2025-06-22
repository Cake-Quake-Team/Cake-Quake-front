
import {Outlet} from "react-router";
import Footer from "../components/common/footer.jsx";
import SellerHeader from "../components/common/sellerHeader.jsx";

function SellerLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <SellerHeader />
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
}

export default SellerLayout;