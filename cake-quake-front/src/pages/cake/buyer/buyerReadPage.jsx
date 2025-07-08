import React, { useEffect, useState } from "react";
import { getCakeDetail } from "../../../api/cakeApi.jsx";
import { List, ShoppingCart } from "lucide-react";
import CakeDetailComponent from "../../../components/cake/itemComponents/cakeDetailComponent.jsx";
import { Link, useParams, useNavigate } from "react-router";
import CakeOptionForm from "../../../components/cake/itemComponents/cakeOptionForm.jsx";
import { addCartItem } from "../../../api/cartApi.jsx";
import { getCakeReviews } from "../../../api/reviewApi.jsx";
import { getShopDetail } from "../../../api/shopApi.jsx";
import BestReviewsCarousel from "../../../components/review/ReviewCarouserl.jsx";
import LikeButton from "../../../components/common/LikeButton.jsx";
import AlertModal from "../../../components/common/AlertModal"; 

function BuyerCakeReadPage() {
    const { shopId, cakeId } = useParams();
    const navigate = useNavigate();

    const [cake, setCake] = useState(null);
    const [shop, setShop] = useState(null);
    const [optionTypes, setOptionTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    // error 상태는 {message, type: "success"|"error"} 또는 null
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewPage] = useState(1);

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    useEffect(() => {
        if (!cakeId) {
            setError({ message: "케이크 ID가 제공되지 않았습니다.", type: "error" });
            setShowError(true);
            setLoading(false);
            return;
        }

        const fetchCakeDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getCakeDetail(shopId, cakeId);
                setCake(data);

                if (data && data.options) {
                    const groupedOptions = data.options.reduce((acc, currentOption) => {
                        const typeId = currentOption.optionTypeId;
                        const typeName = currentOption.optionTypeName || `알 수 없는 옵션 타입 ${typeId}`;

                        if (!acc[typeId]) {
                            acc[typeId] = {
                                optionTypeId: typeId,
                                optionType: typeName,
                                isRequired: currentOption.isRequired,
                                minSelection: currentOption.minSelection,
                                maxSelection: currentOption.maxSelection,
                                optionItems: [],
                            };
                        }

                        acc[typeId].optionItems.push({
                            optionItemId: currentOption.optionItemId,
                            optionName: currentOption.optionName,
                            price: currentOption.price,
                        });
                        return acc;
                    }, {});

                    setOptionTypes(Object.values(groupedOptions));
                } else {
                    setOptionTypes([]);
                }
            } catch (err) {
                console.error("케이크 상세 정보를 불러오는 데 실패했습니다:", err);
                setError({ message: "케이크 상세 정보를 불러오는 데 실패했습니다.", type: "error" });
                setShowError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCakeDetail();
    }, [cakeId, shopId]);

    useEffect(() => {
        if (!shopId) return;

        (async () => {
            try {
                const data = await getShopDetail(shopId);
                setShop(data);
            } catch (error) {
                console.error("매장 상세 정보를 불러오는 데 실패했습니다:", error);
            }
        })();
    }, [shopId]);

    useEffect(() => {
        if (!cakeId) return;

        (async () => {
            try {
                const data = await getCakeReviews(cakeId, { page: reviewPage, size: 5 });
                const list = data.content ?? data;
                setReviews(prev => (reviewPage === 1 ? list : [...prev, ...list]));
            } catch (e) {
                console.error(e);
            }
        })();
    }, [cakeId, reviewPage]);

    const handleAddToCart = async () => {
        if (!cake || !cake.cakeDetailDTO || !cake.cakeDetailDTO.cakeId) {
            setError({ message: "상품 정보가 불완전합니다. 다시 시도해주세요.", type: "error" });
            setShowError(true);
            return;
        }

        if (optionTypes.some(type => type.isRequired) && selectedOptions.length === 0) {
            setError({ message: "필수 옵션을 선택해주세요.", type: "error" });
            setShowError(true);
            return;
        }

        const formattedOptions = selectedOptions.map(option => ({
            optionItemId: option.optionItemId,
            optionName: option.optionName,
            optionValue: option.optionValue || option.optionName,
            optionPrice: option.price || 0,
            optionCnt: option.optionCnt || 1,
        }));

        try {
            setIsAddingToCart(true);

            await addCartItem({
                cakeItemId: cake.cakeDetailDTO.cakeId,
                productCnt: 1,
                cakeOptions: formattedOptions,
            });

            setError({ message: "상품이 장바구니에 담겼습니다!", type: "success" });
            setShowError(true);
        } catch (err) {
            console.error("장바구니 담기 실패:", err);
            const errorMessage = err.response?.data?.message || err.message || "알 수 없는 오류";
            setError({ message: `장바구니 담기에 실패했습니다: ${errorMessage}`, type: "error" });
            setShowError(true);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleDirectOrder = () => {
        if (!cake || !cake.cakeDetailDTO || !cake.cakeDetailDTO.cakeId) {
            setError({ message: "상품 정보가 불완전하여 바로 주문할 수 없습니다. 다시 시도해주세요.", type: "error" });
            setShowError(true);
            console.error("Cake object, cakeDetailDTO, or cakeId is null/undefined for direct order:", cake);
            return;
        }

        if (optionTypes.some(type => type.isRequired) && selectedOptions.length === 0) {
            setError({ message: "필수 옵션을 선택해주세요.", type: "error" });
            setShowError(true);
            return;
        }

        const optionsDataMap = selectedOptions.reduce((acc, option) => {
            acc[option.optionItemId] = option.optionCnt || 1;
            return acc;
        }, {});

        const itemToOrder = {
            shopId: parseInt(shopId),
            cakeId: cake.cakeDetailDTO.cakeId,
            cakeItemId: cake.cakeDetailDTO.cakeId,
            cname: cake.cakeDetailDTO.cname,
            thumbnailImageUrl: cake.cakeDetailDTO.thumbnailImageUrl,
            productCnt: 1,
            price: cake.cakeDetailDTO.price,
            options: optionsDataMap,
        };

        navigate("/buyer/orders/create", { state: { selectedItems: [itemToOrder], shopId: parseInt(shopId) } });
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-500">상품 정보를 불러오는 중...</div>;
    }

    if (error && error.type === "error" && !showError) {
        // error.type이 error인데 showError false면 에러 UI는 안보임 (토스트로 대체)
        // 필요시 여기에 에러 UI 직접 렌더 가능
    }

    const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;
    const thumbnailUrl =
        cake && cake.cakeDetailDTO && cake.cakeDetailDTO.thumbnailImageUrl
            ? S3_BASE_URL + cake.cakeDetailDTO.thumbnailImageUrl
            : "기본_이미지_경로.png";

    return (
        <div>
            <div className="container mx-auto px-6 py-10">
                <div className="flex items-center justify-center relative mb-3">
                    <Link
                        to={`/buyer`}
                        className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-md hover:text-gray-500 transition-colors duration-200"
                        title="목록으로"
                    >
                        <List size={30} />
                    </Link>

                    <h1 className="text-2xl font-semibold">상품 상세 조회</h1>
                </div>
                <hr className="mb-6 w-1/4 mx-auto" />

                <CakeDetailComponent
                    cake={cake}
                    optionTypes={optionTypes}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    apiBaseUrl={thumbnailUrl}
                    OptionComponent={CakeOptionForm}
                    shop={shop}
                    actionButtons={
                        <div className="mt-6 flex justify-center gap-4 items-center">
                            <LikeButton type="cake" itemId={cakeId} />

                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                className="mt-6 min-w-[120px] text-sm border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 flex items-center justify-center gap-2 flex-1"
                            >
                                {isAddingToCart ? (
                                    "담는 중..."
                                ) : (
                                    <>
                                        <ShoppingCart size={14} />
                                        <span>장바구니</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleDirectOrder}
                                className="mt-6 min-w-[120px] text-sm bg-black border border-black text-white px-4 py-2 rounded hover:bg-gray-500 flex items-center justify-center gap-2 flex-1"
                            >
                                <span className="text-[13px]">₩</span>
                                <span>바로 주문</span>
                            </button>
                        </div>
                    }
                />
            </div>

            <section className="max-w-6xl mx-auto py-12">
                <h2 className="text-3xl font-bold text-center">BEST REVIEWS</h2>
                <p className="text-center text-gray-500 mb-8">고객님들께서 남겨주신 소중한 후기입니다</p>

                {reviews.length > 0 ? (
                    <BestReviewsCarousel reviews={reviews} onCardClick={id => navigate(`/buyer/reviews/${id}`)} />
                ) : (
                    <p className="text-center text-gray-500">등록된 리뷰가 없습니다.</p>
                )}
            </section>

            {/* AlertModal 토스트 알림 */}
            {error && (
                <AlertModal message={error.message} type={error.type} show={showError} onClose={() => setShowError(false)} />
            )}
        </div>
    );
}

export default BuyerCakeReadPage;
