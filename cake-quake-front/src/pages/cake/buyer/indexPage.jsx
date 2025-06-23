import { useEffect, useState } from "react";
import CakeCard from "../../../components/cake/itemComponents/cakeCard.jsx";
import { getAllCakeList } from "../../../api/cakeApi.jsx";
import CakeCategorySelector from "../../../components/cake/itemComponents/categorySelectComponent.jsx";
import { detailCategories } from "../../../constants/cakeCategory.js";
import ShopList from "../../../components/shop/list/shopList.jsx";
import ShopFilterBar from "../../../components/shop/list/shopFilterBar.jsx";
import { Link } from "react-router";

// 메인 분류 목록
const mainCategories = [
    { label: "추천상품", id: "RECOMMENDED_PRODUCTS", description: "전체 매장보기" },
    { label: "케이크별 분류", id: "CAKE_BY_CATEGORY", description: "상품 상세 페이지로" },
    { label: "매장별 분류", id: "STORE_BY_CATEGORY", description: "매장 상세 페이지로" }
];

function CakeAllList() {
    const [cakes, setCakes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [selectedMainCategory, setSelectedMainCategory] = useState("RECOMMENDED_PRODUCTS");
    const [selectedDetailKeyword, setSelectedDetailKeyword] = useState("LETTERING");

    // 매장 관련 상태
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("shopId");
    const [keyword, setKeyword] = useState("");

    // ✅ 카테고리 변경 시 초기화 및 즉시 첫 페이지 요청
    useEffect(() => {
        if (selectedMainCategory === "STORE_BY_CATEGORY") return;

        setCakes([]);
        setPage(1);
        setHasNext(true);
        setIsInitialLoad(true);
        setIsLoading(true); // ✅ 바로 첫 요청 보내기 위해 로딩 시작

        let fetchKeyword =
            selectedMainCategory === "CAKE_BY_CATEGORY"
                ? selectedDetailKeyword
                : undefined;

        getAllCakeList({ page: 1, keyword: fetchKeyword })
            .then(data => {
                setCakes(data.content);
                setHasNext(data.hasNext);
                setIsInitialLoad(false);
            })
            .catch(err => {
                console.error("카테고리 변경 시 케이크 로딩 실패", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [selectedMainCategory, selectedDetailKeyword]);


    // ✅ 케이크 목록 불러오기
    useEffect(() => {
        if (selectedMainCategory === "STORE_BY_CATEGORY") return;
        if (!hasNext || isLoading) return;

        const fetchCakes = async () => {
            setIsLoading(true);

            let fetchKeyword =
                selectedMainCategory === "CAKE_BY_CATEGORY"
                    ? selectedDetailKeyword
                    : undefined;

            try {
                const data = await getAllCakeList({ page, keyword: fetchKeyword });

                setCakes(prev =>
                    isInitialLoad ? data.content : [...prev, ...data.content]
                );
                setHasNext(data.hasNext);
                setIsInitialLoad(false);
            } catch (err) {
                console.error("케이크 목록 불러오기 실패", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCakes();
    }, [page, selectedMainCategory, selectedDetailKeyword]);

    // 무한스크롤 로직 (page 바뀔 때마다 다음 페이지 호출)
    useEffect(() => {
        if (selectedMainCategory === "STORE_BY_CATEGORY") return;
        if (page === 1 || !hasNext || isLoading || isInitialLoad) return;

        const fetchCakes = async () => {
            setIsLoading(true);

            let fetchKeyword =
                selectedMainCategory === "CAKE_BY_CATEGORY"
                    ? selectedDetailKeyword
                    : undefined;

            try {
                const data = await getAllCakeList({ page, keyword: fetchKeyword });
                setCakes(prev => [...prev, ...data.content]);
                setHasNext(data.hasNext);
            } catch (err) {
                console.error("무한스크롤 케이크 로딩 실패", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCakes();
    }, [page]);


    // ✅ 스크롤 감지
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.body.scrollHeight;

            if (scrollTop + windowHeight >= docHeight - 300 && hasNext && !isLoading) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasNext, isLoading]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow container mx-auto px-6 py-8">
                {/* 상단 메인 분류 */}
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

                {/* 케이크 카테고리 버튼 */}
                {selectedMainCategory === "CAKE_BY_CATEGORY" && (
                    <CakeCategorySelector
                        categories={detailCategories}
                        selectedKeyword={selectedDetailKeyword}
                        onSelect={setSelectedDetailKeyword}
                    />
                )}

                {/* 케이크 목록 */}
                {selectedMainCategory !== "STORE_BY_CATEGORY" && (
                    <>
                        {Array.isArray(cakes) && cakes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {cakes.map(cake => (
                                    <Link
                                        key={cake.cakeId}
                                        to={`/buyer/shops/${cake.shopId}/cakes/read/${cake.cakeId}`}
                                    >
                                        <CakeCard cake={cake} />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            !isLoading && (
                                <div className="text-center text-gray-500 text-lg mt-10">
                                    선택하신 분류에 해당하는 케이크가 없습니다. 🍰
                                </div>
                            )
                        )}
                        {isLoading && (
                            <div className="text-center text-gray-400 mt-4">불러오는 중입니다...</div>
                        )}
                    </>
                )}

                {/* 매장별 분류일 때 */}
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
                            filter={filter}
                            sort={sort}
                            keyword={keyword}
                        />
                    </>
                )}
            </main>
        </div>
    );
}

export default CakeAllList;
