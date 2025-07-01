import React from 'react';

// toLocaleString()으로 숫자를 쉼표 형식으로 변환하는 함수
// 입력값은 숫자나 문자열이 될 수 있으므로, 숫자만 추출합니다.
const formatNumberWithCommas = (value) => {
    if (value === '' || value === undefined || value === null) {
        return '';
    }
    // 숫자만 남기고, 쉼표 등 제거
    const numericValue = value.toString().replace(/,/g, '');
    if (isNaN(numericValue)) {
        return ''; // 숫자가 아니면 빈 문자열 반환
    }
    // Number()로 변환 후 toLocaleString()으로 포맷팅
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

    // **주의: handleOptionItemChange 함수를 컴포넌트 내부에서 수정합니다.**
    const handleFormattedOptionItemChange = (index, field, value) => {
        if (field === 'price') {
            // 입력값에서 쉼표 제거 후 숫자만 상태에 저장
            const rawValue = value.replace(/,/g, '');
            // 부모 컴포넌트의 handleOptionItemChange를 호출
            handleOptionItemChange(index, field, rawValue);
        } else {
            handleOptionItemChange(index, field, value);
        }
    };

    return (
        <div className="card w-full max-w-4xl mx-auto my-8 p-6 md:p-10">
            {/* 2. 제목 스타일을 `common.css`에서 정의한 스타일로 변경 */}
            <h2 className="text-center mb-8 font-heading text-secondary-color text-3xl">
                옵션 등록
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-8 pb-6 border-b border-dashed border-gray-300">
                    <h3 className="text-xl text-gray-700 mb-4">옵션 타입</h3>
                    <div className="flex flex-col sm:flex-row items-end gap-4">
                        {/* 3. select 필드에 커스텀 스타일 클래스 제거 (common.css에서 자동 적용됨) */}
                        <select
                            className="w-full sm:flex-1"
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
                        {/* 4. 새 옵션 타입 등록 버튼에 `btn-secondary` 커스텀 클래스 적용 */}
                        <button
                            type="button"
                            onClick={handleToggleNewOptionTypeInput}
                            className="btn-secondary w-full sm:w-auto whitespace-nowrap py-3 px-5 text-sm"
                        >
                            + 새 옵션 타입 등록
                        </button>
                    </div>

                    {showNewOptionTypeInput && (
                        <div className="flex items-center gap-3 mt-4 pl-1">
                            {/* 5. input 필드에 커스텀 스타일 클래스 제거 */}
                            <input
                                type="text"
                                placeholder="새 옵션 타입명을 입력하세요"
                                value={newOptionTypeName}
                                onChange={(e) => setNewOptionTypeName(e.target.value)}
                                className="flex-grow"
                            />
                            {/* 6. 등록 버튼에 `btn-secondary` 또는 적절한 스타일 적용 */}
                            <button
                                type="button"
                                onClick={handleRegisterOptionType}
                                className="btn-secondary whitespace-nowrap py-2 px-5 text-base"
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
                            {/* 7. input 필드에 커스텀 스타일 클래스 제거 */}
                            <input
                                type="text"
                                placeholder="옵션명을 입력하세요"
                                value={item.name}
                                onChange={(e) => handleOptionItemChange(index, 'name', e.target.value)}
                                className="flex-1"
                            />
                            {/* 8. 가격 입력 필드 및 '원' 텍스트 정렬 수정 */}
                            <div className="flex items-center gap-2">
                                {/* '가격' input 필드에 포맷팅 로직 적용 */}
                                <input
                                    type="text" // 타입을 "text"로 변경
                                    placeholder="가격"
                                    value={formatNumberWithCommas(item.price)} // 표시될 값에 포맷팅 적용
                                    onChange={(e) => handleFormattedOptionItemChange(index, 'price', e.target.value)} // onChange 핸들러 변경
                                    className="w-28 text-right"
                                />
                                <span className="text-base text-gray-600 whitespace-nowrap">원</span>
                            </div>
                        </div>
                    ))}

                    {/* 9. [+] 옵션 추가 버튼 최종 수정 */}
                    <div className="border-t border-gray-200 pt-4 mt-6">
                        <button
                            type="button"
                            onClick={handleAddOptionItem}
                            className="btn-ghost flex items-center hover:underline px-0 py-0"
                        >
                            <span className="text-primary-color text-lg font-bold mr-1">[+]</span>
                            <span className="text-sm text-gray-400 font-semibold whitespace-nowrap">옵션 추가</span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-center md:justify-end gap-4 mt-12">
                    {/* 10. `btn-ghost`와 `btn-primary` 클래스 적용 */}
                    <button type="button" onClick={handleToList} className="btn-ghost w-full sm:w-auto">
                        취소
                    </button>
                    <button type="submit" className="btn-primary w-full sm:w-auto">
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
}

export default OptionAdd;