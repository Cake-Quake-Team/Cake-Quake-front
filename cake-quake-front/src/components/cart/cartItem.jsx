// src/components/cart/CartItem.jsx

import React from 'react';

export default function CartItem({
                                     item,
                                     isSelected,
                                     onToggleSelect,
                                     onQuantityChange,
                                     isCustom = false
                                 }) {
    const {
        cartItemId,
        cname,
        productCnt,
        price, // 기존 케이크 단가
        customOptions,
        thumbnailImageUrl,
        selectedOptions, // API 응답에 따라 이제 '배열' 형태입니다.
    } = item;

    // ⭐ [수정된 부분 시작] selectedOptions 처리 로직 변경 ⭐
    let parsedOptions = [];
    if (selectedOptions) {
        if (Array.isArray(selectedOptions)) {
            // selectedOptions가 이미 배열인 경우, 그대로 사용
            parsedOptions = selectedOptions;
        } else if (typeof selectedOptions === 'string') {
            // 혹시 모를 JSON 문자열 형태에 대비 (백엔드가 변경될 경우를 위해 유지)
            try {
                const tempParsed = JSON.parse(selectedOptions);
                if (Array.isArray(tempParsed)) {
                    parsedOptions = tempParsed;
                } else {
                    console.warn("selectedOptions JSON parsed but not an array:", tempParsed);
                }
            } catch (e) {
                console.error("Failed to parse selectedOptions JSON (received as string but invalid):", e);
            }
        } else {
            console.warn("selectedOptions is neither an array nor a string, type:", typeof selectedOptions);
        }
    }
    // ⭐ [수정된 부분 끝] ⭐


    // ⭐ [수정] 옵션들의 총 가격을 계산 (API 응답의 'price'와 'count' 속성 사용) ⭐
    const optionsDisplayPrice = parsedOptions.reduce((sum, option) => {
        // API 응답 데이터에 'price'와 'count'가 있다고 하셨으니 이를 사용합니다.
        return sum + (option.price || 0) * (option.count || 1);
    }, 0);


    return (
        <div className="flex items-center justify-between p-4 border-b">
            {/* 선택 */}
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(cartItemId)}
                aria-label={`Select item ${cname}`}
                className="mr-4"
            />

            {/* 상품 이미지 컨테이너 */}
            <div className="flex-shrink-0 w-20 h-20 mr-4">
                {thumbnailImageUrl && (
                    <img
                        src={thumbnailImageUrl}
                        alt={cname}
                        className="w-full h-full object-cover rounded"
                    />
                )}
            </div>

            {/* 상품 정보 */}
            <div className="flex-1 mx-4">
                <p className="font-medium">{cname}</p>
                {/* ⭐ 옵션 값 표시 (parsedOptions가 배열이고 내용이 있을 때만 렌더링) ⭐ */}
                {parsedOptions.length > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                        {parsedOptions.map((option, index) => (
                            <p key={index}>
                                {/* ⭐ [수정] optionName만 표시 (optionValue가 API 응답에 없으므로) ⭐ */}
                                {/* API 응답 예시에 'optionName: 딸기' 가 있으므로, 딸기가 옵션의 이름이자 값으로 간주됩니다. */}
                                {option.optionName}
                                {/* ⭐ [수정] optionCnt 대신 option.count 사용 ⭐ */}
                                {option.count > 1 && ` (${option.count}개)`}
                                {/* ⭐ [수정] optionPrice 대신 option.price 사용 ⭐ */}
                                {option.price > 0 && ` (+${option.price.toLocaleString()}원)`}
                            </p>
                        ))}
                        {/* ⭐ [추가] 옵션 가격 총합을 별도로 표시 (optionsDisplayPrice 사용) ⭐ */}
                        {optionsDisplayPrice > 0 && (
                            <p className="font-semibold mt-1">
                                옵션 추가 금액: +{optionsDisplayPrice.toLocaleString()}원
                            </p>
                        )}
                    </div>
                )}
                {isCustom && typeof customOptions === 'string' && (
                    <p className="text-sm text-gray-500">{customOptions}</p>
                )}
            </div>

            {/* 수량 조절 */}
            <div className="flex items-center">
                <button
                    onClick={() => onQuantityChange(cartItemId, -1)}
                    disabled={productCnt <= 1}
                    aria-label="Decrease quantity"
                    className={`px-2 py-1 border rounded transition
            ${
                        productCnt <= 1
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-100 active:bg-gray-200 cursor-pointer'
                    }`}
                >
                    –
                </button>

                <span className="mx-2">{productCnt}</span>

                <button
                    onClick={() => onQuantityChange(cartItemId, +1)}
                    disabled={productCnt >= 99}
                    aria-label="Increase quantity"
                    className={`px-2 py-1 border rounded transition
            ${
                        productCnt >= 99
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-100 active:bg-gray-200 cursor-pointer'
                    }`}
                >
                    ＋
                </button>
            </div>

            {/* 가격 */}
            <p className="w-24 text-right">
                {/* ⭐ [유지] 기본 케이크 가격 * 수량 표시 ⭐ */}
                ₩{(price * productCnt).toLocaleString()}
            </p>

        </div>
    );
}