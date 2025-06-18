import React from 'react';


export default function CartItem({
                                     item,                // { cartItemId, cname, productCnt, price }
                                     isSelected,
                                     onToggleSelect,      // (cartItemId: number) => void
                                     onQuantityChange,    // (cartItemId: number, delta: number) => void
                                     onRemove,            // (cartItemId: number) => void
                                     isCustom = false
                                 }) {
    const {
        cartItemId,
        cname,                 // ✅ 상품 이름 필드명 수정
        productCnt,            // ✅ 수량 필드명 수정
        price,
        customOptions          // ❗ optional (없으면 생략됨)
    } = item;

    return (
        <div className="flex items-center justify-between p-4 border-b">
            {/* 선택 */}
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(cartItemId)}
                aria-label={`Select item ${cname}`}
            />

            {/* 상품 정보 */}
            <div className="flex-1 mx-4">
                <p className="font-medium">{cname}</p>
                {isCustom && customOptions && (
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
