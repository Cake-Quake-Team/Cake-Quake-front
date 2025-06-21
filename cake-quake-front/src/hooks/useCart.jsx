 import { useState, useEffect } from 'react';
import {
    getCartItems,
    updateCartItem,
    removeCartItem,
    removeAllCartItems,
} from '../api/cartApi';

export default function useCart() {
    const [items, setItems] = useState([]);

    // 초기 장바구니 불러오기
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await getCartItems();
            setItems(data.items);

        } catch (err) {
            console.error('장바구니 불러오기 실패:', err);
        }
    };

    const updateItem = async (cartItemId, newQty) => {
        try {
            await updateCartItem(cartItemId, { productCnt: newQty }); // ✅ key 이름 주의
            setItems((prev) =>
                prev.map((item) =>
                    item.cartItemId === cartItemId
                        ? { ...item, productCnt: newQty }               // ✅ 필드 이름 일치
                        : item
                )
            );
        } catch (err) {
            console.error('수량 수정 실패:', err);
        }
    };


    const removeItem = async (cartItemId) => {
        try {
            await removeCartItem(cartItemId);
            setItems((prev) => prev.filter((item) => item.id !== cartItemId));
        } catch (err) {
            console.error('삭제 실패:', err);
        }
    };

    const clearAllItems = async () => {
        try {
            await removeAllCartItems();
            setItems([]);
        } catch (err) {
            console.error('전체 비우기 실패:', err);
        }
    };

    return {
        items,
        updateItem,
        removeItem,
        clearAllItems,
    };
}
