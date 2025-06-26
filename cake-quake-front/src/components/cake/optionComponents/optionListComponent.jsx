import React from "react";
import {Link} from "react-router";
import {useAuth} from "../../../store/AuthContext.jsx";

function CakeOptionList({ optionTypes = [] }) {

    const {user} = useAuth()

    return (
        <div className="my-6 px-4 md:px-0 max-w-6xl mx-auto space-y-4">
            {optionTypes.length === 0 ? (
                <p className="text-gray-500 italic p-2 bg-gray-50 rounded-md">
                    옵션 정보가 없습니다. 관리자에게 문의하세요. 🥲
                </p>
            ) : (
                <div className="space-y-4">
                    {optionTypes.map((optionType) => (
                        <div
                            key={optionType.optionTypeId}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                            <details>
                                <summary className="flex justify-between items-center py-3 px-4 cursor-pointer text-gray-700 font-medium bg-gray-50 border-b border-gray-200">
                  <span className="flex items-center text-lg">
                    {optionType.optionType}
                      <Link
                          to={`/shops/${user.shopId}/options/read/${optionType.optionTypeId}`}
                          className="text-orange-300 text-sm ml-4 hover:underline"
                      >
                      상세보기&gt;
                    </Link>
                  </span>
                                    <svg
                                        className="h-5 w-5 text-gray-500 transform transition-transform duration-200 ui-open:rotate-180"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </summary>

                                <div className="bg-white">
                                    {Array.isArray(optionType.optionItems) &&
                                    optionType.optionItems.length > 0 ? (
                                        <div className="divide-y divide-gray-200"> {/* 각 항목 사이에 구분선 추가 */}
                                            {optionType.optionItems.map((optionItem) => (
                                                <label
                                                    key={`${optionType.optionTypeId}_${optionItem.optionItemId}`}
                                                    className="flex justify-between items-center py-2 px-4 transition-colors duration-150"
                                                >
                          <span className="text-gray-700 font-light flex-grow">
                            {optionItem.optionName}
                          </span>
                                                    <span className="text-gray-500 font-normal ml-2"> {/* 가격 색상 변경 및 간격 조정 */}
                                                        {optionItem.price.toLocaleString()}원
                          </span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 p-4 text-center">
                                            선택 가능한 옵션이 없습니다.
                                        </p>
                                    )}
                                </div>

                                {/* 옵션 추가 버튼 */}
                                <div className="border-t border-gray-200 bg-white">
                                    <Link
                                        to={`/shops/${optionType.shopId}/options/add`}
                                        className="text-sm text-gray-400 py-2 px-4 flex items-center hover:underline">
                                        <span className="mr-1">[+]</span> 옵션 추가
                                    </Link>
                                </div>
                            </details>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CakeOptionList;