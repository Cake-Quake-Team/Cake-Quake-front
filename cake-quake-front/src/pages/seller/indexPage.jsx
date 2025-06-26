import { Link } from "react-router";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { getOptionItems, getOptionTypes } from "../../api/cakeApi.jsx";
import { getShopCakes } from "../../api/shopApi.jsx";
import CakeCard from "../../components/cake/itemComponents/cakeCard.jsx";
import CakeOptionList from "../../components/cake/optionComponents/optionListComponent.jsx";
import SellerShopDetail from "../../components/shop/sellerShopDetail.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { useAuth } from "../../store/AuthContext.jsx";

// 카테고리 목록
const shopCategories = [
    { label: "매장 관리", id: "SHOP_MANAGEMENT" },
    { label: "상품 관리", id: "CAKE_MANAGEMENT" },
    { label: "옵션 관리", id: "OPTION_MANAGEMENT" },
];

export default function ShopManagement() {
    const { user } = useAuth();

    const [cakes, setCakes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedShopCategory, setSelectedShopCategory] = useState("SHOP_MANAGEMENT");
    const [optionTypes, setOptionTypes] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    // 케이크 목록 로드
    useEffect(() => {
        if (selectedShopCategory !== "CAKE_MANAGEMENT") return;
        if (!user?.shopId || loading || !hasMore) return;

        const loadCakes = async () => {
            setLoading(true);
            try {
                const cakeData = await getShopCakes(user.shopId, null, { page, size: 10 });
                setCakes(prev => page === 1 ? cakeData.content : [...prev, ...cakeData.content]);
                setHasMore(cakeData.hasNext);
            } catch (err) {
                console.error("케이크 목록 불러오기 실패", err);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        loadCakes();
    }, [user?.shopId, page, selectedShopCategory]);

    // 무한 스크롤
    const observer = useRef();

    const lastCakeElementRef = useCallback(
        node => {
            if (loading || !hasMore || selectedShopCategory !== "CAKE_MANAGEMENT") return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    setPage(prev => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, selectedShopCategory]
    );

    // 카테고리 변경 시 초기화
    useEffect(() => {
        if (selectedShopCategory === "CAKE_MANAGEMENT") {
            setCakes([]);
            setPage(1);
            setHasMore(true);
        }
    }, [selectedShopCategory]);

    // 옵션 데이터 로드
    useEffect(() => {
        if (selectedShopCategory !== "OPTION_MANAGEMENT") return;

        const fetchOptions = async () => {
            try {
                const fetchedTypes = await getOptionTypes(user.shopId);
                const fetchedItems = await getOptionItems(user.shopId);

                const merged = fetchedTypes.map(type => {
                    const relevantItems = fetchedItems.filter(item => item.optionTypeId === type.optionTypeId);
                    return {
                        optionTypeId: type.optionTypeId,
                        optionType: type.optionType,
                        isRequired: type.isRequired,
                        optionItems: relevantItems.map(item => ({
                            optionItemId: item.optionItemId,
                            optionName: item.optionName,
                            price: item.price,
                        })),
                    };
                });

                setOptionTypes(merged);
            } catch (err) {
                console.error("옵션 데이터 불러오기 실패", err);
            }
        };

        fetchOptions();
    }, [user.shopId, selectedShopCategory]);

    return (
        <div style={{ padding: "1rem" }} className="mt-3">
            <div className="flex items-center justify-center relative mb-3">
                <h2 className="text-2xl font-semibold">매장 관리</h2>
                <Link
                    to={`cakes/add`}
                    className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-md hover:text-gray-500 transition-colors duration-200"
                >
                    ➕ 새 상품 등록
                </Link>
            </div>
            <hr className="mb-6 w-1/4 mx-auto" />

            {/* 카테고리 선택 */}
            <div className="flex items-center text-gray-700 mb-6 border-b border-gray-200 pb-2">
                {shopCategories.map((mainCat, index) => (
                    <div
                        key={mainCat.id}
                        className={`
              flex flex-col cursor-pointer transition-colors duration-200
              ${index > 0 ? "border-l border-gray-300 pl-6 ml-6" : "pr-6"}
              ${selectedShopCategory === mainCat.id ? "font-semibold text-gray-800" : "text-gray-500"}
            `}
                        onClick={() => setSelectedShopCategory(mainCat.id)}
                    >
                        <span className="text-xl">{mainCat.label}</span>
                        <span className="text-sm font-normal text-gray-400">{mainCat.description}</span>
                    </div>
                ))}
            </div>

            {/* 카테고리별 내용 */}
            <ul>
                {/* 매장 관리 */}
                {selectedShopCategory === "SHOP_MANAGEMENT" && <SellerShopDetail className="mt-8" />}

                {/* 상품 관리 */}
                {selectedShopCategory === "CAKE_MANAGEMENT" && (
                    <div className="mb-8 bg-white p-6 rounded-xl">
                        {cakes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {cakes.map((cake, index) => {
                                    const isLast = cakes.length === index + 1;
                                    return (
                                        <Link to={`cakes/read/${cake.cakeId}`} key={cake.cakeId} ref={isLast ? lastCakeElementRef : null}>
                                            <CakeCard cake={cake} />
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 text-lg mt-10">
                                선택하신 분류에 해당하는 케이크가 없습니다. 🍰
                            </div>
                        )}

                        {loading && (
                            <div className="flex justify-center mt-8">
                                <LoadingSpinner />
                            </div>
                        )}
                    </div>
                )}

                {/* 옵션 관리 */}
                {selectedShopCategory === "OPTION_MANAGEMENT" && (
                    optionTypes.length > 0 ? (
                        <CakeOptionList
                            optionTypes={optionTypes}
                            selectedOptions={selectedOptions}
                            setSelectedOptions={setSelectedOptions}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-gray-600 mt-20">
                            <p className="text-2xl font-semibold mb-2">옵션이 없어요 😢</p>
                            <p className="text-base text-gray-500 mb-6">
                                아직 등록된 옵션이 없어요.<br />
                                옵션을 추가해서 다양한 선택지를 제공해보세요!
                            </p>
                            <Link to="options/add">
                                <button className="px-6 py-2 bg-gray-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-200">
                                    [+] 새 옵션 추가
                                </button>
                            </Link>
                        </div>
                    )
                )}
            </ul>
        </div>
    );
}
