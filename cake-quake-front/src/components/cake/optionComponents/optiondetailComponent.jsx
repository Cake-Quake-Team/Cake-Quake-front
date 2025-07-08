import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AlertModal from "../../common/AlertModal.jsx"; // PropTypes를 사용하여 props 유효성 검사

function OptionDetail({ initialOptionTypeData, onDeleteClick, onEditClick, isEditMode = false }) {

    const [optionTypeData, setOptionTypeData] = useState({
        ...initialOptionTypeData,
        isUsed: initialOptionTypeData.isUsed !== undefined ? initialOptionTypeData.isUsed : true,
        minSelection: initialOptionTypeData.minSelection || initialOptionTypeData.minSelection || 0,
        maxSelection: initialOptionTypeData.maxSelection || initialOptionTypeData.maxSelection || 1,
    });

    // 경고 메시지 상태 추가
    const [warningMessage, setWarningMessage] = useState('');
    const [formError, setFormError] = useState(null);
    const [showError, setShowError] = useState(false);

    // initialOptionTypeData prop이 변경될 때마다 내부 상태를 업데이트
    useEffect(() => {
        setOptionTypeData({
            ...initialOptionTypeData,
            isUsed: initialOptionTypeData.isUsed !== undefined ? initialOptionTypeData.isUsed : true,
            minSelection: initialOptionTypeData.minSelection || initialOptionTypeData.minSelection || 0,
            maxSelection: initialOptionTypeData.maxSelection || initialOptionTypeData.maxSelection || 1,
        });
        // 데이터가 변경될 때 경고 메시지도 초기화
        setWarningMessage('');
    }, [initialOptionTypeData]);

    // optionTypeData.minSelection 또는 optionTypeData.isRequired가 변경될 때마다 유효성 검사 실행
    useEffect(() => {
        if (optionTypeData.minSelection >= 1 && !optionTypeData.isRequired) {
            setWarningMessage('최소 선택 개수가 1 이상이면 "필수 선택"은 항상 활성화되어야 합니다.');
        } else {
            setWarningMessage(''); // 경고 메시지 초기화
        }
    }, [optionTypeData.minSelection, optionTypeData.isRequired]);


    const { optionType, isRequired, isUsed, minSelection, maxSelection, optionItems } = optionTypeData;

    // 옵션 타입 변경 핸들러
    const handleOptionTypeChange = (e) => {
        if (isEditMode) {
            setOptionTypeData(prev => ({
                ...prev,
                optionType: e.target.value
            }));
        }
    };

    // 필수 선택 여부 토글 핸들러
    const handleIsRequiredChange = () => {
        if (!isEditMode) return; // 수정 모드가 아니면 아무것도 하지 않음

        const newIsRequired = !optionTypeData.isRequired; // 현재 상태의 반대값
        const currentMinSelection = optionTypeData.minSelection;

        if (!newIsRequired && currentMinSelection >= 1) {
            setWarningMessage('최소 선택 개수가 1 이상일 경우 "필수 선택"을 해제할 수 없습니다. 최소 선택 개수를 0으로 변경해주세요.');
        } else {
            // 유효한 변경인 경우
            setOptionTypeData(prev => ({
                ...prev,
                isRequired: newIsRequired
            }));
            setWarningMessage(''); // 경고 메시지 초기화
        }
    };

    // 사용여부 토글 핸들러
    const handleIsUsedChange = () => {
        if (isEditMode) {
            setOptionTypeData(prev => ({
                ...prev,
                isUsed: !prev.isUsed
            }));
        }
    };


    // 최소 선택 수 변경 핸들러
    const handleMinSelectionChange = (e) => {
        if (!isEditMode) return;

        const newMinSelection = Number(e.target.value);
        if (isNaN(newMinSelection) || newMinSelection < 0) return;

        setOptionTypeData(prev => {
            let updatedIsRequired = prev.isRequired;
            if (newMinSelection >= 1) {
                // 최소 선택 개수가 1 이상이면 '필수 선택'은 자동으로 활성화
                updatedIsRequired = true;
            }

            return {
                ...prev,
                minSelection: newMinSelection,
                isRequired: updatedIsRequired
            };
        });
    };

    // 최대 선택 수 변경 핸들러
    const handleMaxSelectionChange = (e) => {
        if (isEditMode) {
            setOptionTypeData(prev => ({
                ...prev,
                maxSelection: Number(e.target.value)
            }));
        }
    };

    // 옵션 항목 값 변경 핸들러
    const handleOptionItemChange = (index, field, value) => {
        if (isEditMode) {
            const newOptionItems = [...optionItems];
            newOptionItems[index][field] = field === 'price' ? Number(value) : value;
            setOptionTypeData(prev => ({
                ...prev,
                optionItems: newOptionItems
            }));
        }
    };

    // 옵션 항목 추가 핸들러
    const handleAddOptionItem = () => {
        if (isEditMode) {
            setOptionTypeData(prev => ({
                ...prev,
                optionItems: [...prev.optionItems, { optionItemId: 'new_' + Date.now(), optionName: '', price: 0 }]
            }));
        }
    };

    // 옵션 항목 삭제 핸들러
    const handleRemoveOptionItem = (index) => {
        if (isEditMode) {
            const newOptionItems = optionItems.filter((_, i) => i !== index);
            setOptionTypeData(prev => ({
                ...prev,
                optionItems: newOptionItems
            }));
        }
    };

    // 저장/수정 버튼 클릭 핸들러
    const handleSaveOrEditClick = () => {
        // 저장 모드일 때 최종 유효성 검사
        if (isEditMode) {
            if (optionTypeData.minSelection >= 1 && !optionTypeData.isRequired) {
                // 이 경우 handleIsRequiredChange에서 이미 경고를 띄웠지만, 혹시 모를 상황에 대비
                setFormError({message: '최소 선택 개수가 1 이상이면 "필수 선택"은 항상 활성화되어야 합니다. 설정을 확인해주세요.', type: 'error'});
                setShowError(true);
                return; // 저장 막기
            }
        }
        // onEditClick prop을 호출하며 현재 optionTypeData를 전달
        onEditClick(isEditMode ? optionTypeData : undefined);
    };

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto my-8">
            {showError && formError && (
                <AlertModal
                    message={formError.message}
                    type={formError.type || "error"}
                    show={showError}
                />
            )}
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2 w-full text-center">
                옵션 {isEditMode ? '수정' : '상세 조회'}
            </h2>

            <div className="w-full space-y-6">
                <div className="flex flex-col">
                    <label className="text-xl text-gray-700 mb-2">옵션 타입</label>
                    {isEditMode ? (
                        <input
                            type="text"
                            value={optionType}
                            onChange={handleOptionTypeChange}
                            className="bg-white border border-gray-300 rounded-md p-3 text-lg text-gray-800 focus:border-blue-400 focus:ring-1"
                            placeholder="옵션 타입을 입력하세요"
                        />
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-lg text-gray-800">
                            {optionType}
                        </div>
                    )}
                </div>

                {/* 필수 선택 여부 */}
                <div className="flex flex-col">
                    <label className="text-xl text-gray-700 mb-2">필수 선택 여부</label>
                    <div className="flex items-center space-x-6 bg-gray-50 border border-gray-200 rounded-md p-3">
                        <input
                            type="checkbox"
                            checked={isRequired}
                            onChange={handleIsRequiredChange} // 변경된 핸들러
                            readOnly={!isEditMode}
                            className={`h-5 w-5 text-blue-600 border-gray-300 rounded ${isEditMode ? 'cursor-pointer focus:ring-blue-500' : 'cursor-not-allowed opacity-70'}`}
                        />
                        <span className="text-lg text-gray-800">선택필수</span>
                        <div className="flex items-center space-x-2 ml-auto">
                            <label className="text-lg text-gray-800">최소:</label>
                            <input
                                type="number"
                                value={minSelection}
                                onChange={handleMinSelectionChange} // 변경된 핸들러
                                readOnly={!isEditMode}
                                className={`w-16 p-1 border border-gray-300 rounded-md text-center text-lg bg-white ${isEditMode ? 'focus:border-blue-400 focus:ring-1' : 'opacity-70 cursor-not-allowed'}`}
                            />
                            <label className="text-lg text-gray-800">최대:</label>
                            <input
                                type="number"
                                value={maxSelection}
                                onChange={handleMaxSelectionChange} // 변경된 핸들러
                                readOnly={!isEditMode}
                                className={`w-16 p-1 border border-gray-300 rounded-md text-center text-lg bg-white ${isEditMode ? 'focus:border-blue-400 focus:ring-1' : 'opacity-70 cursor-not-allowed'}`}
                            />
                        </div>
                    </div>
                    {warningMessage && (
                        <p className="text-red-600 text-sm mt-2">{warningMessage}</p> // 경고 메시지 표시
                    )}
                </div>

                {/* isUsed 체크박스 */}
                <div className="flex flex-col">
                    <label className="text-xl text-gray-700 mb-2">사용 여부</label>
                    <div className="flex items-center space-x-6 bg-gray-50 border border-gray-200 rounded-md p-3">
                        <input
                            type="checkbox"
                            checked={isUsed}
                            onChange={handleIsUsedChange} // 새로운 핸들러
                            readOnly={!isEditMode}
                            className={`h-5 w-5 text-blue-600 border-gray-300 rounded ${isEditMode ? 'cursor-pointer focus:ring-blue-500' : 'cursor-not-allowed opacity-70'}`}
                        />
                        <span className="text-lg text-gray-800">사용</span>
                    </div>
                </div>

                {/* 옵션 항목 목록 */}
                <div className="flex flex-col">
                    <label className="text-xl text-gray-700 mb-2">옵션 항목</label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
                        {optionItems && optionItems.length > 0 ? (
                            optionItems.map((item, index) => (
                                <div key={String(item.optionItemId || `new-${index}`)} className="flex justify-between items-center py-3 px-4 bg-white hover:bg-gray-50">
                                    {isEditMode ? (
                                        <>
                                            <input
                                                type="text"
                                                value={item.optionName}
                                                onChange={(e) => handleOptionItemChange(index, 'optionName', e.target.value)}
                                                className="flex-grow mr-4 p-1 border border-gray-300 rounded-md text-lg text-gray-800 focus:border-blue-400 focus:ring-1"
                                                placeholder="옵션명"
                                            />
                                            <input
                                                type="text"
                                                value={item.price === 0 && isEditMode ? '' : item.price.toLocaleString()}
                                                onFocus={(e) => {
                                                    if (item.price === 0) {
                                                        e.target.select(); // 포커스 시 전체 선택
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/,/g, ''); // 콤마 제거
                                                    if (/^\d*$/.test(raw)) {
                                                        const numeric = Number(raw || 0);
                                                        handleOptionItemChange(index, 'price', numeric);
                                                    }
                                                }}
                                                className="w-28 p-1 border border-gray-300 rounded-md text-lg text-gray-600 text-right focus:border-blue-400 focus:ring-1"
                                                placeholder="가격"
                                            />
                                            <span className="ml-1 text-lg text-gray-600 min-w-[25px]">원</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOptionItem(index)}
                                                className="ml-4 p-1 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors duration-150"
                                                title="옵션 항목 삭제"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 1.75a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM12.5 10a.75.75 0 011.5 0v5.5a.75.75 0 01-1.5 0v-5.5z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-lg text-gray-800">{item.optionName}</span>
                                            <span className="text-lg text-gray-600">{item.price.toLocaleString()} 원</span>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-md text-gray-500 p-4 text-center bg-white">등록된 옵션 항목이 없습니다.</p>
                        )}
                        {isEditMode && (
                            <div className="p-3 bg-white border-t border-gray-200">
                                <button
                                    className="w-full text-left text-blue-500 font-medium py-2 px-3 rounded-md hover:bg-blue-50 transition-colors duration-150 flex items-center"
                                    onClick={handleAddOptionItem}
                                >
                                    <span className="mr-2 text-lg">[+]</span> 옵션 추가
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 하단 버튼들 */}
            <div className="mt-8 flex justify-center space-x-4 w-full">
                <button
                    onClick={() => onDeleteClick(isEditMode ? optionTypeData : undefined)}
                    className="w-1/3 py-3 px-4 border border-gray-300 rounded-md text-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                    {isEditMode ? '취소' : '삭제'}
                </button>
                <button
                    onClick={handleSaveOrEditClick} // 변경된 핸들러
                    className="w-1/3 py-3 px-4 bg-gray-800 text-white rounded-md text-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
                >
                    {isEditMode ? '저장' : '수정'}
                </button>
            </div>
        </div>
    );
}

OptionDetail.propTypes = {
    initialOptionTypeData: PropTypes.shape({
        optionTypeId: PropTypes.number.isRequired,
        optionType: PropTypes.string.isRequired,
        isRequired: PropTypes.bool.isRequired,
        isUsed: PropTypes.bool,
        minSelection: PropTypes.number,
        maxSelection: PropTypes.number,
        optionItems: PropTypes.arrayOf(PropTypes.shape({
            optionItemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            optionName: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
        })),
    }).isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool,
};

export default OptionDetail;