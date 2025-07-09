import jwtAxios from '../utils/jwtUtil.js';

const baseUrl = import.meta.env.VITE_API_BASE_URL;


// 장바구니 전체 조회
export const getCartItems = async () => {
    const res = await jwtAxios.get(`${baseUrl}/buyer/cart`);
    return res.data;
};


// 장바구니에 아이템 추가
export const addCartItem = async (payload) => {
    // POST 요청 시 명시적으로 Content-Type 설정
    const res = await jwtAxios.post(
        `${baseUrl}/buyer/cart`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json' // ⭐ 이 헤더를 명시적으로 추가 ⭐
            }
        }
    );
    return res.data;
};


// 장바구니 아이템 수량 업데이트
export const updateCartItem = async (payload) => {
    // PATCH 요청 시 명시적으로 Content-Type 설정
    const res = await jwtAxios.patch(
        `${baseUrl}/buyer/cart`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json' // ⭐ 이 헤더를 명시적으로 추가 ⭐
            }
        }
    );
    return res.data;
};




// 장바구니에서 아이템 삭제
export const removeCartItem = async (cartItemId) => {
    await jwtAxios.delete(`${baseUrl}/buyer/cart/${cartItemId}`);
    return true;
};


// (선택) 여러 아이템 한 번에 삭제(일단 지웠음)
export const removeAllCartItems = async () => {
    const res = await jwtAxios.delete(`${baseUrl}/buyer/cart`, {
        data: { }
    });
    return res.data;
};
