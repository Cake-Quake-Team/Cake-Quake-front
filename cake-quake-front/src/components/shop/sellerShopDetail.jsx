import React, { useEffect, useState, Suspense } from 'react';
import {useNavigate} from "react-router";
import ShopImageGallery from "./read/ShopImageGallery.jsx";
import ShopNoticeSection from "./read/ShopNoticeSection.jsx";
import ShopDetailSection from "./read/ShopDetailSection.jsx";
import {useAuth} from "../../store/AuthContext.jsx";
import {getShopDetail} from "../../api/shopApi.jsx";

const Loading = () => (
    <div className="text-center p-8 bg-blue-100 text-blue-700 rounded-lg shadow-md">
        <p className="text-xl font-semibold">내 매장 정보를 불러오는 중...</p>
    </div>
);

const SellerShopDetail = ({ className }) => {
    const [shopDetail, setShopDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    console.log("user 상태 확인", user);

    useEffect(() => {
        const fetchMyShopData = async () => {
            setLoading(true);
            setError(null);

            // user 객체에 shopId가 있는지 확인
            if (!user || !user.shopId) {
                setError("등록된 매장 정보가 없습니다. (shopId를 찾을 수 없음)");
                setLoading(false);
                return;
            }

            try {
                // user.shopId를 사용하여 getShopDetail API 호출
                const response = await getShopDetail(user.shopId);
                console.log("API 응답 데이터:", response);

                // API 응답 데이터가 실제 매장 상세 정보라고 가정합니다.
                setShopDetail({
                    ...response, // API 응답 데이터를 그대로 사용
                    images: response.images || [], // API 응답에 이미지가 있다면 사용, 없다면 빈 배열
                    noticePreview: response.noticePreview || null // API 응답에 공지사항 미리보기가 있다면 사용
                });

            } catch (err) {
                console.error("매장 정보 불러오기 실패:", err);
                setError("매장 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyShopData();
    }, [user]); // user 객체가 변경될 때마다 매장 정보를 다시 로드합니다.

    const handleViewAllNotices = () => {
        if (shopDetail && shopDetail.shopId) {
            navigate(`/shops/read/${shopDetail.shopId}/notices`);
        }
    };






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
                    {error.includes("shopId를 찾을 수 없음") && (
                        <p className="mt-2 text-sm">로그인 후 매장 정보를 다시 확인해주세요.</p>
                    )}
                </div>
            </div>
        );
    }

    // shopDetail이 null인 경우를 다시 한번 체크 (오류 처리 후에도 발생할 수 있는 만일의 경우)
    if (!shopDetail) {
        return (
            <div className={`w-full mx-auto px-4 py-8 md:px-0 ${className || ''}`}>
                <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg shadow-md">
                    <p className="text-xl font-semibold mb-4">매장 정보를 불러올 수 없습니다.</p>
                    <p>유효한 매장 정보가 없습니다.</p>
                </div>
            </div>
        );
    }

    const shopImages = shopDetail.images || [];
    const noticePreviewData = shopDetail.noticePreview || null;

    return (
        <div className={`w-full mx-auto px-4 py-8 md:px-0 ${className || ''}`}>
            {/* 매장 상세 정보 헤더 (수정 버튼 포함) */}
            <ShopDetailSection shop={shopDetail} isSeller={true}/> {/* ShopDetailSection 내부의 수정 아이콘은 유지 */}


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