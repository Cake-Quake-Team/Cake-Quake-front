import React, { useEffect } from 'react';
import CreateOrderComponent from '../../../components/order/buyer/createOrder';
import useCart from '../../../hooks/useCart';
import { useAuth } from '../../../store/AuthContext';
import { useNavigate, useLocation } from 'react-router';
// import PickupScheduler from '../../../components/scheduler/PickupScheduler'; // PickupScheduler 임포트 제거

export default function CreateOrderPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const selectedItemsFromState = location.state?.selectedItems || null;
    const { items: allCartItems } = useCart();
    const itemsToOrder = selectedItemsFromState || allCartItems;

    // pickupInfo 상태 제거
    // const [pickupInfo, setPickupInfo] = useState({
    //     date: null,
    //     shop: null,
    //     time: null,
    // });

    // handlePickupSelectionComplete 함수 제거
    // const handlePickupSelectionComplete = ({ selectedDate, selectedShop, selectedTime }) => {
    //     setPickupInfo({
    //         date: selectedDate,
    //         shop: selectedShop,
    //         time: selectedTime,
    //     });
    //     console.log("픽업 정보 최종 선택 완료:", { selectedDate, selectedShop, selectedTime });
    // };

    useEffect(() => {
        if (!itemsToOrder || itemsToOrder.length === 0) {
            alert("주문할 상품 정보가 없습니다. 장바구니로 돌아갑니다.");
            navigate('/buyer/cart');
        }
    }, [itemsToOrder, navigate]);

    if (!user || !user.userId) {
        alert("로그인이 필요합니다.");
        navigate('/login');
        return null;
    }

    if (!itemsToOrder || itemsToOrder.length === 0) {
        return <div className="text-center p-8 text-gray-500">주문할 상품 정보가 없습니다.</div>;
    }

    // ⭐⭐ 픽업 날짜 및 시간 정보는 이제 CreateOrderPage에서 직접 다루지 않습니다.
    // CreateOrderComponent가 이 정보를 필요로 한다면, CreateOrderComponent 내부에서 처리하거나
    // 백엔드 API와의 계약에 따라 다른 방식으로 전달해야 합니다.
    // 여기서는 일단 itemsToOrder에서 shopId만 가져옵니다.
    const shopIdToPass = itemsToOrder[0]?.shopId;
    // const pickupDateToPass = null; // 필요에 따라 기본값 설정 또는 제거
    // const pickupTimeToPass = null; // 필요에 따라 기본값 설정 또는 제거

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
            <h2 className="text-2xl font-semibold mb-6">주문 생성</h2> {/* 제목 변경 */}

            {/* <PickupScheduler onComplete={handlePickupSelectionComplete} /> 제거 */}

            {/* 픽업 정보 조건부 렌더링 제거 (이제 이 페이지에서 직접 다루지 않으므로 항상 렌더링) */}
            <div style={{ marginTop: '30px' }}>
                <h3>주문 상세 정보 입력</h3>
                <CreateOrderComponent
                    userId={user.userId}
                    itemsToOrder={itemsToOrder}
                    shopId={shopIdToPass}
                    // pickupDate={pickupDateToPass} // 픽업 날짜 prop 제거
                    // pickupTime={pickupTimeToPass} // 픽업 시간 prop 제거
                    onSuccess={() => navigate('/buyer/orders')}
                />
            </div>
        </div>
    );
}