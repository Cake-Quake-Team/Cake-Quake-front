import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router";

function BasicLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default BasicLayout;
