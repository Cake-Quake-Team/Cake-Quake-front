import { useEffect, useState } from "react";
import {getCakeDetail, API_SERVER_HOST} from "../../../api/cakeApi.jsx";
import { List } from "lucide-react";
import CakeDetailComponent from "../../../components/cake/itemComponents/cakeDetailComponent.jsx";
import {Link, useParams, useNavigate} from "react-router";
import CakeOptionForm from "../../../components/cake/itemComponents/cakeOptionForm.jsx"; // CakeOptionForm 임포트 확인
import { addCartItem } from "../../../api/cartApi.jsx";
import {getCakeReviews} from "../../../api/reviewApi.jsx";
import {getShopDetail} from "../../../api/shopApi.jsx";

import BestReviewsCarousel from "../../../components/review/ReviewCarouserl.jsx";
import LikeButton from "../../../components/common/LikeButton.jsx";
import {ShoppingCart} from "lucide-react";


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
    const [optionTypes, setOptionTypes] = useState([]); // 옵션 타입별로 그룹화된 옵션들
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

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
                    // 서버에서 받은 옵션을 타입별로 그룹화하는 로직은 유지
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


    // 장바구니 담기 핸들러
    const handleAddToCart = async () => {
        if (!cake || !cake.cakeDetailDTO || !cake.cakeDetailDTO.cakeId) {
            alert("상품 정보가 불완전합니다. 다시 시도해주세요.");
            return;
        }

        // selectedOptions 상태 확인 및 옵션 선택 강제 (선택 사항)
        if (optionTypes.some(type => type.isRequired) && selectedOptions.length === 0) {
            // 필수 옵션이 있고 아무것도 선택되지 않았다면
            alert("필수 옵션을 선택해주세요.");
            return;
        }

        const formattedOptions = selectedOptions.map(option => ({
            optionItemId: option.optionItemId,
            optionName: option.optionName,
            optionValue: option.optionValue || option.optionName,
            // CakeOptionForm이 optionValue 제공
            optionPrice: option.price || 0, // price가 null일 경우 0으로 처리
            optionCnt: option.optionCnt || 1 // optionCnt가 있다면 사용, 없으면 기본 1로 고정
        }));

        console.log("DEBUG: 장바구니에 담을 데이터 (최종 전송 전):", JSON.stringify({
            cakeItemId: cake.cakeDetailDTO.cakeId,
            productCnt: 1,
            cakeOptions: formattedOptions // 이 리스트에 실제 옵션 데이터가 담겨야 합니다.
        }, null, 2));


        try {
            setIsAddingToCart(true);
            const cartItemData = {
                cakeItemId: cake.cakeDetailDTO.cakeId,
                productCnt: 1,
                cakeOptions: formattedOptions // ✅ 올바르게 변환된 List<CartItemOption> 형태 사용
            };

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

    const handleModalConfirm = () => {
        setShowSuccessModal(false);
    };

    // 바로 주문하기 핸들러
    const handleDirectOrder = () => {
        if (!cake || !cake.cakeDetailDTO || !cake.cakeDetailDTO.cakeId) {
            alert("상품 정보가 불완전하여 바로 주문할 수 없습니다. 다시 시도해주세요.");
            console.error("Cake object, cakeDetailDTO, or cakeId is null/undefined for direct order:", cake);
            return;
        }

        // 옵션 선택 강제 (선택 사항)
        if (optionTypes.some(type => type.isRequired) && selectedOptions.length === 0) {
            alert("필수 옵션을 선택해주세요.");
            return;
        }


        const optionsDataMap = selectedOptions.reduce((acc, option) => {

            acc[option.optionItemId] = option.optionCnt || 1; // optionCnt가 있다면 사용, 없으면 기본 1
            return acc;
        }, {});

        const itemToOrder = {
            shopId: parseInt(shopId), // 현재 URL에서 가져온 shopId
            cakeId: cake.cakeDetailDTO.cakeId,
            cakeItemId: cake.cakeDetailDTO.cakeId, // CakeItem ID를 의미하는 필드
            cname: cake.cakeDetailDTO.cname,
            thumbnailImageUrl: cake.cakeDetailDTO.thumbnailImageUrl,
            productCnt: 1, // 기본 수량 1개
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

                <CakeDetailComponent
                    cake={cake}
                    optionTypes={optionTypes}
                    selectedOptions={selectedOptions} // CakeOptionForm에서 업데이트할 selectedOptions 상태
                    setSelectedOptions={setSelectedOptions} // CakeOptionForm에서 selectedOptions를 업데이트할 함수
                    apiBaseUrl={thumbnailUrl}
                    OptionComponent={CakeOptionForm}
                    shop={shop}
                    actionButtons={
                        <div className="mt-6 flex justify-center gap-3 flex-shrink-0">
                            <LikeButton type="cake" itemId={cakeId} />

                            {/* 장바구니 담기 버튼 */}
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

                            {/* 바로 주문하기 버튼 */}
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

            {/* 장바구니 추가 성공 모달 */}
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