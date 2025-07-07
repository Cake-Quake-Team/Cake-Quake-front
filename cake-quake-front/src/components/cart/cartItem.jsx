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
        selectedOptions, // JSON 문자열
    } = item;

    let parsedOptions = []; // 파싱 실패 시 빈 배열로 초기화하여 map 오류 방지
    if (selectedOptions) {
        try {
            parsedOptions = JSON.parse(selectedOptions);
            if (!Array.isArray(parsedOptions)) { // JSON이 배열이 아닌 경우 대비
                console.warn("selectedOptions JSON is not an array:", parsedOptions);
                parsedOptions = [];
            }
        } catch (e) {
            console.error("Failed to parse selectedOptions JSON:", e);
            parsedOptions = [];
        }
    }

    // ⭐ [사용] 옵션들의 총 가격을 계산 (화면에 표시하기 위함) ⭐
    const optionsDisplayPrice = parsedOptions.reduce((sum, option) => {
        return sum + (option.optionPrice || 0) * (option.optionCnt || 1);
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
                                {option.optionName}: {option.optionValue}
                                {option.optionCnt > 1 && ` (${option.optionCnt}개)`}
                                {option.optionPrice > 0 && ` (+${option.optionPrice.toLocaleString()}원)`}
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