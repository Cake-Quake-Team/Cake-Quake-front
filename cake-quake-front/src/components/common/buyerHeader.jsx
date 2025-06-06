import { Link } from "react-router";
import {useState} from "react";
import {Search, ShoppingCart} from "lucide-react";

function BuyerHeader() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 처리 함수
    const handleLogin = () => {
        console.log("로그인 시도....");
        setIsLoggedIn(true);
    };

    // 로그아웃 처리 함수
    const handleLogout = () => {
        console.log("로그아웃 시도");
        setIsLoggedIn(false);
    };

    return (
        <header className="w-full border-b shadow-sm bg-white">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Cake Quake Logo" className="w-10 h-10" />
                    <h1 className="text-2xl font-bold">Cake Quake</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <Search className="w-5 h-5 cursor-pointer" />
                    <ShoppingCart className="w-5 h-5 cursor-pointer" />
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        >
                            로그아웃
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleLogin}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            >
                                로그인
                            </button>
                            <button className="text-sm border px-3 py-1 rounded-md hover:bg-gray-100">
                                회원가입
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}


export default BuyerHeader;
