import {Link, useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {getAllCakeList, getOptionItems, getOptionTypes} from "../../api/cakeApi.jsx";
import CakeCard from "../../components/cake/itemComponents/cakeCard.jsx";
import CakeOptionList from "../../components/cake/optionComponents/optionListComponent.jsx";
import SellerShopDetail from "../../components/shop/sellerShopDetail.jsx";

// 메인 분류 목록
const shopCategories = [
    { label: "매장 관리", id: "SHOP_MANAGEMENT" },
    { label: "상품 관리", id: "CAKE_MANAGEMENT" },
    { label: "옵션 관리", id: "OPTION_MANAGEMENT" }
];

export default function ShopManagement() {

    const [cakes, setCakes] = useState([]);
    const [page] = useState(1);
    const [selectedShopCategory, setSelectedShopCategory] = useState("SHOP_MANAGEMENT");

    {/*상품 관리 목록 가져오기*/}
    useEffect(() => {
        // 지금은 레터링케이크 카테고리에 맞는 케이크만 나옴. 매장별 상품 목록으로 바꿔야 함
        getAllCakeList({page})
            .then(data => {setCakes(data.content);})
            .catch(err => {console.error("케이크 목록 불러오기 실패", err);
            });
    }, [page]);

    const {shopId} = useParams();
    const [optionTypes, setOptionTypes] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    {/*옵션 관리 목록 가져오기*/}
    useEffect(() => {
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
    }, [shopId]);

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
                        cakes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {cakes.map(cake => (
                                    <Link to={`cakes/read/${cake.cakeId}`}>
                                        <CakeCard key={cake.cakeId} cake={cake}/>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 text-lg mt-10">
                                선택하신 분류에 해당하는 케이크가 없습니다. 🍰
                            </div>
                        ))}
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