import { useEffect, useState } from "react";
import {getCakeDetail, API_SERVER_HOST} from "../../../api/cakeApi.jsx";
import { List } from "lucide-react";
import CakeDetailComponent from "../../../components/cake/itemComponents/cakeDetailComponent.jsx";
import {Link, useParams} from "react-router";
import CakeOptionForm from "../../../components/cake/itemComponents/cakeOptionForm.jsx";

function BuyerCakeReadPage() {
    const { shopId, cakeId } = useParams();
    const [cake, setCake] = useState(null); // 케이크 상세 정보
    const [optionTypes, setOptionTypes] = useState([]); // 병합된 최종 옵션 타입 데이터 (CakeDetailComponent로 전달)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 옵션 상태

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

                const data = await getCakeDetail(shopId, cakeId); // 백엔드에서 cakeDetailDTO와 options를 모두 받아옴
                setCake(data);

                // 백엔드에서 받은 options 데이터를 기반으로 optionTypes를 직접 구성
                if (data && data.options) {
                    const groupedOptions = data.options.reduce((acc, currentOption) => {
                        // optionTypeId를 기준으로 그룹화 (백엔드에서 받은 값 활용)
                        const typeId = currentOption.optionTypeId;
                        const typeName = currentOption.optionTypeName || `알 수 없는 옵션 타입 ${typeId}`;

                        if (!acc[typeId]) {
                            acc[typeId] = {
                                optionTypeId: typeId,
                                optionType: typeName,
                                isRequired: currentOption.isRequired,
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

        fetchCakeDetail();
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

    return (
        <div>
            <div className="container mx-auto px-6 py-10">
                <div className="flex items-center justify-center relative mb-3">
                    <Link
                        to="/buyer"
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
                    OptionComponent={CakeOptionForm}
                />
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => console.log("장바구니 담기")}
                            className="min-w-[120px] text-sm border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                        >
                            장바구니 담기
                        </button>
                        <button
                            onClick={() => console.log("결제하기")}
                            className="min-w-[120px] text-sm ml-5 bg-black text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                            결제하기
                        </button>
                    </div>
            </div>
        </div>
    );
}

export default BuyerCakeReadPage;