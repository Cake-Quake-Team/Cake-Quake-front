import React, { useEffect } from 'react'; // useEffect 추가 (useLocation 사용 시)
import CreateOrderComponent from '../../../components/order/buyer/createOrder'; // 이름 충돌 방지
import useCart from '../../../hooks/useCart';
import { useAuth } from '../../../store/AuthContext';
import { useNavigate, useLocation } from 'react-router'; // ⭐ useLocation 추가 ⭐

export default function CreateOrderPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // ⭐ useLocation 훅 초기화 ⭐

    // ⭐ useLocation을 통해 selectedItems를 가져옵니다. ⭐
    const selectedItemsFromState = location.state?.selectedItems || null;

    // 만약 selectedItemsFromState가 null이면, useCart에서 모든 아이템을 가져와 '전체 주문'처럼 처리
    // 또는 에러 처리 (선택 주문 시 필수적으로 selectedItems가 넘어와야 한다면)
    // 여기서는 selectedItemsFromState가 있으면 그것을 사용하고, 없으면 useCart의 모든 아이템을 사용하도록 합니다.
    const { items: allCartItems } = useCart();

    // 최종적으로 CreateOrder 컴포넌트에 넘겨줄 주문 상품 목록
    // selectedItemsFromState가 있으면 그것을 사용하고, 없으면 allCartItems (즉, 전체 주문)을 사용
    const itemsToOrder = selectedItemsFromState || allCartItems;


    const handleSuccess = () => {
        navigate('/buyer/orders/list'); // 주문 완료 후 주문 리스트로 이동
    };

    // 필수 정보 (shopId)가 넘어오지 않았을 경우의 처리 (선택 사항, 유효성 검사)
    useEffect(() => {
        if (!itemsToOrder || itemsToOrder.length === 0) {
            alert("주문할 상품 정보가 없습니다. 장바구니로 돌아갑니다.");
            navigate('/buyer/cart');
        }
        // 여기서는 shopId가 itemsToOrder[0].shopId에 있다고 가정하고 넘길 것입니다.
        // 만약 여러 shopId가 섞여 있다면 백엔드에서 에러를 던질 것이지만,
        // 프런트엔드에서 미리 검증하여 사용자 경험을 좋게 할 수 있습니다.
    }, [itemsToOrder, navigate]);


    if (!user || !user.userId) { // userId가 없으면 로그인 페이지로 리다이렉트
        alert("로그인이 필요합니다.");
        navigate('/login'); // 로그인 페이지 경로
        return null;
    }

    // itemsToOrder가 비어있는 경우 (useEffect에서 처리하지만, 렌더링 시점에도 대비)
    if (!itemsToOrder || itemsToOrder.length === 0) {
        return <div className="text-center p-8 text-gray-500">주문할 상품 정보가 없습니다.</div>;
    }

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
            <h2 className="text-2xl font-semibold mb-6">픽업 정보 입력</h2>
            {/* ⭐ CreateOrder 컴포넌트에 itemsToOrder와 shopId를 prop으로 전달 ⭐ */}
            <CreateOrderComponent
                userId={user.userId}
                itemsToOrder={itemsToOrder} // 선택된 (또는 전체) 상품 목록
                shopId={itemsToOrder[0]?.shopId} // 첫 번째 아이템의 shopId를 사용 (모든 아이템이 동일 매장 가정)
                onSuccess={handleSuccess}
            />
        </div>
    );
}