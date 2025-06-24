 import { useState, useEffect } from 'react';
import {
    getCartItems,
    updateCartItem, // cartApi.js의 updateCartItem이 payload만 받도록 수정되었을 것임
    removeCartItem,
    removeAllCartItems,
} from '../api/cartApi';

export default function useCart() {
    const [items, setItems] = useState([]);
    const [cartTotalPrice, setCartTotalPrice] = useState(0);

    // 초기 장바구니 불러오기
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await getCartItems(); // 백엔드에서 { items: [...], cartTotalPrice: ... } 반환 가정
            setItems(data.items);
            setCartTotalPrice(data.cartTotalPrice); // 총 가격도 업데이트
        } catch (err) {
            console.error('장바구니 불러오기 실패:', err);
            // 에러를 밖으로 던져서 CartPage에서 처리할 수 있게 함
            throw err;
        }
    };

    const updateItem = async (cartItemId, newQty) => {
        try {
            const payload = {
                cartItemId: cartItemId,
                productCnt: newQty // ⭐⭐⭐ quantity 대신 productCnt로 변경 ⭐⭐⭐
            };
            await updateCartItem(payload); // 수정된 updateCartItem 함수 호출 방식

            setItems((prev) => {
                const updatedItems = prev.map((item) => {
                    if (item.cartItemId === cartItemId) {
                        const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price);
                        const newItemTotalPrice = itemPrice * newQty;
                        return {
                            ...item,
                            productCnt: newQty, // 수량 업데이트
                            itemTotalPrice: newItemTotalPrice // 아이템 총 가격도 업데이트 (클라이언트 측 계산)
                        };
                    }
                    return item;
                });
                const newTotalPrice = updatedItems.reduce((sum, item) => sum + (item.itemTotalPrice || 0), 0);
                setCartTotalPrice(newTotalPrice);
                return updatedItems;
            });
            // 성공 메시지는 useCart 밖에서 처리하도록 함 (alert 제거)
        } catch (err) {
            console.error('수량 수정 실패:', err);
            throw err; // 에러를 다시 던짐
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            await removeCartItem(cartItemId);
            // 성공 시 로컬 상태 업데이트는 그대로 유지
            setItems((prev) => {
                const filteredItems = prev.filter((item) => item.cartItemId !== cartItemId);
                const newTotalPrice = filteredItems.reduce((sum, item) => sum + (item.itemTotalPrice || 0), 0);
                setCartTotalPrice(newTotalPrice);
                return filteredItems;
            });
            // alert 제거
        } catch (err) {
            console.error('삭제 실패:', err);
            throw err; // 에러를 다시 던짐
        }
    };

    const clearAllItems = async () => {
        try {
            await removeAllCartItems();
            setItems([]);
            setCartTotalPrice(0);
            // alert 제거
        } catch (err) {
            console.error('전체 비우기 실패:', err);
            throw err; // 에러를 다시 던짐
        }
    };

    return {
        items,
        cartTotalPrice,
        fetchCart, // 초기화 로직을 다시 실행할 수 있도록 fetchCart도 반환
        updateItem,
        removeItem,
        clearAllItems,
    };
}