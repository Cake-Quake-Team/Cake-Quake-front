import { useEffect, useState } from "react";
import {getCakeDetail, API_SERVER_HOST} from "../../../api/cakeApi.jsx";
import { List } from "lucide-react";
import CakeDetailComponent from "../../../components/cake/itemComponents/cakeDetailComponent.jsx";
import {Link, useParams, useNavigate} from "react-router";
import CakeOptionForm from "../../../components/cake/itemComponents/cakeOptionForm.jsx";
import { addCartItem } from "../../../api/cartApi.jsx";
import {getCakeReviews} from "../../../api/reviewApi.jsx";
import {getShopDetail} from "../../../api/shopApi.jsx";

import BestReviewsCarousel from "../../../components/review/ReviewCarouserl.jsx";
import LikeButton from "../../../components/common/LikeButton.jsx";
import {ShoppingCart, Heart} from "lucide-react";


// ⭐ 새로운 모달 컴포넌트 추가 ⭐
const AddToCartSuccessModal = ({ message, onConfirm }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-lg font-semibold mb-4">{message}</p>
                <button
                    onClick={onConfirm}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    확인
                </button>
            </div>
        </div>
    );
};

function BuyerCakeReadPage() {
    const { shopId, cakeId } = useParams();
    const navigate = useNavigate();
    const [cake, setCake] = useState(null);
    const [shop, setShop] = useState(null);
    const [optionTypes, setOptionTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLiked, setIsLiked] = useState(false); // 찜 상태 (true/false)

    const [reviews, setReviews] = useState([]);
    const [reviewPage, setReviewPage] = useState(1);

    // 케이크 상세 정보를 가져오는 useEffect (옵션 정보 포함)
    useEffect(() => {
        if (!cakeId) {
            setError("케이크 ID가 제공되지 않았습니다.");
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
                                optionItems: []
                            };
                        }
                        acc[typeId].optionItems.push({
                            optionItemId: currentOption.optionItemId,
                            optionName: currentOption.optionName,
                            price: currentOption.price
                        });
                        return acc;
                    }, {});

                    setOptionTypes(Object.values(groupedOptions));
                } else {
                    setOptionTypes([]);
                }

            } catch (err) {
                console.error("케이크 상세 정보를 불러오는 데 실패했습니다:", err);
                setError("케이크 상세 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchCakeDetail();
    }, [cakeId, shopId]);

    // 매장 상세 정보 가져오기
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


    // 찜 버튼 클릭 핸들러
    const handleToggleLike = () => {
        setIsLiked(prev => !prev);
    };


    // 2) 리뷰 가져오기 (첫 페이지만 미리 불러옴, 더보기 버튼 클릭 시 page++)

    useEffect(() => {
        if (!cakeId) return;
        (async () => {
            try {
                const data = await getCakeReviews(cakeId, { page: reviewPage, size: 5 });
                const list = data.content ?? data;
                setReviews(prev => reviewPage === 1 ? list : [...prev, ...list]);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [cakeId, reviewPage]);


    // 장바구니 담기 핸들러 수정
    const handleAddToCart = async () => {
        if (!cake || !cake.cakeDetailDTO || !cake.cakeDetailDTO.cakeId) {
            alert("상품 정보가 불완전합니다. 다시 시도해주세요.");
            return;
        }

        // ⭐ 선택된 옵션 데이터를 Map<Long, Integer> 형태로 변환 ⭐
        const optionsDataMap = selectedOptions.reduce((acc, option) => {
            acc[option.optionItemId] = 1; // 옵션 수량은 현재 UI에서 별도 입력이 없으므로 기본 1로 가정
            return acc;
        }, {});

        try {
            setIsAddingToCart(true);
            const cartItemData = {
                cakeItemId: cake.cakeDetailDTO.cakeId,
                productCnt: 1, // 케이크 수량은 현재 UI에서 별도 입력이 없으므로 기본 1로 가정
                options: optionsDataMap // ✅ 변환된 Map 형태의 options 사용
            };
            console.log("장바구니에 담을 데이터 (MAP 형식):", cartItemData); // 로그 확인 용이하게 변경

            await addCartItem(cartItemData);

            setModalMessage("상품이 장바구니에 담겼습니다!");
            setShowSuccessModal(true);

        } catch (err) {
            console.error("장바구니 담기 실패:", err);
            const errorMessage = err.response?.data?.message || err.message || "알 수 없는 오류";
            alert(`장바구니 담기에 실패했습니다: ${errorMessage}`);
        } finally {
            setIsAddingToCart(false);
        }
    };

    // 모달의 '확인' 버튼 클릭 시 호출될 함수
    const handleModalConfirm = () => {
        setShowSuccessModal(false);
    };

    // 바로 주문하기 핸들러 수정
    const handleDirectOrder = () => {
        if (!cake || !cake.cakeDetailDTO || !cake.cakeDetailDTO.cakeId) {
            alert("상품 정보가 불완전하여 바로 주문할 수 없습니다. 다시 시도해주세요.");
            console.error("Cake object, cakeDetailDTO, or cakeId is null/undefined for direct order:", cake);
            return;
        }

        // ⭐ 선택된 옵션 데이터를 Map<Long, Integer> 형태로 변환 ⭐
        const optionsDataMap = selectedOptions.reduce((acc, option) => {
            acc[option.optionItemId] = 1; // 옵션 수량은 현재 UI에서 별도 입력이 없으므로 기본 1로 가정
            return acc;
        }, {});

        const itemToOrder = {
            shopId: parseInt(shopId),
            cakeId: cake.cakeDetailDTO.cakeId,
            cakeItemId: cake.cakeDetailDTO.cakeId,
            cname: cake.cakeDetailDTO.cname,
            thumbnailImageUrl: cake.cakeDetailDTO.thumbnailImageUrl,
            productCnt: 1, // 기본 수량 1개, 사용자가 변경할 수 있도록 UI에 추가 필요
            price: cake.cakeDetailDTO.price, // 기본 가격
            options: optionsDataMap // ✅ 변환된 Map 형태의 options 사용
        };

        navigate('/buyer/orders/create', { state: { selectedItems: [itemToOrder], shopId: parseInt(shopId) } });
    };


    if (loading) {
        return (
            <div className="text-center py-8 text-gray-500">
                상품 정보를 불러오는 중...
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    const thumbnailUrl = cake && cake.cakeDetailDTO && cake.cakeDetailDTO.thumbnailImageUrl
        ? `${API_SERVER_HOST}/uploads/${cake.cakeDetailDTO.thumbnailImageUrl}`
        : '기본_이미지_경로.png';


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
                <hr className="mb-6 w-1/4 mx-auto"/>

                {/* ⭐⭐ 찜 버튼을 cakeDetailComponent 위에 배치 ⭐⭐ */}
                <div className="flex justify-end pr-4 -mt-4">
                    {cake && cake.cakeDetailDTO && cake.cakeDetailDTO.cakeId && (
                        <LikeButton type="cake" itemId={cake.cakeDetailDTO.cakeId} />
                    )}
                </div>

                <CakeDetailComponent
                    cake={cake}
                    optionTypes={optionTypes}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    apiBaseUrl={thumbnailUrl}
                    OptionComponent={CakeOptionForm}
                    shop={shop}
                    actionButtons={
                        <div className="mt-6 flex justify-center gap-3 flex-shrink-0">
                            {/* 1. 찜 버튼: 고정된 크기를 유지합니다. (flex-shrink-0 추가) */}
                            <button
                                onClick={handleToggleLike}
                                className={`w-10 h-10 flex-shrink-0 flex items-center justify-center p-2 rounded-full border transition-colors duration-200
                           ${isLiked ? ' text-red-300' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                                title={isLiked ? '찜 취소' : '찜하기'}
                            >
                                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                            </button>

                            {/* 2. 장바구니 담기 버튼: flex-1을 추가하여 남은 공간을 채우도록 합니다. */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                className="min-w-[120px] text-sm border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 flex items-center justify-center gap-2 flex-1"
                            >
                                {isAddingToCart ? (
                                    '담는 중...'
                                ) : (
                                    <>
                                        <ShoppingCart size={16} />
                                        <span style={{ transform: 'none', fontStretch: '100%', letterSpacing: 'normal' }}>장바구니 담기</span>
                                    </>
                                )}
                            </button>

                            {/* 3. 바로 주문하기 버튼: flex-1을 추가하여 남은 공간을 채우도록 합니다. */}
                            <button
                                onClick={handleDirectOrder}
                                className="min-w-[120px] text-sm bg-black text-white px-4 py-2 rounded hover:bg-gray-500 flex items-center justify-center gap-2 flex-1"
                            >
                                <span className="mr-1">₩</span>
                                <span style={{ transform: 'none', fontStretch: '100%', letterSpacing: 'normal' }}>바로 주문하기</span>
                            </button>
                        </div>
                    }
                />

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="min-w-[120px] text-sm border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                    >
                        {isAddingToCart ? '담는 중...' : '장바구니 담기'}
                    </button>
                    <button
                        onClick={handleDirectOrder}
                        className="min-w-[120px] text-sm ml-5 bg-black text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                        바로 주문하기
                    </button>
                </div>

            </div>
            <section className="max-w-6xl mx-auto py-12">
                <h2 className="text-3xl font-bold text-center">BEST REVIEWS</h2>
                <p className="text-center text-gray-500 mb-8">
                    고객님들께서 남겨주신 소중한 후기입니다
                </p>

                {reviews.length > 0 ? (
                    <BestReviewsCarousel
                        reviews={reviews}
                        onCardClick={id =>
                            navigate(`/buyer/reviews/${id}`)
                        }
                    />
                ) : (
                    <p className="text-center text-gray-500">등록된 리뷰가 없습니다.</p>
                )}
            </section>

            {/* ⭐ 장바구니 추가 성공 모달 ⭐ */}
            {showSuccessModal && (
                <AddToCartSuccessModal
                    message={modalMessage}
                    onConfirm={handleModalConfirm}
                />
            )}
        </div>
    );
}

export default BuyerCakeReadPage;