import {useCallback, useEffect, useRef, useState} from "react";
import CakeCard from "../../../components/cake/itemComponents/cakeCard.jsx";
import { getAllCakeList } from "../../../api/cakeApi.jsx";
import CakeCategorySelector from "../../../components/cake/itemComponents/categorySelectComponent.jsx";
import {detailCategories} from "../../../constants/cakeCategory.js";
import {getShopListInfinity} from "../../../api/shopApi.jsx";
import ShopList from "../../../components/shop/list/shopList.jsx";
import ShopFilterBar from "../../../components/shop/list/shopFilterBar.jsx";
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
    const [shopList, setShopList] = useState([]);
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

    useEffect(() => {
        if (selectedMainCategory !== "STORE_BY_CATEGORY") return;

        setLoading(true);
        getShopListInfinity({ page, keyword })
            .then(data => {
                setShopList(prev => [...prev, ...data.content]);
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
            fetchKeyword = "";
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
                {selectedMainCategory !== "STORE_BY_CATEGORY" && (
                    cakes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {cakes.map(cake => (
                                <Link to={`/buyer/shops/${cake.shopId}/cakes/read/${cake.cakeId}`}>
                                <CakeCard key={cake.cakeId} cake={cake} />
                                </Link>
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
                        />
                        <ShopList
                            shopList={shopList}
                            lastShopElementRef={lastShopElementRef}
                            loading={loading}
                            hasMore={hasMore}
                        />
                    </>
                )}
            </main>
        </div>
    );
}

export default CakeAllList;