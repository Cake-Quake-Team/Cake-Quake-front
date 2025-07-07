import React from 'react';

export default function CartPrice({ items = [], selectedIds = [] }) {
    // ✅ props가 undefined일 때를 대비해 기본값 설정

    // ✅ 선택된 상품만 필터링
    const selectedItems = items.filter(item => selectedIds.includes(item.cartItemId));

    // ✅ 선택된 상품의 총 가격 계산
    const selectedTotalPrice = selectedItems.reduce(
        // ⭐ item.itemTotalPrice를 사용하여 옵션 가격까지 합산 ⭐
        (sum, item) => sum + (item.itemTotalPrice || 0), // itemTotalPrice가 null일 경우 대비
        0
    );

    return (
        <div>
            <p className="text-lg">총 합계: ₩{selectedTotalPrice.toLocaleString()}</p>
            <p className="text-sm text-gray-600">선택된 상품: {selectedItems.length}개</p>
        </div>
    );
}