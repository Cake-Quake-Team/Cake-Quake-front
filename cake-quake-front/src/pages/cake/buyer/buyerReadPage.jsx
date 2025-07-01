import { useEffect, useState } from "react";
import {getCakeDetail, API_SERVER_HOST} from "../../../api/cakeApi.jsx";
import { List } from "lucide-react";
import CakeDetailComponent from "../../../components/cake/itemComponents/cakeDetailComponent.jsx";
import {Link, useParams, useNavigate} from "react-router"; // Link, useParams, useNavigate를 'react-router'에서 가져옴
import CakeOptionForm from "../../../components/cake/itemComponents/cakeOptionForm.jsx";
import { addCartItem } from "../../../api/cartApi.jsx";
import {getCakeReviews} from "../../../api/reviewApi.jsx";
import {getShopDetail} from "../../../api/shopApi.jsx";
import BestReviewsCarousel from "../../../components/review/ReviewCarouserl.jsx"; // 장바구니 추가 API 함수 import (가정)

// ⭐ 새로운 모달 컴포넌트 추가 ⭐
const AddToCartSuccessModal = ({ message, onConfirm }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50"> {/* bg-black bg-opacity-50 제거 */}
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
    const [cake, setCake] = useState(null); // 케이크 상세 정보
    const [shop, setShop] = useState(null); // 매장 상세 정보
    const [optionTypes, setOptionTypes] = useState([]); // 병합된 최종 옵션 타입 데이터 (CakeDetailComponent로 전달)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 옵션 상태
    const [isAddingToCart, setIsAddingToCart] = useState(false); // 장바구니 담기 로딩 상태
    // 모달 상태 추가
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');


    // 리뷰
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
                setCake(data); // 여기에서 data가 {cakeDetailDTO: {}, options: []} 형태로 들어옴

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
            //console.error("Cake object, cakeDetailDTO, or cakeId is null/undefined:", cake);
            return;
        }

        // 선택된 옵션 데이터 준비: 백엔드 `AddCart.Request.options` 형식에 맞춤
        const optionsData = selectedOptions.map(option => ({
            optionItemId: option.optionItemId, // OptionItem의 ID
            optionCnt: 1 // 옵션 수량은 현재 UI에서 별도 입력이 없으므로 기본 1로 가정
        }));

        try {
            setIsAddingToCart(true); // 로딩 상태 시작
            const cartItemData = {
                cakeItemId: cake.cakeDetailDTO.cakeId, // 올바른 경로로 `cakeId` 참조
                productCnt: 1, // 케이크 수량은 현재 UI에서 별도 입력이 없으므로 기본 1로 가정
                options: optionsData // `AddCart.Request` DTO의 `options` 필드에 매핑
            };
            console.log("장바구니에 담을 데이터:", cartItemData);

            await addCartItem(cartItemData);

            // API 호출 성공 후 모달 띄우기
            setModalMessage("상품이 장바구니에 담겼습니다!");
            setShowSuccessModal(true);

        } catch (err) {
            console.error("장바구니 담기 실패:", err);
            const errorMessage = err.response?.data?.message || err.message || "알 수 없는 오류";
            alert(`장바구니 담기에 실패했습니다: ${errorMessage}`);
        } finally {
            setIsAddingToCart(false); // 로딩 상태 종료
        }
    };

    // 모달의 '확인' 버튼 클릭 시 호출될 함수
    const handleModalConfirm = () => {
        setShowSuccessModal(false); // 모달 닫기
        navigate('/buyer/cart'); // 장바구니 페이지로 이동
    };

    // 바로 주문하기 핸들러 추가
    const handleDirectOrder = () => {
        if (!cake || !cake.cakeDetailDTO || !cake.cakeDetailDTO.cakeId) {
            alert("상품 정보가 불완전하여 바로 주문할 수 없습니다. 다시 시도해주세요.");
            console.error("Cake object, cakeDetailDTO, or cakeId is null/undefined for direct order:", cake);
            return;
        }

        const itemToOrder = {

            shopId: parseInt(shopId),

            cakeId: cake.cakeDetailDTO.cakeId,
            cakeItemId: cake.cakeDetailDTO.cakeId,
            cname: cake.cakeDetailDTO.cname, // 주문 생성 페이지에서 보여줄 이름
            thumbnailImageUrl: cake.cakeDetailDTO.thumbnailImageUrl, // 주문 생성 페이지에서 보여줄 이미지
            productCnt: 1, // 기본 수량 1개, 사용자가 변경할 수 있도록 UI에 추가 필요
            price: cake.cakeDetailDTO.price, // 기본 가격
            options: selectedOptions.map(option => ({
                optionItemId: option.optionItemId,
                optionName: option.optionName, // 옵션 이름도 함께 전달 (UI 표시용)
                price: option.price, // 옵션 가격도 함께 전달 (UI 표시용)
                optionCnt: 1 // 옵션 수량
            }))
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

    // `cake`가 `null`이 아니고 `cakeDetailDTO`가 있을 때만 `thumbnailImageUrl` 참조
    const thumbnailUrl = cake && cake.cakeDetailDTO && cake.cakeDetailDTO.thumbnailImageUrl
        ? `${API_SERVER_HOST}/uploads/${cake.cakeDetailDTO.thumbnailImageUrl}`
        : '기본_이미지_경로.png';


    return (
        <div>
            <div className="container mx-auto px-6 py-10">
                <div className="flex items-center justify-center relative mb-3">
                    <Link
                        to={`/buyer`} // 목록으로 돌아가는 경로
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
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    apiBaseUrl={thumbnailUrl}
                    OptionComponent={CakeOptionForm}
                    shop={shop}
                />
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleAddToCart} // `handleAddToCart` 함수 연결
                        disabled={isAddingToCart} // 로딩 중 버튼 비활성화
                        className="min-w-[120px] text-sm border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                    >
                        {isAddingToCart ? '담는 중...' : '장바구니 담기'} {/* 로딩 텍스트 변화 */}
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