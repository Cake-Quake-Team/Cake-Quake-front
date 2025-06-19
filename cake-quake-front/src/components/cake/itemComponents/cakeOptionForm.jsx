import React, { useState } from "react";

function CakeOptionForm({ optionTypes = [], selectedOptions, setSelectedOptions }) {
    const [errorOptionTypeIds, setErrorOptionTypeIds] = useState([]); // 최대 초과 옵션

    const toggleOptionValue = (optionTypeId, optionItemId, maxSelection) => {
        setSelectedOptions(prev => {
            const isSelected = prev.some(
                (item) => item.optionTypeId === optionTypeId && item.optionItemId === optionItemId
            );

            let newSelectedOptions;
            if (isSelected) {
                // 선택 해제
                newSelectedOptions = prev.filter(
                    (item) => !(item.optionTypeId === optionTypeId && item.optionItemId === optionItemId)
                );
                setErrorOptionTypeIds(prev => prev.filter(id => id !== optionTypeId));
            } else {
                const countForType = prev.filter(item => item.optionTypeId === optionTypeId).length;
                if (countForType >= maxSelection) {
                    // 최대 초과 시 에러 표시
                    if (!errorOptionTypeIds.includes(optionTypeId)) {
                        setErrorOptionTypeIds(prev => [...prev, optionTypeId]);
                    }
                    return prev;
                }

                const itemToAdd = optionTypes
                    .find(type => type.optionTypeId === optionTypeId)
                    ?.optionItems.find(item => item.optionItemId === optionItemId);

                if (itemToAdd) {
                    newSelectedOptions = [...prev, {
                        optionItemId: itemToAdd.optionItemId,
                        optionName: itemToAdd.optionName,
                        price: itemToAdd.price,
                        optionTypeId: optionTypeId
                    }];
                } else {
                    newSelectedOptions = prev;
                }
            }
            return newSelectedOptions;
        });
    };

    return (
        <div className="my-6 px-4 md:px-0 max-w-xl mx-auto space-y-4">
            {optionTypes.length === 0 ? (
                <p className="text-gray-500 italic p-2 bg-gray-50 rounded-md">
                    옵션 정보가 없습니다. 관리자에게 문의하세요. 🥲
                </p>
            ) : (
                <div className="space-y-4">
                    {optionTypes.map((optionType) => {
                        const isMaxExceeded = errorOptionTypeIds.includes(optionType.optionTypeId);
                        return (
                            <div
                                key={optionType.optionTypeId}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                                <details>
                                    <summary className="flex justify-between items-center py-3 px-4 cursor-pointer text-gray-700 font-medium bg-gray-50 border-b border-gray-200">
                                        <span className="flex items-center text-lg">
                                            {optionType.optionType}
                                            <span className="text-gray-500 text-xs ml-2">
                                                {optionType.isRequired && `*필수선택 (최소 ${optionType.minSelection}개)`}
                                            </span>
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
                                            <div className="divide-y divide-gray-200">
                                                {optionType.optionItems.map((optionItem) => {
                                                    const isChecked = selectedOptions.some(
                                                        (selected) =>
                                                            selected.optionTypeId === optionType.optionTypeId &&
                                                            selected.optionItemId === optionItem.optionItemId
                                                    );

                                                    const overMax =
                                                        optionType.maxSelection &&
                                                        selectedOptions.filter(
                                                            (item) => item.optionTypeId === optionType.optionTypeId
                                                        ).length >= optionType.maxSelection;

                                                    return (
                                                        <label
                                                            key={`${optionType.optionTypeId}_${optionItem.optionItemId}`}
                                                            className="flex justify-between items-center py-2 px-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    disabled={!isChecked && overMax}
                                                                    onChange={() =>
                                                                        toggleOptionValue(
                                                                            optionType.optionTypeId,
                                                                            optionItem.optionItemId,
                                                                            optionType.maxSelection
                                                                        )
                                                                    }
                                                                    className="form-checkbox h-4 w-4 text-gray-500 focus:ring-gray-300 rounded"
                                                                />
                                                                <span className="text-gray-700 font-light">
                                                                    {optionItem.optionName}
                                                                </span>
                                                            </div>
                                                            <span className="text-gray-500 font-normal ml-2">
                                                                {optionItem.price.toLocaleString()}원
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 p-4 text-center">
                                                선택 가능한 옵션이 없습니다.
                                            </p>
                                        )}

                                        {isMaxExceeded && (
                                            <p className="text-sm text-red-500 px-4 py-2 font-medium">
                                                ⚠ 최대 선택 개수를 초과하였습니다.
                                            </p>
                                        )}
                                    </div>
                                </details>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default CakeOptionForm;
