// src/pages/buyer/LikedShopsPage.jsx
import React, { useState, useEffect } from 'react';
import { getLikedShops } from '../../../api/likeApi'; // 찜한 매장 API
import { useAuth } from '../../../store/AuthContext'; // 사용자 인증 정보 훅
import { useNavigate } from 'react-router'; // 페이지 이동 훅

const LikedShopsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [likedShops, setLikedShops] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikedShops = async () => {
            if (!user || !user.userId) {
                alert("로그인이 필요합니다.");
                navigate('/login');
                return;
            }
            setIsLoading(true);
            try {
                const response = await getLikedShops(); // 찜한 매장 목록 조회 API 호출
                setLikedShops(response.likedShops); // 응답에서 찜한 매장 목록 설정
            } catch (err) {
                console.error("찜한 매장 목록 불러오기 실패:", err);
                setError("찜한 매장 목록을 불러오는 데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchLikedShops();
    }, [user, navigate]);

    // ⭐ 매장 보기 버튼 클릭 핸들러 ⭐
    const handleViewShopDetails = (shopId) => {
        if (shopId) {
            navigate(`/buyer/shops/${shopId}`); // 매장 상세 페이지로 이동
        } else {
            alert("매장 정보를 불러올 수 없습니다. 다시 시도해주세요.");
            console.error("Missing shopId for navigation:", shopId);
        }
    };

    if (isLoading) return <div className="text-center p-4">찜한 매장 목록을 불러오는 중...</div>;
    if (error) return <div className="text-center p-4 text-red-600">오류: {error}</div>;
    if (!likedShops || likedShops.length === 0) return <div className="text-center p-4 text-gray-500">찜한 매장이 없습니다.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">찜한 매장</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {likedShops.map(shop => (
                    <div key={shop.shopId} className="border rounded-lg p-4 shadow-sm">
                        <img src={shop.thumbnailUrl} alt={shop.shopName} className="w-full h-48 object-cover mb-2 rounded" />
                        <h2 className="text-lg font-semibold">{shop.shopName}</h2>
                        <p className="text-gray-700">{shop.shopAddress}</p>
                        <p className="text-gray-600">영업 시간: {shop.openTime} ~ {shop.closeTime}</p>
                        {/* ⭐ 매장 보기 버튼에 onClick 핸들러 적용 ⭐ */}
                        <button
                            onClick={() => handleViewShopDetails(shop.shopId)}
                            className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                        >
                            매장 보기
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LikedShopsPage;