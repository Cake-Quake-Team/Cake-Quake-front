import {useEffect, useState} from "react";
import {getCakeDetail, API_SERVER_HOST, deleteCake} from "../../../api/cakeApi.jsx";
import {List} from "lucide-react";
import CakeDetailComponent from "../../../components/cake/itemComponents/cakeDetailComponent.jsx";
import {Link, useNavigate, useParams} from "react-router";
import CakeOptionList from "../../../components/cake/optionComponents/optionListComponent.jsx";

function SellerCakeReadPage() {
    const { shopId, cakeId } = useParams();
    const navigate = useNavigate();
    const [cake, setCake] = useState(null); // 케이크 상세 정보
    const [optionTypes, setOptionTypes] = useState([]); // 병합된 최종 옵션 타입 데이터 (CakeDetailComponent로 전달)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 옵션 상태

    const fetchCakeDetail = async () => {
        if (!cakeId) {
            setError("케이크 ID가 제공되지 않았습니다.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);

            const data = await getCakeDetail(shopId, cakeId); // 백엔드에서 cakeDetailDTO와 options를 모두 받아옴
            setCake(data);

            // 백엔드에서 받은 options 데이터를 기반으로 optionTypes를 직접 구성
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

                // 객체를 배열로 변환
                setOptionTypes(Object.values(groupedOptions));
            } else {
                setOptionTypes([]); // 옵션 데이터가 없으면 빈 배열로 설정
            }

        } catch (err) {
            console.error("케이크 상세 정보를 불러오는 데 실패했습니다:", err);
            setError("케이크 상세 정보를 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 초기 로딩 및 URL 변경 감지
    useEffect(() => {

        // URL에서 수정 페이지에서 온 것인지 확인
        const isFromUpdate = location.state?.fromUpdate || false;

        // 수정 페이지에서 온 경우 강제 새로고침
        fetchCakeDetail(isFromUpdate);

        // location.state 초기화 (뒤로가기 시 재실행 방지)
        if (isFromUpdate) {
            window.history.replaceState({}, document.title);
        }
    }, [cakeId, location.pathname]);

    // 페이지 포커스 시 데이터 새로고침 (탭 전환 후 돌아왔을 때)
    useEffect(() => {
        const handleFocus = () => {
            console.log('페이지 포커스 - 데이터 새로고침');
            fetchCakeDetail(true);
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [cakeId]);

    // 전체 로딩 상태 및 에러 메시지 처리
    if (loading) { // 케이크 정보 로딩에 옵션 정보 로딩도 포함
        return (
            <div className="text-center py-8 text-gray-500">
                상품 정보를 불러오는 중...
            </div>
        );
    }

    if (error) { // 케이크 정보 로딩 중 에러 발생 시
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

// '삭제' 버튼 클릭 핸들러
    const handleDelete = async () => {
        if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
            try {
                await deleteCake(cakeId);
                alert("상품이 삭제되었습니다.");
                navigate(`/shops/${shopId}/cakes/list`);
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
                    {shopId && (
                        <Link
                            to={`/shops/${shopId}/cakes/list`}
                            className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-md hover:text-gray-500 transition-colors duration-200"
                            title="목록으로"
                        >
                            <List size={30}/>
                        </Link>
                    )}

                    <h1 className="text-2xl font-semibold">상품 상세 조회</h1>
                </div>
                <hr className="mb-6 w-1/4 mx-auto"/>

                {/* CakeDetailComponent에 props 전달 */}
                <CakeDetailComponent
                    cake={cake} // cake 전체 객체를 전달
                    optionTypes={optionTypes} // 새로 가공된 optionTypes 전달
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    apiBaseUrl={API_SERVER_HOST} // 이미지 경로를 위해 API_SERVER_HOST 전달
                    OptionComponent={CakeOptionList}
                />
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleDelete}
                        className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                    >
                        삭제
                    </button>
                    {shopId && (
                        <Link
                            to={`/shops/${shopId}/cakes/update/${cakeId}`}
                            className="ml-5 bg-black text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                            수정
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SellerCakeReadPage;