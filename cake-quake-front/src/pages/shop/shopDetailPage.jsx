import ShopDetailSection from "../../components/shop/read/ShopDetailSection.jsx";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {getShopDetail} from "../../api/shopApi.jsx";
import ShopNoticeSection from "../../components/shop/read/ShopNoticeSection.jsx";
import ShopImageGallery from "../../components/shop/read/ShopImageGallery.jsx";
import CakeListSection from "../../components/shop/read/CakeListSection.jsx";

const ShopDetailPage = () => {
    const { cid} = useParams();
    const [shopDetail, setShopDetail] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadShopDetail = async () => {
            setShopDetail(null); // 새로운 shopId로 로딩 시 기존 데이터 초기화 (선택 사항)
            setError(null);
            try {
                const data = await getShopDetail(cid);
                setShopDetail(data);
            } catch (err) {
                setError("매장 상세 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.");
                console.error("Error fetching shop detail:", err);
            }
        };

        if (cid) { // shopId가 유효할 때만 데이터 로드
            loadShopDetail();
        }
    }, [cid]); // shopId가 변경될 때마다 useEffect 재실행


    if (error) {
        return (
            <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 md:px-0">
                <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg shadow-md">
                    <p className="text-xl font-semibold mb-4">오류 발생</p>
                    <p>{error}</p>
                    <p className="text-sm mt-4">잠시 후 다시 시도하거나, 다른 매장을 검색해보세요.</p>
                </div>
            </main>
        );
    }

    if (!shopDetail) {
        return (
            <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 md:px-0">
                <div className="text-center p-8 bg-blue-100 text-blue-700 rounded-lg shadow-md">
                    <p className="text-xl font-semibold mb-4">매장 정보를 찾을 수 없습니다.</p>
                    <p>요청하신 매장 ID({cid})에 해당하는 정보가 존재하지 않습니다.</p>
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
            />

            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <CakeListSection cakes={shopDetail.cakes} />
            </div>
        </main>
    );
};

export default ShopDetailPage;