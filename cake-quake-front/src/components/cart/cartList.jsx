import React from 'react';
import CartItem from './CartItem';

export default function CartList({
                                     title,
                                     items,
                                     selectedIds,
                                     onToggleSelect,
                                     onQuantityChange,
                                     onRemoveClick,
                                     isCustom = false
                                 }) {
    if (!items || !items.length) {
        return <div className="text-center py-8">장바구니에 상품이 없습니다.</div>;
    }

    return (
        <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <ul>
                {items.map(item => (
                    <li key={item.cartItemId}>
                        <CartItem
                            item={item}
                            isSelected={selectedIds.includes(item.cartItemId)}          // ✅ 수정
                            onToggleSelect={() => onToggleSelect(item.cartItemId)}      // ✅ 수정
                            // ✅ 수량 변경 핸들러 수정 (item 참조 대신 최신 상태에서 찾기)
                            onQuantityChange={(id, delta) => {
                                const targetItem = items.find(i => i.cartItemId === id);
                                if (!targetItem) return;
                                const newQty = targetItem.productCnt + delta;
                                if (newQty >= 1 && newQty <= 99) {
                                    onQuantityChange(id, newQty); // updateItem 호출로 이어짐
                                }
                            }}
                            onRemove={() => onRemoveClick(item.cartItemId)}             // ✅ 수정
                            isCustom={isCustom}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
