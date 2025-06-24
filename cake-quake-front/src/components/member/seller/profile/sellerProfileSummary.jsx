import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {useAuth} from "../../../../store/AuthContext.jsx";


const SellerProfileSummary = () => {
        const navigate = useNavigate();
        const { user } = useAuth();


        const handleDetailProfile = () => {
            navigate('/seller/profile/details');
        };

        if (!user) {
            return (
                <div className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-100 min-h-[100px] justify-center text-gray-500">
                    <p>사용자 정보를 불러오는 중...</p>
                </div>
            );
        }

        // user 객체가 있으면 바로 정보를 표시합니다.
        return (
            <div className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900">{user.uname || '알 수 없는 판매자'}</h3>
                    <p className="text-sm text-gray-600">{user.role === 'SELLER' ? '판매자' : '일반 사용자'}</p>
                </div>

                <button
                    onClick={handleDetailProfile}
                    className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 ml-4 flex-shrink-0"
                >
                    <span className="text-xs font-semibold">정보 조회</span>
                </button>
            </div>
        );
    };

export default SellerProfileSummary;