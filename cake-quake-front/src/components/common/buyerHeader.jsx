import { Link } from "react-router";
import {useState} from "react";

function BuyerHeader() {

    const [isLoggedIn, setIsLoggedIn] =useState(false)

    //로그인 처리 함수
    const handleLogin=()=>{
        //API 호출 등 로그인 인증 처리 필요
        console.log("로그인 시도....");
        setIsLoggedIn(true);
    };

    //로그아웃 처리 함수
    const handleLogout=()=> {
        //토큰 삭제, 세션 무효화 등 처리 필요
        console.log("로그아웃 시도");
        setIsLoggedIn(false);

    }


    return (
        <header className="bg-amber-200 p-4 shadow">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl font-bold">
                    <Link to="/">🎂 Cake Quake</Link>
                </div>

                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        // 로그인 상태일 때 로그아웃 버튼 표시
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        >
                            로그아웃
                        </button>
                    ) : (
                        // 로그아웃 상태일 때 로그인 버튼 표시
                        <button
                            onClick={handleLogin}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            로그인
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default BuyerHeader;
