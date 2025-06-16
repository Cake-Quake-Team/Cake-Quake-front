import { useEffect, useState, useMemo } from "react";
import {getCakeDetail, getOptionTypes, getOptionItems, API_SERVER_HOST, deleteCake} from "../../api/cakeApi.jsx";
import { List } from "lucide-react";
import CakeDetailComponent from "../../components/cake/cakeDetailComponent";
import {Link, useNavigate, useParams} from "react-router";

function SellerCakeReadPage() {
    const { cakeId } = useParams();
    const navigate = useNavigate();
    const [cake, setCake] = useState(null); // 케이크 상세 정보
    const [optionTypes, setOptionTypes] = useState([]); // 병합된 최종 옵션 타입 데이터 (CakeDetailComponent로 전달)
    const [loading, setLoading] = useState(true);
    const [optionsLoading, setOptionsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [optionsError, setOptionsError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({}); // 선택된 옵션 상태

    const shopId = 3; // 바꿔야됨

    // 케이크 상세 정보를 가져오는 useEffect
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

            } catch (err) {
                console.error("케이크 상세 정보를 불러오는 데 실패했습니다:", err);
                setError("케이크 상세 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchCakeDetail();
    }, [cakeId, shopId]);

    // 케이크의 options에 있는 optionTypeId를 추출
    const cakeRelevantOptionTypeIds = useMemo(() => {
        const ids = cake?.options?.map(item => item.optionTypeId);
        const setIds = new Set(ids);
        return setIds;
    }, [cake?.options]);

    const cakeRelevantOptionItemIds = useMemo(() => {
        const itemIds = cake?.options?.map(item => item.optionItemId);
        const setItemIds = new Set(itemIds);
        return setItemIds;
    }, [cake?.options]);

    // 옵션 타입과 아이템 정보를 가져오고 병합하는 useEffect
    useEffect(() => {
        // cakeId와 shopId가 모두 있어야 옵션 정보를 가져올 수 있습니다.
        if (!cakeId || !shopId || !cake) {
            setOptionsLoading(false); // 초기 로딩 상태 설정
            return;
        }

        const fetchAndMergeOptions = async () => {
            setOptionsLoading(true); // 옵션 로딩 시작
            setOptionsError(null);     // 옵션 에러 초기화

            try {
                // api에서 임포트한 함수들을 사용
                const fetchedOptionTypes = await getOptionTypes(shopId);
                const fetchedOptionItems = await getOptionItems(shopId);

                let mergedOptionTypes = fetchedOptionTypes.map(type => {
                    // 해당 옵션 타입에 속하는 'shop의 모든 옵션 아이템'을 가져옵니다.
                    const allShopItemsForThisType = fetchedOptionItems.filter(item =>
                        item.optionTypeId === type.optionTypeId
                    );

                    // 새로 추가된 필터링: 이 케이크에 연결된 optionItemId만 필터링합니다.
                    const cakeSpecificOptionItems = allShopItemsForThisType.filter(shopItem =>
                        cakeRelevantOptionItemIds.has(shopItem.optionItemId)
                    );

                    return {
                        optionTypeId: type.optionTypeId,
                        optionType: type.optionType,
                        optionItem: cakeSpecificOptionItems.map(item => ({
                            optionItemId: item.optionItemId,
                            optionName: item.optionName,
                            price: item.price
                        }))
                    };
                });

                // cake의 options에 있는 optionTypeId에 해당하는 타입만 필터링
                mergedOptionTypes = mergedOptionTypes.filter(typeGroup =>
                    cakeRelevantOptionTypeIds.has(typeGroup.optionTypeId)
                );

                setOptionTypes(mergedOptionTypes);
            } catch (err) {
                console.error("옵션 데이터 불러오기 실패:", err);
                setOptionsError("옵션 정보를 불러오는 데 실패했습니다.");
            } finally {
                setOptionsLoading(false);
            }
        };

        fetchAndMergeOptions();
    }, [cake, shopId, cakeRelevantOptionTypeIds]);

    // 전체 로딩 상태 및 에러 메시지 처리
    if (loading || optionsLoading) { // 케이크 정보 또는 옵션 정보 중 하나라도 로딩 중이면
        return (
            <div className="text-center py-8 text-gray-500">
                {loading ? "상품 정보를 불러오는 중..." : "옵션 정보를 불러오는 중..."}
            </div>
        );
    }

    if (error || optionsError) { // 케이크 정보 또는 옵션 정보 로딩 중 에러 발생 시
        return <div className="text-center py-8 text-red-500">{error || optionsError}</div>;
    }

    // '삭제' 버튼 클릭 핸들러
    const handleDelete = async () => {
        if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
            try {
                await deleteCake(shopId, cakeId);
                alert("상품이 삭제되었습니다.");
                navigate("/seller/cakes/list");
            } catch (err) {
                console.error("상품 삭제 실패:", err);
                alert("상품 삭제에 실패했습니다.");
            }
        }
    };

    return (
        <div>
            <div className="container mx-auto px-6 py-10">
                <div className="flex items-center justify-center relative mb-3">
                <Link
                    to="/seller/cakes/list"
                    className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-md hover:text-gray-500 transition-colors duration-200"
                    title="목록으로"
                >
                    <List size={30} />
                </Link>

                <h1 className="text-2xl font-semibold">상품 상세 조회</h1>
                </div>
                <hr className="mb-6 w-1/4 mx-auto"/>

                {/* CakeDetailComponent에 props 전달 */}
                <CakeDetailComponent
                    cake={cake}
                    optionTypes={optionTypes}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    apiBaseUrl={API_SERVER_HOST} // 이미지 경로를 위해 API_SERVER_HOST 전달
                />
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleDelete}
                            className="mt-6 border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                        >
                            삭제
                        </button>
                        <Link
                            to={`/seller/cakes/update/${cakeId}`}
                            className="mt-6 ml-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                            수정
                        </Link>
                    </div>
            </div>
        </div>
    );
}

export default SellerCakeReadPage;