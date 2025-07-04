import React from 'react';
import { useParams, useNavigate } from 'react-router';
import LikedItemsPage from './LikedItemsPage';
import LikedShopsPage from './LikedShopsPage'; 

const LikedMainPage = () => {
    // URL 파라미터에서 'type'을 가져옵니다. (cake 또는 shop)
    // type이 없으면 기본값으로 'cake'을 사용합니다.
    const { type } = useParams();
    const navigate = useNavigate();

    const currentView = type === 'shop' ? 'shop' : 'cake'; // 'shop' 아니면 'cake' (기본값)

    const handleTabClick = (viewType) => {
        // 탭 클릭 시 URL을 업데이트하여 뷰를 전환합니다.
        navigate(`/buyer/profile/likes/${viewType}`);
    };

    return (
        <div className="container mx-auto p-4 sm:px-6 lg:px-8 max-w-4xl min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">나의 찜 목록</h1>

            {/* 탭 UI */}
            <div className="flex justify-center mb-6 border-b border-gray-200">
                <button
                    onClick={() => handleTabClick('cake')}
                    className={`py-3 px-6 text-lg font-semibold transition-colors duration-200
                                ${currentView === 'cake' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                    상품 찜
                </button>
                <button
                    onClick={() => handleTabClick('shop')}
                    className={`py-3 px-6 text-lg font-semibold transition-colors duration-200
                                ${currentView === 'shop' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                    매장 찜
                </button>
            </div>

            {/* 조건부 렌더링 */}
            {currentView === 'cake' ? (
                <LikedItemsPage /> // 상품 찜 목록 컴포넌트 렌더링
            ) : (
                <LikedShopsPage /> // 매장 찜 목록 컴포넌트 렌더링
            )}
        </div>
    );
};

export default LikedMainPage;