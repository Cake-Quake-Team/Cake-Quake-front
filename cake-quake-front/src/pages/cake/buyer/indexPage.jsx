import { useEffect, useState} from "react";
import CakeCard from "../../../components/cake/itemComponents/cakeCard.jsx";
import { getAllCakeList } from "../../../api/cakeApi.jsx";
import CakeCategorySelector from "../../../components/cake/itemComponents/categorySelectComponent.jsx";
import { detailCategories } from "../../../constants/cakeCategory.js";
import ShopList from "../../../components/shop/list/shopList.jsx";
import ShopFilterBar from "../../../components/shop/list/shopFilterBar.jsx";
import { Link } from "react-router";
import BannerCarousel from "../../../components/common/BannerCarousel.jsx";

// 메인 분류 목록
const mainCategories = [
    { label: "추천상품", id: "RECOMMENDED_PRODUCTS", description: "Recommended" },
    { label: "케이크별 분류", id: "CAKE_BY_CATEGORY", description: "By Category" },
    { label: "매장별 분류", id: "STORE_BY_CATEGORY", description: "Find Shops" }
];

// assets 폴더에서 바로 import
import banner1 from "../../../assets/banner1.jpg";
import banner2 from "../../../assets/banner2.jpg";
import banner3 from "../../../assets/banner3.jpg";
import banner4 from "../../../assets/banner4.jpg";
import PickupScheduler from "../../../components/scheduler/PickupScheduler.jsx";

function CakeAllList() {

    const banners = [
        { imageUrl: banner1, link: "/event/lottery",  alt: "100% 당첨 랜덤 복권" },
        { imageUrl: banner2, link: "/event/sale",     alt: "케이크 세일 이벤트" },
        { imageUrl: banner3, link: "/event/cookie",   alt: "프리미엄 쿠키 출시" },
        { imageUrl: banner4, link: "/event/birthday", alt: "생일 쿠폰 이벤트" },
    ];
    // 상품 목록 관련 상태
    const [cakes, setCakes] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // 카테고리 선택 상태
    const [selectedMainCategory, setSelectedMainCategory] = useState("RECOMMENDED_PRODUCTS");
    const [selectedDetailKeyword, setSelectedDetailKeyword] = useState("LETTERING");

    // 추천상품 정렬 기준
    const [selectedSort, setSelectedSort] = useState("regDate,desc"); // 기본값: 최신순

    // 매장 관련 상태
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("shopId");
    const [keyword, setKeyword] = useState("");

    const [pickupScheduleInfo, setPickupScheduleInfo] = useState(null);

    // API 호출을 위한 단일 useEffect
    // mainCategory, detailKeyword, page가 변경될 때마다 실행
    useEffect(() => {
        // '매장별 분류' 카테고리는 케이크 목록을 불러오지 않으므로 실행 중단
        if (selectedMainCategory === "STORE_BY_CATEGORY") {
            return;
        }

        // 더 이상 불러올 데이터가 없거나, 이미 로딩 중이면 실행 중단
        // 첫 페이지 로딩(page === 1)은 항상 허용
        if (!hasNext && page > 1) {
            return;
        }
        if (isLoading) {
            return;
        }

        setIsLoading(true);

        const fetchKeyword =
            selectedMainCategory === "CAKE_BY_CATEGORY"
                ? selectedDetailKeyword
                : undefined;

        const fetchCakes = async () => {
            try {
                const data = await getAllCakeList({ page, keyword: fetchKeyword, sort: selectedSort, size: 20 });

                // 페이지가 1이면(새로운 카테고리/키워드 선택 시) 목록을 초기화
                // 페이지가 1보다 크면(무한 스크롤) 기존 목록에 추가
                setCakes(prevCakes => page === 1 ? data.content : [...prevCakes, ...data.content]);
                setHasNext(data.hasNext);

            } catch (err) {
                console.error("케이크 목록 불러오기 실패", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCakes();

    }, [page, selectedMainCategory, selectedDetailKeyword, selectedSort]);


    // 카테고리 변경 시 상태 초기화
    // 이 useEffect는 카테고리/키워드 변경 시 page를 1로 재설정하는 역할만 수행
    useEffect(() => {
        // '매장별 분류'로 전환되면 케이크 목록 상태를 초기화하지 않음
        if (selectedMainCategory === "STORE_BY_CATEGORY") return;

        // 카테고리나 키워드가 변경되면 페이지와 목록을 초기화
        // 이렇게 하면 위 fetch useEffect가 page=1로 다시 실행됨
        setPage(1);
        setCakes([]);
        setHasNext(true);

    }, [selectedMainCategory, selectedDetailKeyword, selectedSort]);


    // 스크롤 이벤트 핸들러 (무한 스크롤 트리거)
    useEffect(() => {
        // '매장별 분류'에서는 스크롤 이벤트를 감지하지 않음
        if (selectedMainCategory === "STORE_BY_CATEGORY") return;

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            // 스크롤이 바닥에서 300px 이내로 남았고, 더 불러올 데이터가 있으며, 현재 로딩 중이 아닐 때
            if (scrollTop + windowHeight >= docHeight - 300 && hasNext && !isLoading) {
                // 다음 페이지를 요청
                setPage(prevPage => prevPage + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => window.removeEventListener("scroll", handleScroll);

    }, [hasNext, isLoading, selectedMainCategory]);

    const handlePickupSchedulerComplete = (scheduleInfo) => {
        console.log("픽업 스케줄러에서 선택된 정보:", scheduleInfo);
        setPickupScheduleInfo(scheduleInfo); // 상태에 저장 (필요하다면)
        // 여기서는 매장 상세 페이지로 이동하는 로직은 PickupScheduler 내부에서 처리하므로,
        // 이 콜백에서는 추가적인 라우팅 없이 정보를 받기만 합니다.
    };


    return (
        <div className="flex flex-col min-h-screen">
            {/* BannerCarousel에 최대 너비와 패딩 적용 */}
            <div className="container mx-auto px-4">
                <BannerCarousel banners={banners} interval={5000} />
            </div>
            <main className="flex-grow container mx-auto px-6 py-8">
                <div className="mb-8"> {/* 아래 내용과의 간격을 위해 마진 추가 */}
                    <PickupScheduler onComplete={handlePickupSchedulerComplete} />
                </div>

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
                                if (mainCat.id === "RECOMMENDED_PRODUCTS") {
                                    setSelectedSort("regDate,desc");
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

                {/* 추천상품 정렬 버튼 */}
                {selectedMainCategory === "RECOMMENDED_PRODUCTS" && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button
                            className={`px-4 py-1 rounded-md text-sm font-medium ${selectedSort === "regDate,desc" ? "text-black" : "text-gray-400 hover:text-black"}`}
                            onClick={() => setSelectedSort("regDate,desc")}
                        >
                            최신순
                        </button>
                        <button
                            className={`px-4 py-1 rounded-md text-sm font-medium ${selectedSort === "viewCount,desc" ? "text-black" : "text-gray-400 hover:text-black"}`}
                            onClick={() => setSelectedSort("viewCount,desc")}
                        >
                            조회순
                        </button>
                        <button
                            className={`px-4 py-1 rounded-md text-sm font-medium ${selectedSort === "orderCount,desc" ? "text-black" : "text-gray-400 hover:text-black"}`}
                            onClick={() => setSelectedSort("orderCount,desc")}
                        >
                            주문순
                        </button>
                    </div>
                )}

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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
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
                        {!hasNext && cakes.length > 0 && (
                            <div className="text-center text-gray-400 text-sm mt-8">
                                모든 상품을 불러왔습니다.
                            </div>
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