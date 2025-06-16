import React from "react";

function CakeOptionForm({ optionTypes = [], selectedOptions, setSelectedOptions }) {

    const toggleOptionValue = (optionTypeId, optionItemId) => {
        setSelectedOptions(prev => {
            const isSelected = prev.some(
                (item) => item.optionTypeId === optionTypeId && item.optionItemId === optionItemId
            );

            let newSelectedOptions;
            if (isSelected) {
                // 선택 해제: 해당 아이템 제거
                newSelectedOptions = prev.filter(
                    (item) => !(item.optionTypeId === optionTypeId && item.optionItemId === optionItemId)
                );
            } else {
                // 선택: optionTypes에서 해당 아이템 정보를 찾아 추가
                const itemToAdd = optionTypes
                    .find(type => type.optionTypeId === optionTypeId) // 해당 타입 찾기
                    ?.optionItems.find(item => item.optionItemId === optionItemId); // 해당 아이템 찾기

                if (itemToAdd) {
                    // 모든 정보 (optionItemId, optionName, price, optionTypeId)를 포함하여 추가
                    newSelectedOptions = [...prev, {
                        optionItemId: itemToAdd.optionItemId,
                        optionName: itemToAdd.optionName,
                        price: itemToAdd.price,
                        optionTypeId: optionTypeId
                    }];
                } else {
                    newSelectedOptions = prev; // 찾지 못하면 변화 없음
                }
            }
            return newSelectedOptions;
        });
    };

    return (
        <div className="my-6 space-y-4">
            <label className="block text-gray-700 font-medium">옵션 선택</label>

            {optionTypes.length === 0 ? (
                <p className="text-gray-500 italic p-2 bg-gray-50 rounded-md">
                    옵션 정보가 없습니다. 관리자에게 문의하세요. 🥲
                </p>
            ) : (
                <div className="border border-gray-300 rounded-md p-4">
                    {optionTypes.map((optionType) => (
                        <details key={optionType.optionTypeId} className="mb-2">
                            <summary className="flex justify-between items-center py-2 cursor-pointer text-gray-700 font-normal border-b border-gray-200">
                                <span>{optionType.optionType}</span>
                                <svg className="h-5 w-5 text-gray-500 transform transition-transform duration-200 ui-open:rotate-180"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>

                            <div className="py-3 px-2 bg-white">
                                {Array.isArray(optionType.optionItems) && optionType.optionItems.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {optionType.optionItems.map((optionItem) => (
                                            <label
                                                key={`${optionType.optionTypeId}_${optionItem.optionItemId}`}
                                                className="inline-flex items-center space-x-3 cursor-pointer p-3 border border-gray-300 rounded-md hover:bg-blue-50 transition-colors duration-150"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedOptions.some(
                                                            (selected) =>
                                                                selected.optionTypeId === optionType.optionTypeId &&
                                                                selected.optionItemId === optionItem.optionItemId
                                                        )
                                                    }
                                                    onChange={() =>
                                                        toggleOptionValue(optionType.optionTypeId, optionItem.optionItemId)
                                                    }
                                                    className="form-checkbox h-4 w-4 text-gray-500 focus:ring-gray-300 rounded"
                                                />
                                                <span className="text-gray-700 font-light flex-grow">
                                                {optionItem.optionName} <span className="text-gray-400">({optionItem.price.toLocaleString()}원)</span>
                                            </span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 p-2">선택 가능한 옵션이 없습니다.</p>
                                )}
                            </div>
                        </details>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CakeOptionForm;