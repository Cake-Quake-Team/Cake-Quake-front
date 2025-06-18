import {useCallback, useEffect, useRef, useState} from "react";
import CakeCard from "../../components/cake/cakeCard";
import { getAllCakeList } from "../../api/cakeApi";
import CakeCategorySelector from "../../components/cake/categorySelectComponent.jsx";
import {detailCategories} from "../../constants/cakeCategory.js";
import {getShopListInfinity} from "../../api/shopApi.jsx";
import ShopFilterBar from "../../components/shop/list/shopFilterBar.jsx";
import ShopCard from "../../components/shop/list/shopCard.jsx";
import {Link} from "react-router";

// 메인 분류 목록
const mainCategories = [
    { label: "추천상품", id: "RECOMMENDED_PRODUCTS", description: "전체 매장보기" },
    { label: "케이크별 분류", id: "CAKE_BY_CATEGORY", description: "상품 상세 페이지로" },
    { label: "매장별 분류", id: "STORE_BY_CATEGORY", description: "매장 상세 페이지로" }
];

function CakeAllList() {
    const [cakes, setCakes] = useState([]);
    const [page] = useState(1);
    // 현재 선택된 메인 분류 (기본값: 추천상품)
    const [selectedMainCategory, setSelectedMainCategory] = useState("RECOMMENDED_PRODUCTS");
    // 현재 선택된 세부 카테고리 (기본값: 'LETTERING')
    const [selectedDetailKeyword, setSelectedDetailKeyword] = useState("LETTERING");

    // 매장 관련 상태
    const [shopCard, setShopCard] = useState([]);
    const [shopPage, setShopPage] = useState(1);
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("shopId");
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();
    const lastShopElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setShopPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    //STORE_BY_CATEGORY 선택 시
    useEffect(() => {
        //벗어나는 경우 매장 데이터 초기화
        if (selectedMainCategory !== "STORE_BY_CATEGORY") {
            setShopCard([]);
            setShopPage(0);
            setHasMore(true);
            return;
        }
        setLoading(true);
        getShopListInfinity({ page:shopPage, keyword,filter,sort })
            .then(data => {
                setShopCard(prev => {
                    const newContent = data.content.filter(newItem =>
                        !prev.some(existingItem => existingItem.shopId === newItem.shopId)
                    );
                    return [...prev, ...newContent];
                });
                setHasMore(!data.last);
                setLoading(false);
            })
            .catch(err => {
                console.error("매장 목록 불러오기 실패", err);
                setLoading(false);
            });
    }, [shopPage, filter, sort, keyword, selectedMainCategory]);

    useEffect(() => {
        if (selectedMainCategory === "STORE_BY_CATEGORY") return;

        let fetchKeyword = "";
        if (selectedMainCategory === "CAKE_BY_CATEGORY") {
            // '케이크별 분류'가 선택되었을 때만 세부 키워드를 사용
            fetchKeyword = selectedDetailKeyword;
        } else if (selectedMainCategory === "RECOMMENDED_PRODUCTS") {
            // '추천상품'이 선택되었을 때 특정 키워드 또는 전체 조회 (API에 따라 조정)
            fetchKeyword = ""; // 또는 빈 문자열 ""
        }

        getAllCakeList({ page, keyword: fetchKeyword })
            .then(data => {
                setCakes(data.content);
            })
            .catch(err => {
                console.error("케이크 목록 불러오기 실패", err);
            });
    }, [page, selectedMainCategory, selectedDetailKeyword]); // 종속성 배열 업데이트

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow container mx-auto px-6 py-8">
                {/* 상단 메인 분류 섹션 */}
                <div className="flex items-center text-gray-700 mb-6 border-b border-gray-200 pb-2">
                    {mainCategories.map((mainCat, index) => (
                        <div
                            key={mainCat.id}
                            className={`
                                flex flex-col cursor-pointer transition-colors duration-200
                                ${index > 0 ? "border-l border-gray-300 pl-6 ml-6" : "pr-6"}
                                ${selectedMainCategory === mainCat.id ? "font-semibold text-gray-800" : "text-gray-500"}
                            `}
                            onClick={() => {
                                setSelectedMainCategory(mainCat.id);
                                // 메인 카테고리가 변경되면 세부 키워드 초기화 (필요에 따라)
                                if (mainCat.id === "CAKE_BY_CATEGORY") {
                                    setSelectedDetailKeyword("LETTERING");
                                }
                            }}
                        >
                            <span className="text-xl">{mainCat.label}</span>
                            <span className="text-sm font-normal text-gray-400">
                                {mainCat.description}
                            </span>
                        </div>
                    ))}
                </div>

                {/* 세부 카테고리 필터 버튼 (메인 분류가 '케이크별 분류'일 때만 표시) */}
                {selectedMainCategory === "CAKE_BY_CATEGORY" && (
                    <CakeCategorySelector
                        categories={detailCategories}
                        selectedKeyword={selectedDetailKeyword}
                        onSelect={setSelectedDetailKeyword}
                    />
                )}

                {/* 케이크 목록 그리드 */}
                {/* '매장별 분류'가 선택되었을 때는 케이크 목록을 보여주지 않거나 다른 컴포넌트 렌더링 */}
                {selectedMainCategory !== "STORE_BY_CATEGORY" && (
                    cakes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {cakes.map(cake => (
                                <CakeCard key={cake.cakeId} cake={cake} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 text-lg mt-10">
                            선택하신 분류에 해당하는 케이크가 없습니다. 🍰
                        </div>
                    )
                )}
                {/* 매장별 분류가 선택되었을 때 보여줄 내용 (예: <StoreList /> 컴포넌트) */}
                {selectedMainCategory === "STORE_BY_CATEGORY" && (
                    <>
                        <ShopFilterBar
                            filter={filter}
                            setFilter={setFilter}
                            sort={sort}
                            setSort={setSort}
                            keyword={keyword}
                            setKeyword={setKeyword}
                            // 필터/정렬/검색어 변경 시 shopPage를 0으로 리셋
                            onFilterChange={() => {
                                setShopCard([]);
                                setShopPage(0);
                                setHasMore(true);
                            }}
                        />
                        {shopCard.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                                {shopCard.map((shopItem, index) => {
                                   const isLastElement =shopCard.length===index+1;

                                   return(
                                       <Link
                                           to={`/shops/read/${shopItem.shopId}`}
                                           key={shopItem.shopId}
                                           ref={isLastElement ? lastShopElementRef : null}
                                           className="block rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col h-full bg-white cursor-pointer"
                                           style={{
                                               textDecoration: 'none',
                                               color: 'inherit'
                                           }} >
                                           <ShopCard shop={shopItem} />
                                       </Link>
                                   )
                                })}
                            </div>
                        ) : (
                            !loading && (
                                <div className="text-center text-gray-500 text-lg mt-10">
                                    선택하신 조건에 맞는 매장이 없습니다. 🏪
                                </div>
                            )
                        )}

                        {!hasMore && !loading && shopCard.length > 0 && (
                            <div className="text-center text-gray-500 text-sm mt-4">
                                모든 매장을 불러왔습니다.
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default CakeAllList;