import React from 'react';

export default function CartPrice({ items = [], selectedIds = [] }) {
    // ✅ props가 undefined일 때를 대비해 기본값 설정

    // ✅ 선택된 상품만 필터링
    const selectedItems = items.filter(item => selectedIds.includes(item.cartItemId));

    // ✅ 선택된 상품의 총 가격 계산
    const selectedTotalPrice = selectedItems.reduce(
        (sum, item) => sum + item.price * item.productCnt,
        0
    );

    return (
        <div>
            <p className="text-lg">총 합계: ₩{selectedTotalPrice.toLocaleString()}</p>
            <p className="text-sm text-gray-600">선택된 상품: {selectedItems.length}개</p>
        </div>
    );
}
