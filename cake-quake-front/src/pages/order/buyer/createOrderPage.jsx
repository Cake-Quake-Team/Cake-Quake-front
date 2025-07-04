import React, { useState, useEffect } from 'react';
import CreateOrderComponent from '../../../components/order/buyer/createOrder';
import useCart from '../../../hooks/useCart';
import { useAuth } from '../../../store/AuthContext';
import { useNavigate, useLocation } from 'react-router';
import PickupScheduler from '../../../components/scheduler/PickupScheduler'; //

export default function CreateOrderPage() {
    const { user } = useAuth(); //
    const navigate = useNavigate(); //
    const location = useLocation(); //

    const selectedItemsFromState = location.state?.selectedItems || null; //
    const { items: allCartItems } = useCart(); //
    const itemsToOrder = selectedItemsFromState || allCartItems; //

    const [pickupInfo, setPickupInfo] = useState({
        date: null,
        shop: null,
        time: null,
    });

    const handlePickupSelectionComplete = ({ selectedDate, selectedShop, selectedTime }) => {
        setPickupInfo({
            date: selectedDate, // This `selectedDate` is a Date object from PickupScheduler
            shop: selectedShop,
            time: selectedTime, // This `selectedTime` should now be HH:MM from TimeSelection.jsx
        });
        console.log("픽업 정보 최종 선택 완료:", { selectedDate, selectedShop, selectedTime }); //
    };

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

    if (!itemsToOrder || itemsToOrder.length === 0) { //
        return <div className="text-center p-8 text-gray-500">주문할 상품 정보가 없습니다.</div>; //
    }

    // ⭐⭐ pickupDateToPass 형식 변경: YYYY-MM-DD (로컬 시간대 기준) ⭐⭐
    const shopIdToPass = pickupInfo.shop?.shopId || itemsToOrder[0]?.shopId;
    const pickupDateToPass = pickupInfo.date
        ? pickupInfo.date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
        : null;
    const pickupTimeToPass = pickupInfo.time;

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
            <h2 className="text-2xl font-semibold mb-6">픽업 정보 및 주문 생성</h2>

            <PickupScheduler onComplete={handlePickupSelectionComplete} /> {/* */}

            {pickupInfo.date && pickupInfo.shop && pickupInfo.time && ( //
                <div style={{ marginTop: '30px' }}> {/* */}
                    <h3>주문 상세 정보 입력</h3> {/* */}
                    <CreateOrderComponent
                        userId={user.userId} //
                        itemsToOrder={itemsToOrder} //
                        shopId={shopIdToPass} //
                        pickupDate={pickupDateToPass} // Pass the correctly formatted date string
                        pickupTime={pickupTimeToPass} // Pass the HH:MM time string
                        onSuccess={() => navigate('/buyer/orders')} //
                    />
                </div>
            )}
        </div>
    );
}