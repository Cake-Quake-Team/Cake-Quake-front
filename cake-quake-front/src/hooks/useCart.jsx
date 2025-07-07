import { useState, useEffect, useCallback, useRef } from 'react'; // useCallback, useRef 임포트 추가
import {
    getCartItems,
    updateCartItem,
    removeCartItem,
    removeAllCartItems,
} from '../api/cartApi';

export default function useCart() {
    const [items, setItems] = useState([]);
    const [cartTotalPrice, setCartTotalPrice] = useState(0);

    // fetchCart가 한 번만 호출되도록 제어하는 플래그
    const hasFetchedInitially = useRef(false);

    // fetchCart 함수를 useCallback으로 감싸서 불필요한 재생성 방지
    const fetchCart = useCallback(async () => {
        if (!hasFetchedInitially.current) { // 초기 로딩 시에만 이 플래그를 사용
            hasFetchedInitially.current = true;
        } else {

            console.log("fetchCart: 이미 초기 로딩 완료, 수동 호출 대기.");
        }

        try {
            const data = await getCartItems();
            setItems(data.items);
            setCartTotalPrice(data.cartTotalPrice);
            console.log("✅ 장바구니 데이터 불러오기 성공:", data);
        } catch (err) {
            console.error('❌ 장바구니 불러오기 실패:', err);
            // 에러를 밖으로 던져서 CartPage에서 처리할 수 있게 함
            throw err;
        }
    }, []); // fetchCart 자체는 의존성이 없으므로 빈 배열

    // 초기 장바구니 불러오기 (컴포넌트 마운트 시 1회)
    useEffect(() => {
        // StrictMode에서 두 번 실행되는 문제를 useCallback과 useRef로 해결
        if (!hasFetchedInitially.current) { // isMountedRef나 hasFetchedInitiallyRef와 같은 패턴
            fetchCart();
        }
    }, [fetchCart]); // fetchCart가 useCallback으로 감싸져 있으므로, 함수 참조가 변하지 않아 이 useEffect는 1회만 실행됨


    const updateItem = async (cartItemId, newQty) => {
        try {
            const payload = {
                cartItemId: cartItemId,
                productCnt: newQty
            };
            await updateCartItem(payload);
            await fetchCart(); // 업데이트 후 장바구니 데이터 재동기화
        } catch (err) {
            console.error('수량 수정 실패:', err);
            throw err;
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            await removeCartItem(cartItemId);
            await fetchCart(); // 삭제 후 장바구니 데이터 재동기화
        } catch (err) {
            console.error('삭제 실패:', err);
            throw err;
        }
    };

    const clearAllItems = async () => {
        try {
            await removeAllCartItems();
            await fetchCart(); // 전체 삭제 후 장바구니 데이터 재동기화
        } catch (err) {
            console.error('전체 비우기 실패:', err);
            throw err;
        }
    };

    return {
        items,
        cartTotalPrice,
        fetchCart, // fetchCart 함수는 외부에서 필요할 때 호출할 수 있도록 반환
        updateItem,
        removeItem,
        clearAllItems,
    };
}