import React from "react";
//import { useNavigate } from "react-router";

const AddToCartSuccessModal = ({ message, onClose, navigate }) => { // navigate prop 추가
    //const navigate = useNavigate(); // <-- 이 줄 제거

    const handleGoToCart = () => {
        onClose(); // 모달 먼저 닫고
        navigate("/buyer/cart"); // 장바구니 페이지로 이동
    };

    const handleContinueShopping = () => {
        onClose(); // 모달 닫기만 함
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center min-w-[300px]">
                <p className="text-lg font-semibold mb-6">{message}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                        onClick={handleGoToCart}
                        className="bg-gray-900 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 w-full sm:w-auto"
                    >
                        장바구니 확인하기
                    </button>
                    <button
                        onClick={handleContinueShopping}
                        className="bg-gray-300 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200 w-full sm:w-auto"
                    >
                        쇼핑 계속하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddToCartSuccessModal;