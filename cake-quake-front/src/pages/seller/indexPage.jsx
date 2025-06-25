import {Link, useParams} from "react-router";
import React, {useEffect, useState, useRef, useCallback} from "react";
import {getAllCakeList, getOptionItems, getOptionTypes} from "../../api/cakeApi.jsx";
import CakeCard from "../../components/cake/itemComponents/cakeCard.jsx";
import CakeOptionList from "../../components/cake/optionComponents/optionListComponent.jsx";
import SellerShopDetail from "../../components/shop/sellerShopDetail.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

// 메인 분류 목록
const shopCategories = [
    { label: "매장 관리", id: "SHOP_MANAGEMENT" },
    { label: "상품 관리", id: "CAKE_MANAGEMENT" },
    { label: "옵션 관리", id: "OPTION_MANAGEMENT" }
];

export default function ShopManagement() {
    const [cakes, setCakes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [selectedShopCategory, setSelectedShopCategory] = useState("SHOP_MANAGEMENT");

    // 무한 스크롤을 위한 Ref
    const observer = useRef();
    const lastCakeElementRef = useCallback(node => {
        if (loading || !hasMore) return; // 이미 로딩 중이거나 더 이상 데이터가 없으면 return

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                // 맨 아래 요소가 뷰포트에 들어오면 페이지 번호 증가
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]); // loading과 hasMore 상태가 바뀔 때마다 콜백 함수 재생성

    {/*상품 관리 목록 가져오기*/}
    useEffect(() => {
        // 로딩 중이거나 더 이상 데이터가 없거나, 다른 카테고리일 경우 실행하지 않음
        if (loading || !hasMore || selectedShopCategory !== "CAKE_MANAGEMENT") {
            return;
        }

        setLoading(true);

        getAllCakeList({page}) // 백엔드 API에 페이지 정보를 전달
            .then(data => {
                // 기존 데이터에 새로운 데이터 추가
                setCakes(prevCakes => [...prevCakes, ...data.content]);
                setHasMore(data.hasNext);
            })
            .catch(err => {
                console.error("케이크 목록 불러오기 실패", err);
                setHasMore(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [page, selectedShopCategory, hasMore]);

    const {shopId} = useParams();
    const [optionTypes, setOptionTypes] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    {/*옵션 관리 목록 가져오기*/}
    useEffect(() => {
        if (selectedShopCategory !== "OPTION_MANAGEMENT") return;

        const fetchOptions = async () => {
            try {
                const fetchedOptionTypes = await getOptionTypes(shopId);
                const fetchedOptionItems = await getOptionItems(shopId);

                const mergedOptionTypes = fetchedOptionTypes.map(type => {
                    const relevantItems = fetchedOptionItems.filter(item =>
                        item.optionTypeId === type.optionTypeId
                    );
                    return {
                        optionTypeId: type.optionTypeId,
                        optionType: type.optionType,
                        isRequired: type.isRequired,
                        optionItems: relevantItems.map(item => ({
                            optionItemId: item.optionItemId,
                            optionName: item.optionName,
                            price: item.price
                        }))
                    }
                })
                setOptionTypes(mergedOptionTypes);
            } catch (err) {
                console.error("옵션 데이터 불러오기 실패", err);
            }
        };

        fetchOptions();
    }, [shopId, selectedShopCategory]);

    // 카테고리 변경 시 데이터 초기화
    useEffect(() => {
        if (selectedShopCategory === "CAKE_MANAGEMENT") {
            // 상품 관리 카테고리로 전환될 때만 초기화
            setCakes([]);
            setPage(1);
            setHasMore(true);
        }
    }, [selectedShopCategory]);

    return (
        <>
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
                <hr className="mb-6 w-1/4 mx-auto"/>
                <div className="flex items-center text-gray-700 mb-6 border-b border-gray-200 pb-2">
                    {/*카테고리*/}
                    {shopCategories.map((mainCat, index) => (
                        <div
                            key={mainCat.id}
                            className={`
                                flex flex-col cursor-pointer transition-colors duration-200
                                ${index > 0 ? "border-l border-gray-300 pl-6 ml-6" : "pr-6"}
                                ${selectedShopCategory === mainCat.id ? "font-semibold text-gray-800" : "text-gray-500"}
                            `}
                            onClick={() => {
                                setSelectedShopCategory(mainCat.id);
                            }}
                        >
                            <span className="text-xl">{mainCat.label}</span>
                            <span className="text-sm font-normal text-gray-400">
                                {mainCat.description}
                            </span>
                        </div>
                    ))}
                </div>
                <ul>
                    {/*카테고리가 매장관리일 경우*/}
                    {selectedShopCategory === "SHOP_MANAGEMENT" && (
                        <SellerShopDetail className="mt-8" />
                    )}
                    {/*카테고리가 상품관리일 경우*/}
                    {selectedShopCategory === "CAKE_MANAGEMENT" && (
                        <>
                            {cakes.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {cakes.map((cake, index) => {
                                        if (cakes.length === index + 1) {
                                            return (
                                                <Link to={`cakes/read/${cake.cakeId}`} ref={lastCakeElementRef} key={cake.cakeId}>
                                                    <CakeCard cake={cake}/>
                                                </Link>
                                            );
                                        } else {
                                            return (
                                                <Link to={`cakes/read/${cake.cakeId}`} key={cake.cakeId}>
                                                    <CakeCard cake={cake}/>
                                                </Link>
                                            );
                                        }
                                    })}
                                </div>
                            ) : (
                                // 데이터가 없고 로딩 중이 아닐 때만 표시
                                !loading && (
                                    <div className="text-center text-gray-500 text-lg mt-10">
                                        선택하신 분류에 해당하는 케이크가 없습니다. 🍰
                                    </div>
                                )
                            )}
                            {/* 로딩 스피너 */}
                            {loading && (
                                <div className="flex justify-center mt-8">
                                    <LoadingSpinner />
                                </div>
                            )}
                        </>
                    )}
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
                                    <button
                                        className="px-6 py-2 bg-gray-500 text-white text-sm font-semibold rounded-lg shadow-md
                               hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
                               transition-all duration-200"
                                    >
                                        [+] 새 옵션 추가
                                    </button>
                                </Link>
                            </div>
                        )
                    )}

                </ul>
            </div>
        </>
    );
}