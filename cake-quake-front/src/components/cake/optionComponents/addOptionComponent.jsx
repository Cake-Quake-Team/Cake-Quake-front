import React from 'react';

const formatNumberWithCommas = (value) => {
    if (value === '' || value === undefined || value === null) {
        return '';
    }
    const numericValue = value.toString().replace(/,/g, '');
    if (isNaN(numericValue)) {
        return '';
    }
    return Number(numericValue).toLocaleString('ko-KR');
};

function OptionAdd({
                       optionItems = [],
                       selectedOptionTypeId,
                       setSelectedOptionTypeId,
                       existingOptionTypes = [],
                       newOptionTypeName,
                       showNewOptionTypeInput,
                       handleSubmit,
                       handleOptionItemChange,
                       handleAddOptionItem,
                       handleRemoveOptionItem,
                       handleRegisterOptionType,
                       setSelectedOptionType,
                       setShowNewOptionTypeInput,
                       setNewOptionTypeName,
                       handleToggleNewOptionTypeInput,
                       handleToList
                   }) {

    const handleFormattedOptionItemChange = (index, field, value) => {
        if (field === 'price') {
            const rawValue = value.replace(/,/g, '');
            handleOptionItemChange(index, field, rawValue);
        } else {
            handleOptionItemChange(index, field, value);
        }
    };

    return (
        <div className="max-w-xl mx-auto my-6 p-6 bg-white rounded-xl border border-gray-200 shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-gray-200 text-center">
                옵션 등록
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-8 p-6 border-b border-dashed border-gray-300">
                    <h3 className="text-xl text-gray-700 mb-4">옵션 타입</h3>
                    <div className="flex items-center gap-10 mb-2">
                        <select
                            className="flex-grow p-2 border border-gray-300 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={selectedOptionTypeId || ''}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const selected = existingOptionTypes.find(t => t.optionTypeId === selectedId);
                                setSelectedOptionTypeId(selectedId);
                                setSelectedOptionType(selected.optionType);
                                setShowNewOptionTypeInput(false);
                            }}
                        >
                            <option value="">-- 옵션 타입을 선택하세요 --</option>
                            {existingOptionTypes.map((type) => (
                                <option key={type.optionTypeId} value={type.optionTypeId}>
                                    {type.optionType}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleToggleNewOptionTypeInput}
                            className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200 whitespace-nowrap"
                        >
                            + 새 옵션 타입 등록
                        </button>
                    </div>

                    {showNewOptionTypeInput && (
                        <div className="flex items-center gap-3 mt-4 pl-1">
                            <input
                                type="text"
                                placeholder="새 옵션 타입명을 입력하세요"
                                value={newOptionTypeName}
                                onChange={(e) => setNewOptionTypeName(e.target.value)}
                                className="flex-grow p-2 border border-gray-300 rounded-md text-base text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            />
                            <button
                                type="button"
                                onClick={handleRegisterOptionType}
                                className="px-5 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-base hover:bg-gray-300 transition-colors duration-200 whitespace-nowrap"
                            >
                                등록
                            </button>
                        </div>
                    )}
                </div>

                <div className="mb-10">
                    <h3 className="text-xl text-gray-700 mb-4">옵션 값</h3>
                    {optionItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 mb-3">
                            {optionItems.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOptionItem(index)}
                                    className="w-6 h-6 flex-shrink-0 flex items-center justify-center border-2 border-secondary-color rounded-full text-sm text-gray-500 hover:bg-gray-100 transition duration-200"
                                    title="옵션 제거"
                                >
                                    &minus;
                                </button>
                            )}
                            <input
                                type="text"
                                placeholder="옵션명을 입력하세요"
                                value={item.name}
                                onChange={(e) => handleOptionItemChange(index, 'name', e.target.value)}
                                className="flex-[2] p-2 border border-gray-300 rounded-md text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="가격"
                                    value={formatNumberWithCommas(item.price)}
                                    onChange={(e) => handleFormattedOptionItemChange(index, 'price', e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 rounded-md text-base text-gray-700 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="text-base text-gray-600 whitespace-nowrap">원</span>
                            </div>
                        </div>
                    ))}

                    <div className="border-t border-gray-200 bg-white">
                        <button
                            type="button"
                            onClick={handleAddOptionItem}
                            className="text-sm text-gray-400 py-2 px-4 flex items-center hover:underline"
                        >
                            <span className="mr-1">[+]</span> 옵션 추가
                        </button>
                    </div>
                </div>

                <div className="mt-30 flex justify-center gap-3">
                    <button
                        type="button"
                        className="mt-6 border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                        onClick={handleToList}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="mt-6 ml-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
}

export default OptionAdd;
