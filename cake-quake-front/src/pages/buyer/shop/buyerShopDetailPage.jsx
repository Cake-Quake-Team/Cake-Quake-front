
import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {getShopDetail} from "../../../api/shopApi.jsx";
import ShopDetailSection from "../../../components/shop/read/ShopDetailSection.jsx";
import ShopImageGallery from "../../../components/shop/read/ShopImageGallery.jsx";
import ShopNoticeSection from "../../../components/shop/read/ShopNoticeSection.jsx";
import CakeListSection from "../../../components/shop/read/CakeListSection.jsx";


const BuyerShopDetailPage = () => {
    const { shopId} = useParams();
    const [shopDetail, setShopDetail] = useState(null);
    const navigate=useNavigate();

    useEffect(() => {
        const loadShopDetail = async () => {
            setShopDetail(null); // 새로운 shopId로 로딩 시 기존 데이터 초기화 (선택 사항)
            const data = await getShopDetail(shopId);
            setShopDetail(data);
        };

        if (shopId) { // shopId가 유효할 때만 데이터 로드
            loadShopDetail();
        }
    }, [shopId]); // shopId가 변경될 때마다 useEffect 재실행

    const handleViewAllNotices = () => {
        // shopId를 사용하여 동적으로 경로를 생성합니다.
        navigate(`/buyer/shops/${shopId}/notices`);
    };



    if (!shopDetail) {
        return (
            <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 md:px-0">
                <div className="text-center p-8 bg-blue-100 text-blue-700 rounded-lg shadow-md">
                    <p className="text-xl font-semibold mb-4">매장 정보를 찾을 수 없습니다.</p>
                    <p>요청하신 매장 ID({shopId})에 해당하는 정보가 존재하지 않습니다.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 md:px-0">
            {/*매장 상세 정보 헤더*/}
            <ShopDetailSection shop={shopDetail} />

            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <ShopImageGallery images={shopDetail.images} />
            </div>


            {/* 매장 공지글 섹션 (ShopNoticeSection에 shopId 전달) */}
            <ShopNoticeSection
                noticePreview={shopDetail.noticePreview}
                shopId={shopDetail.shopId} // <--- shopId 전달
                onViewAllNotices={handleViewAllNotices}
            />

            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <CakeListSection cakes={shopDetail.cakes} />
            </div>
        </main>
    );
};

export default BuyerShopDetailPage;