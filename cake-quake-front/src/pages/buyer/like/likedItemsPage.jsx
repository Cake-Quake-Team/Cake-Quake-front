// src/pages/buyer/LikedItemsPage.jsx
import React, { useState, useEffect } from 'react';
import { getLikedCakeItems } from '../../../api/likeApi'; // 찜한 케이크 상품 API
import { useAuth } from '../../../store/AuthContext'; // 사용자 인증 정보 훅
import { useNavigate } from 'react-router'; // 페이지 이동 훅

const LikedItemsPage = () => {
    const { user } = useAuth(); // 현재 로그인된 사용자 정보
    const navigate = useNavigate();
    const [likedItems, setLikedItems] = useState([]); // 찜한 상품 목록 상태
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        const fetchLikedItems = async () => {
            if (!user || !user.userId) {
                alert("로그인이 필요합니다.");
                navigate('/login'); // 로그인하지 않았다면 로그인 페이지로 리다이렉트
                return;
            }
            setIsLoading(true);
            try {
                const response = await getLikedCakeItems(); // 찜한 케이크 상품 목록 조회 API 호출
                setLikedItems(response.likedItems); // 응답에서 찜한 상품 목록 설정
            } catch (err) {
                console.error("찜한 상품 목록 불러오기 실패:", err);
                setError("찜한 상품 목록을 불러오는 데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchLikedItems();
    }, [user, navigate]); // user 또는 navigate 변경 시 다시 실행

    const handleViewDetails = (shopId, cakeItemId) => {
        if (shopId && cakeItemId) {
            navigate(`/buyer/shops/${shopId}/cakes/read/${cakeItemId}`);
        } else {
            alert("상품 정보를 불러올 수 없습니다. 다시 시도해주세요.");
            console.error("Missing shopId or cakeItemId for navigation:", shopId, cakeItemId);
        }
    };

    if (isLoading) return <div className="text-center p-4">찜한 상품 목록을 불러오는 중...</div>;
    if (error) return <div className="text-center p-4 text-red-600">오류: {error}</div>;
    if (!likedItems || likedItems.length === 0) return <div className="text-center p-4 text-gray-500">찜한 상품이 없습니다.</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">찜한 케이크 상품</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {likedItems.map(item => (
                    <div key={item.likeId} className="border rounded-lg p-4 shadow-sm">
                        <img src={item.thumbnailUrl} alt={item.cakeName} className="w-full h-48 object-cover mb-2 rounded" />
                        <h2 className="text-lg font-semibold">{item.cakeName}</h2>
                        <p className="text-gray-700">{item.price.toLocaleString()}원</p>
                        {/* 찜 취소 버튼을 다시 여기에 렌더링할 수도 있습니다. */}
                        {/* <LikeButton type="cake" itemId={item.cakeItemId} /> */}
                        {/* 또는 상품 상세 페이지로 이동하는 링크 */}
                        <button
                            onClick={() => handleViewDetails(item.shopId, item.cakeItemId)}
                            className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                        >
                            상세 보기
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LikedItemsPage;