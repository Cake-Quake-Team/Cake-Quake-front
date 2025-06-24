import React, { useEffect, useState, Suspense } from 'react';
import {useNavigate} from "react-router";
import ShopImageGallery from "./read/ShopImageGallery.jsx";
import ShopNoticeSection from "./read/ShopNoticeSection.jsx";
import ShopDetailSection from "./read/ShopDetailSection.jsx";
import {useAuth} from "../../store/AuthContext.jsx";

const Loading = () => (
    <div className="text-center p-8 bg-blue-100 text-blue-700 rounded-lg shadow-md">
        <p className="text-xl font-semibold">내 매장 정보를 불러오는 중...</p>
    </div>
);

const SellerShopDetail = ({ className }) => { // className prop을 받아서 유연하게 스타일 적용
    const [shopDetail, setShopDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    console.log("user 상태 확인", user);

    useEffect(() => {
        const fetchMyShopData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (user?.shop) {
                    setShopDetail({
                        ...user.shop,
                        images: [],
                        noticePreview: null
                    });
                } else {
                    setError("등록된 매장 정보가 없습니다.");
                }
            } catch (err) {
                console.error("매장 정보 불러오기 실패:", err);
                setError("매장 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyShopData();
    }, []);

    const handleViewAllNotices = () => {
        if (shopDetail && shopDetail.shopId) {
            navigate(`/shops/${shopDetail.shopId}/notices`);
        }
    };

    const handleEditShop = () => {
        if (shopDetail && shopDetail.shopId) {
            navigate(`/shops/update/${shopDetail.shopId}`);
        }
    };

    // 로딩, 에러, 데이터 없음 상태는 컴포넌트 내에서 처리
    if (loading) {
        return (
            <div className={`w-full mx-auto px-4 py-8 md:px-0 ${className || ''}`}>
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`w-full mx-auto px-4 py-8 md:px-0 ${className || ''}`}>
                <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg shadow-md">
                    <p className="text-xl font-semibold mb-4">오류 발생!</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const shopImages = shopDetail.images || [];
    const noticePreviewData = shopDetail.noticePreview || null;

    return (
        <div className={`w-full mx-auto px-4 py-8 md:px-0 ${className || ''}`}>
            {/* 매장 상세 정보 헤더 (수정 버튼 포함) */}
            <ShopDetailSection shop={shopDetail} isSeller={true} onEdit={handleEditShop} /> {/* ShopDetailSection 내부의 수정 아이콘은 유지 */}

            <div className="text-center mt-6 mb-8">
                <button
                    onClick={handleEditShop}
                    className="px-8 py-4 bg-purple-600 text-white text-xl font-bold rounded-lg shadow-md
                               hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
                >
                    매장 정보 수정하기
                </button>
            </div>


            {shopImages.length > 0 && (
                <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">매장 갤러리</h2>
                    <ShopImageGallery images={shopImages} />
                </div>
            )}

            <ShopNoticeSection
                noticePreview={noticePreviewData}
                onViewAllNotices={handleViewAllNotices}
                isSeller={true}
                shopId={shopDetail.shopId}
            />
        </div>
    );
};

export default SellerShopDetail;