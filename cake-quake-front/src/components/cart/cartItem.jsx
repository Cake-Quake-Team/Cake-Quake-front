import React from 'react';

export default function CartItem({
                                     item,
                                     isSelected,
                                     onToggleSelect,
                                     onQuantityChange,
                                     onRemove,
                                     isCustom = false
                                 }) {
    const {
        cartItemId,
        cname,
        productCnt,
        price,
        customOptions, // 기존 customOptions 필드가 어떻게 사용될지 확인 필요
        thumbnailImageUrl,
        selectedOptions // ⭐ 추가: 백엔드에서 넘어오는 옵션 필드명 ('selectedOptions') ⭐
    } = item;

    // selectedOptions (JSON 문자열) 파싱
    let parsedOptions = {};
    if (selectedOptions) { // selectedOptions가 null이거나 undefined가 아닐 때만 파싱 시도
        try {
            parsedOptions = JSON.parse(selectedOptions);
        } catch (e) {
            console.error("Failed to parse selectedOptions JSON:", e);
            // 파싱 실패 시, 오류 처리 또는 사용자에게 보여줄 대체 텍스트 고려
        }
    }

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
                {/* ⭐ 옵션 값 표시 ⭐ */}
                {/* parsedOptions가 객체이고, 키가 있을 때만 렌더링 */}
                {Object.keys(parsedOptions).length > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                        {/* parsedOptions는 List<CartItemOption>의 JSON이므로 배열로 파싱됩니다. */}
                        {/* 배열을 순회하며 각 옵션 객체에서 optionName과 optionValue를 표시 */}
                        {parsedOptions.map((option, index) => (
                            <p key={index}>
                                {option.optionName}: {option.optionValue}
                                {option.optionCnt > 1 && ` (${option.optionCnt}개)`} {/* 옵션 수량이 1보다 클 때만 표시 */}
                                {option.optionPrice > 0 && ` (+${option.optionPrice.toLocaleString()}원)`} {/* 옵션 가격이 있을 때만 표시 */}
                            </p>
                        ))}
                    </div>
                )}
                {/* 만약 기존 customOptions 필드가 여전히 필요하다면, 위 옵션 표시 로직과 병합하거나 조건부 렌더링 */}
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
                ₩{(price * productCnt).toLocaleString()}
            </p>

            {/* 삭제 */}
            <button
                className="ml-4 text-red-600"
                onClick={() => onRemove(cartItemId)}
                aria-label="Remove item"
            >
                삭제
            </button>
        </div>
    );
}