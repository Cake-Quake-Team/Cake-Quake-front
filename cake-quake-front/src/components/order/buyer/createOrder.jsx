// src/components/order/buyer/createOrder.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { createOrder } from "../../../api/buyerOrderApi";
import useCart from '../../../hooks/useCart';
import { useAuth } from '../../../store/AuthContext';
import { getPointBalance } from '../../../api/pointApi';

// 새로 분리한 컴포넌트 임포트
import OrderPickupScheduler from './createorderdetails/OrderPickupScheduler';
import OrderItemsDisplay from './createorderdetails/OrderItemsDisplay';
import OrderPaymentSummary from './createorderdetails/OrderPaymentSummary';

// getItemDetails 유틸리티 함수 임포트
import { getItemDetails } from '../../../utils/itemDetailsUtils';
import CompleteOrderModal from "./completeOrderModal.jsx"; //

const CreateOrder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { items: allCartItems, clearCart } = useCart();

    const orderItemsFromSource = location.state?.selectedItems || allCartItems;

    // --- State: 부모 컴포넌트가 모든 핵심 상태를 관리 ---
    const initialPickupDateFromState = location.state?.pickupDate ? new Date(location.state.pickupDate) : null;
    const initialPickupTimeFromState = location.state?.pickupTime || null;
    const initialSelectedShopFromState = location.state?.selectedShop || null;

    const [selectedDate, setSelectedDate] = useState(initialPickupDateFromState);
    const [selectedTime, setSelectedTime] = useState(initialPickupTimeFromState);
    const [selectedShop, setSelectedShop] = useState(initialSelectedShopFromState);
    const [orderNote, setOrderNote] = useState("");
    const [userPoints, setUserPoints] = useState(0);
    const [pointsToUse, setPointsToUse] = useState("");
    const [totalOrderPrice, setTotalOrderPrice] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalPaymentPrice, setFinalPaymentPrice] = useState(0);

    // ⭐⭐ 주문 완료 모달 관련 상태 추가 ⭐⭐
    const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
    const [orderSuccessModalMessage, setOrderSuccessModalMessage] = useState('');
    const [completedOrderId, setCompletedOrderId] = useState(null); // 완료된 주문 ID 저장

    let initialShopIdFromProps = null;
    if (orderItemsFromSource && orderItemsFromSource.length > 0) {
        if (orderItemsFromSource[0].shopId !== undefined) {
            initialShopIdFromProps = orderItemsFromSource[0].shopId;
        } else if (orderItemsFromSource[0].cakeItem?.shopId !== undefined) {
            initialShopIdFromProps = orderItemsFromSource[0].cakeItem.shopId;
        } else if (location.state?.shopId !== undefined) {
            initialShopIdFromProps = location.state.shopId;
        } else if (orderItemsFromSource[0].cakeDetailDTO?.shopId !== undefined) {
            initialShopIdFromProps = orderItemsFromSource[0].cakeDetailDTO.shopId;
        }
    }
    const finalShopId = initialShopIdFromProps || selectedShop?.shopId;


    // --- Effect: 사용자 포인트, 총 주문 금액, 할인 금액 계산 ---
    useEffect(() => {
        if (user && user.userId) {
            const fetchUserPoints = async () => {
                try {
                    const points = await getPointBalance();
                    setUserPoints(points);
                } catch (err) {
                    console.error("사용자 포인트를 불러오는 데 실패했습니다:", err);
                    setUserPoints(0);
                }
            };
            fetchUserPoints();
        }

        // getItemDetails를 사용하여 총 가격을 계산
        const calculatedTotalPrice = orderItemsFromSource.reduce((sum, item) => {
            const { unitPrice, quantity, totalOptionsPrice } = getItemDetails(item);
            return sum + (unitPrice * quantity) + (totalOptionsPrice || 0);
        }, 0);
        setTotalOrderPrice(calculatedTotalPrice);

    }, [user, orderItemsFromSource, location.state]);

    useEffect(() => {
        const parsedPoints = parseInt(pointsToUse) || 0;
        let appliedDiscount = 0;

        const actualPointsToUse = Math.min(parsedPoints, userPoints);
        appliedDiscount = Math.min(actualPointsToUse, totalOrderPrice);

        setDiscountAmount(appliedDiscount);
        setFinalPaymentPrice(totalOrderPrice - appliedDiscount);
    }, [pointsToUse, userPoints, totalOrderPrice]);


    // --- Callbacks from child components ---
    const handleScheduleChange = useCallback((date, shop, time) => {
        setSelectedDate(date);
        setSelectedShop(shop);
        setSelectedTime(time);
    }, []);

    const handleOrderNoteChange = useCallback((note) => {
        setOrderNote(note);
    }, []);

    const handlePointsUsedChange = useCallback((points) => {
        setPointsToUse(points);
    }, []);

    // ⭐⭐ 주문 완료 모달 닫기 핸들러 (모달만 닫음) ⭐⭐
    const handleCloseModalOnly = useCallback(() => {
        setShowOrderSuccessModal(false);
        // 닫기 버튼은 특정 페이지로 이동하지 않고 모달만 닫습니다.
    }, []);

    // ⭐⭐ 주문 내역 보기 핸들러 (페이지 이동) ⭐⭐
    const handleGoToOrderDetails = useCallback(() => {
        setShowOrderSuccessModal(false); // 모달 닫기
        if (completedOrderId) {
            navigate(`/buyer/orders/${completedOrderId}`); // 주문 상세 페이지로 이동
        } else {
            navigate("/buyer/orders"); // 주문 ID가 없으면 주문 목록으로
        }
    }, [completedOrderId, navigate]);

    // --- Submit Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!orderItemsFromSource || orderItemsFromSource.length === 0) {
            alert("주문할 상품이 없습니다.");
            return;
        }
        if (!selectedDate || !selectedTime) {
            alert("픽업 날짜와 시간을 선택해주세요.");
            return;
        }
        if (!finalShopId) {
            alert("픽업 매장을 선택해주세요.");
            return;
        }
        if (finalPaymentPrice < 0) {
            alert("결제 금액이 0원 미만이 될 수 없습니다. 포인트 사용을 조절해주세요.");
            return;
        }

        const cartItemIds = [];
        const directItems = [];

        orderItemsFromSource.forEach(item => {
            if (item.cartItemId) {
                cartItemIds.push(item.cartItemId);
            } else {
                const optionsPayload = {};
                // item.selectedOptions가 있다면 이를 기반으로 payload 구성 (List<SelectedOptionDetail> 형태)
                if (item.selectedOptions && Array.isArray(item.selectedOptions)) {
                    item.selectedOptions.forEach(option => {
                        optionsPayload[option.mappingId] = option.count;
                    });
                } else if (item.options && typeof item.options === 'object') { // 이전 item.options (Map<Long, Integer>) 형태도 처리 (필요시)
                    Object.entries(item.options).forEach(([mappingId, count]) => {
                        optionsPayload[Number(mappingId)] = count;
                    });
                }
                directItems.push({
                    shopId: finalShopId,
                    cakeId: item.cakeDetailDTO?.cakeId || item.cakeId,
                    cakeItemId: item.cakeDetailDTO?.cakeId || item.cakeId,
                    quantity: item.productCnt || item.quantity,
                    options: optionsPayload
                });
            }
        });

        const payload = {
            shopId: finalShopId,
            cartItemIds: cartItemIds.length > 0 ? cartItemIds : undefined,
            directItems: directItems.length > 0 ? directItems : undefined,
            pickupDate: selectedDate.toISOString().split('T')[0],
            pickupTime: selectedTime + ":00",
            orderNote: orderNote,
            usedPoints: discountAmount,
        };

        console.log("전송될 payload:", payload);

        try {
            const responseData = await createOrder(payload);
            const newOrderId = responseData.orderId;

            if (newOrderId) {
                setOrderSuccessModalMessage("주문이 성공적으로 완료되었습니다!");
                setCompletedOrderId(newOrderId); // 주문 ID 저장
                setShowOrderSuccessModal(true); // ⭐ 주문 완료 모달 표시 ⭐
            } else {
                // 이 else 블록은 newOrderId가 null/undefined일 때인데, 보통 API가 성공하면 ID를 반환하므로
                // 이 경로로 오지 않을 가능성이 높습니다.
                navigate("/buyer/orders"); // 또는 적절한 대체 경로
            }

            if (cartItemIds.length > 0 && (!directItems || directItems.length === 0)) {
                clearCart();
            }

        } catch (error) {
            console.error("주문 생성 실패 (catch 블록 진입):", error);
            console.log("Full error object from catch:", error);

            if (error.response) {
                const errorMessage = error.response.data.message || error.response.data.detail || '알 수 없는 서버 오류';
                if (errorMessage.includes("휴무일") || errorMessage.includes("슬롯이 가득 찼습니다") || errorMessage.includes("픽업 시간 슬롯 부족") || errorMessage.includes("픽업일은 매장의 휴무일") || errorMessage.includes("영업 시간 범위 밖입니다")) {
                    alert(`예약 불가능: ${errorMessage}\n다른 날짜 또는 시간을 선택해주세요.`);
                } else if (errorMessage.includes("보유 포인트") || errorMessage.includes("포인트 사용량") || errorMessage.includes("포인트 부족")) {
                    alert(`포인트 사용 오류: ${errorMessage}`);
                }
                else {
                    alert(`주문 처리 중 오류가 발생했습니다: [${error.response.status}] ${errorMessage}`);
                }
            } else if (error.request) {
                alert("네트워크 오류가 발생했습니다. 주문 내역에서 주문 상태를 확인해주세요.");
            }
        }
    };


    return (
        <form onSubmit={handleSubmit} style={{
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1200px',
            margin: 'auto',
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap'
        }}>
            {/* 픽업 스케줄러 컴포넌트 */}
            <OrderPickupScheduler
                initialPickupDateFromState={initialPickupDateFromState}
                initialPickupTimeFromState={initialPickupTimeFromState}
                initialSelectedShopFromState={initialSelectedShopFromState}
                initialShopIdFromProps={initialShopIdFromProps}
                onScheduleChange={handleScheduleChange}
            />

            {/* 하단 섹션: 매장, 상품, 요청사항, 포인트, 결제 정보, 주문 버튼 */}
            {selectedDate && (initialShopIdFromProps ? selectedTime : (selectedShop && selectedTime)) && (
                <div style={{
                    width: '100%',
                    flexBasis: '100%'
                }}>
                    {selectedShop && (
                        <p style={{ marginBottom: '15px', fontSize: '1.1em', fontWeight: 'bold', textAlign: 'center' }}>
                            선택된 매장: {selectedShop.shopName} ({selectedShop.address})
                        </p>
                    )}

                    {/* 주문 상품 목록 컴포넌트 */}
                    <OrderItemsDisplay orderItems={orderItemsFromSource} />

                    {/* 결제 요약 컴포넌트 */}
                    <OrderPaymentSummary
                        userPoints={userPoints}
                        totalOrderPrice={totalOrderPrice}
                        discountAmount={discountAmount}
                        finalPaymentPrice={finalPaymentPrice}
                        orderNote={orderNote}
                        onOrderNoteChange={handleOrderNoteChange}
                        onPointsChange={handlePointsUsedChange}
                    />

                    {/* 최종 확인 및 주문하기 버튼 */}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <p style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '15px', color: '#28a745' }}>
                            선택된 픽업: {selectedDate?.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })} / {selectedTime}
                        </p>
                        <button
                            type="submit"
                            style={{ padding: '12px 25px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em', fontWeight: 'bold', transition: 'background-color 0.2s' }}
                        >
                            예약 확정 및 주문하기
                        </button>
                    </div>
                </div>
            )}
            {/* ⭐⭐ 주문 완료 모달 렌더링 ⭐⭐ */}
            {showOrderSuccessModal && (
                <CompleteOrderModal
                    // `message` props는 `completeOrderModal.jsx`에서 사용되지 않습니다. 제거하거나 모달에서 사용하세요.
                    // message={orderSuccessModalMessage}
                    onClose={handleCloseModalOnly} // "닫기" 버튼에 연결
                    onGoToOrders={handleGoToOrderDetails} // "주문 내역 보기" 버튼에 연결
                    // navigate props는 이제 CompleteOrderModal에서 직접 필요하지 않습니다.
                    // navigate={navigate}
                />
            )}
        </form>
    );
}

export default CreateOrder;