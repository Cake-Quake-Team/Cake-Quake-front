import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { createOrder } from "../../../api/buyerOrderApi"; // createOrder 함수 임포트
import useCart from '../../../hooks/useCart';
import { useAuth } from '../../../store/AuthContext';
import { getPointBalance } from '../../../api/pointApi';

// 픽업 스케줄러 관련 임포트
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { getAvailableShops, getShopOperatingHours, getOccupiedTimeSlots } from "../../../api/scheduleApi.jsx";

const CreateOrder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { items: allCartItems, clearCart } = useCart();

    const orderItemsFromSource = location.state?.selectedItems || allCartItems;

    // 폼 입력값 및 스케줄러 상태
    const [selectedDate, setSelectedDate] = useState(null); // 캘린더에서 선택된 날짜 (Date 객체)
    const [selectedTime, setSelectedTime] = useState(null); // 시간 선택기에서 선택된 시간 (HH:MM 문자열)
    const [orderNote, setOrderNote] = useState("");

    // 스케줄러 매장 및 시간 가용성 상태
    const [availableShops, setAvailableShops] = useState([]); // (여러 매장 시나리오) 특정 날짜에 예약 가능한 매장 목록
    const [selectedShop, setSelectedShop] = useState(null); // (여러 매장 시나리오) 사용자가 선택한 매장
    const [shopOperatingHours, setShopOperatingHours] = useState(null); // 선택된 매장의 운영 시간 정보
    const [occupiedTimeSlots, setOccupiedTimeSlots] = useState([]); // 선택된 매장/날짜의 예약된 시간대

    // 포인트 관련 상태
    const [userPoints, setUserPoints] = useState(0);
    const [pointsToUse, setPointsToUse] = useState("");
    const [totalOrderPrice, setTotalOrderPrice] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalPaymentPrice, setFinalPaymentPrice] = useState(0);

    const now = new Date(); // 현재 시간 (캘린더 minDate 및 maxDate 용)

    // 이 컴포넌트가 특정 매장 ID를 (URL params, location.state, 상품 정보 등에서) 받았는지 확인 ⭐⭐
    // 이 shopId는 사용자가 매장을 선택할 필요 없이 이미 고정되어 있는 경우에 사용됩니다.
    let initialShopIdFromProps = null;
    if (orderItemsFromSource && orderItemsFromSource.length > 0) {
        if (orderItemsFromSource[0].shopId !== undefined) {
            initialShopIdFromProps = orderItemsFromSource[0].shopId;
        } else if (orderItemsFromSource[0].cakeItem?.shopId !== undefined) {
            initialShopIdFromProps = orderItemsFromSource[0].cakeItem.shopId;
        } else if (location.state?.shopId !== undefined) { // 예: navigate('/create', { state: { shopId: X } })
            initialShopIdFromProps = location.state.shopId;
        } else if (orderItemsFromSource[0].cakeDetailDTO?.shopId !== undefined) {
            initialShopIdFromProps = orderItemsFromSource[0].cakeDetailDTO.shopId;
        }
    }

    const finalShopId = initialShopIdFromProps || selectedShop?.shopId;


    // 사용자 포인트 및 총 주문 금액 계산 (컴포넌트 마운트 시, user/orderItemsFromSource 변경 시)
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

        const calculatedTotalPrice = orderItemsFromSource.reduce((sum, item) => {
            let itemPrice = 0;
            let quantity = 0;
            let optionsPrice = 0; // 옵션 가격도 합산되어야 합니다.

            // cakeDetailDTO가 있는 경우 (예: DirectItem)
            if (item.cakeDetailDTO) {
                itemPrice = item.cakeDetailDTO.price;
                quantity = item.productCnt;
                // item.options는 Map<Long, Integer> (mappingId, count) 형태
                if (item.options && typeof item.options === 'object') { // options가 객체인지 확인
                    optionsPrice = Object.entries(item.options).reduce((acc, [mappingId, count]) => {
                        // item.cakeDetailDTO.options 배열에서 해당 mappingId를 가진 옵션 매핑을 찾음
                        const foundOptionMapping = item.cakeDetailDTO.options?.find(
                            (optMap) => String(optMap.mappingId) === mappingId // mappingId는 String으로 넘어올 수 있음
                        );
                        if (foundOptionMapping && foundOptionMapping.optionItem) {
                            return acc + (foundOptionMapping.optionItem.price * count);
                        }
                        return acc;
                    }, 0);
                }
            }
            // CartItem에서 온 경우
            else if (item.cakeItem) { // CartItem의 경우 item.cakeItem이 존재
                itemPrice = item.cakeItem.price; // 또는 item.unitPrice
                quantity = item.quantity; // CartItem은 quantity 속성 사용
                // item.options는 Map<Long, Integer> (mappingId, count) 형태
                if (item.options && typeof item.options === 'object') { // options가 객체인지 확인
                    optionsPrice = Object.entries(item.options).reduce((acc, [mappingId, count]) => {
                        // CartItem의 경우, item.cakeItem.options에 해당 옵션 정보가 있을 수 있음
                        const foundOptionMapping = item.cakeItem.options?.find( // item.cakeItem.options 확인
                            (optMap) => String(optMap.mappingId) === mappingId
                        );
                        if (foundOptionMapping && foundOptionMapping.optionItem) {
                            return acc + (foundOptionMapping.optionItem.price * count);
                        }
                        return acc;
                    }, 0);
                }
            }
            // 기타 직접 넘어온 아이템 (selectedItems의 아이템 구조가 다를 수 있음)
            else {
                itemPrice = item.price;
                quantity = item.productCnt || item.quantity; // productCnt 또는 quantity 사용
                if (item.options && typeof item.options === 'object') { // options가 객체인지 확인
                    // 이 경우 item.options의 구조가 Map<Long, Integer>인지, 아니면
                    // [{ id: X, price: Y, quantity: Z }, ...] 형태인지 명확히 해야 합니다.
                    // Map 형태라고 가정하고 Object.entries 사용
                    optionsPrice = Object.entries(item.options).reduce((acc, [mappingId, count]) => {
                        // 이 'item'의 옵션 가격을 어떻게 찾아올 것인지에 대한 추가 로직이 필요합니다.
                        // 만약 `item` 자체에 `allOptions` 같은 필드가 있다면 활용할 수 있습니다.
                        // 여기서는 임시로 0으로 처리하거나, 위와 유사하게 찾도록 가정합니다.
                        const foundOptionMapping = item.allOptions?.find( // 예시: item.allOptions 확인
                            (optMap) => String(optMap.mappingId) === mappingId
                        );
                        if (foundOptionMapping && foundOptionMapping.optionItem) {
                            return acc + (foundOptionMapping.optionItem.price * count);
                        }
                        return acc;
                    }, 0);
                }
            }
            return sum + (itemPrice * quantity) + optionsPrice; // 옵션 가격도 합산
        }, 0);
        setTotalOrderPrice(calculatedTotalPrice);

    }, [user, orderItemsFromSource, location.state]);

    // 포인트 사용 금액 변경 시 최종 결제 금액 업데이트
    useEffect(() => {
        const parsedPoints = parseInt(pointsToUse) || 0;
        let appliedDiscount = 0;

        const actualPointsToUse = Math.min(parsedPoints, userPoints);
        appliedDiscount = Math.min(actualPointsToUse, totalOrderPrice);

        setDiscountAmount(appliedDiscount);
        setFinalPaymentPrice(totalOrderPrice - appliedDiscount);
    }, [pointsToUse, userPoints, totalOrderPrice]);

    // --- 캘린더 및 매장/시간 선택 핸들러 ---

    // 캘린더에서 날짜 변경 시 (가장 먼저 호출)
    const handleCalendarDateChange = async (date) => {
        setSelectedDate(date);
        setSelectedShop(null); // 날짜 변경 시 매장 및 시간 초기화
        setSelectedTime(null);
        setAvailableShops([]); // 매장 목록 초기화 (여러 매장 시나리오)
        setShopOperatingHours(null); // 운영 시간 초기화
        setOccupiedTimeSlots([]); // 예약 시간 초기화

        const dateString = date.toISOString().split('T')[0];

        try {
            if (initialShopIdFromProps) { // ⭐ CASE 1: shopId가 이미 고정된 경우 (예: 케이크 상세에서 '바로 주문') ⭐
                // 해당 고정 매장의 운영 시간과 예약된 시간만 조회
                const hours = await getShopOperatingHours(initialShopIdFromProps, dateString);
                setShopOperatingHours(hours);
                const occupied = await getOccupiedTimeSlots(initialShopIdFromProps, dateString);
                setOccupiedTimeSlots(occupied);
                // 고정된 매장 정보를 selectedShop에 설정 (UI에 표시하기 위함)
                // 실제 매장 정보 (이름, 주소)는 getShopDetails API로 가져와서 설정하는 것이 더 좋음
                setSelectedShop({ shopId: initialShopIdFromProps, shopName: "지정된 매장", address: "" }); // 임시 정보
            } else { // ⭐ CASE 2: 여러 매장 중 사용자가 선택해야 하는 경우 ⭐
                // 특정 날짜에 예약 가능한 모든 매장 목록 조회
                const shops = await getAvailableShops(dateString); // API는 getAvailableShopsByDate 호출
                setAvailableShops(shops);
            }
        } catch (error) {
            console.error('예약 가능한 매장/시간 조회 실패:', error);
            alert('예약 가능한 매장/시간을 불러오는 데 실패했습니다.');
            setAvailableShops([]);
            setShopOperatingHours(null);
            setOccupiedTimeSlots([]);
        }
    };

    // 매장 목록에서 매장 선택 시 (CASE 2 시나리오에서 호출)
    const handleShopSelect = async (shop) => {
        setSelectedShop(shop);
        setSelectedTime(null); // 매장 변경 시 시간 초기화

        const dateString = selectedDate.toISOString().split('T')[0];

        try {
            // 선택된 매장의 운영 시간 및 예약된 시간대 조회
            const hours = await getShopOperatingHours(shop.shopId, dateString);
            setShopOperatingHours(hours);
            const occupied = await getOccupiedTimeSlots(shop.shopId, dateString);
            setOccupiedTimeSlots(occupied);
        } catch (error) {
            console.error('매장 시간 정보 조회 실패:', error);
            alert('선택된 매장의 시간 정보를 불러오는 데 실패했습니다.');
            setShopOperatingHours(null);
            setOccupiedTimeSlots([]);
        }
    };

    // 시간 버튼 클릭 시
    const handleTimeSelect = (time) => {
        setSelectedTime(time); // 선택된 시간 상태 업데이트
        console.log('최종 선택된 시간:', time);
    };

    // 캘린더 타일 비활성화 로직
    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 날짜만 비교

            if (date.getTime() < today.getTime()) {
                return true; // 지난 날짜 비활성화
            }
            // TODO: 백엔드에서 제공하는 휴무일, 예약 마감일 정보로 캘린더 타일 비활성화 로직 추가 가능
        }
        return false;
    };

    // 매장 운영 시간을 기반으로 시간대 목록 생성
    const generateTimeSlots = (open, close) => {
        if (!open || !close || !selectedDate) return [];
        const slots = [];
        const [openHour, openMinute] = open.split(':').map(Number);
        const [closeHour, closeMinute] = close.split(':').map(Number);

        let current = new Date(selectedDate);
        current.setHours(openHour, openMinute, 0, 0);

        const closeTime = new Date(selectedDate);
        closeTime.setHours(closeHour, closeMinute, 0, 0);

        // 다음날 자정 이후까지 영업하는 경우 처리 (예: 22:00 ~ 02:00)
        // 현재 날짜의 자정 (24:00)을 넘어가는 시간 슬롯 포함
        if (openHour > closeHour || (openHour === closeHour && openMinute > closeMinute)) {
            // 자정 이전 시간 슬롯 추가 (openHour ~ 23:59)
            while (current.getHours() < 24) {
                slots.push(current.toTimeString().substring(0, 5));
                current.setMinutes(current.getMinutes() + 30);
            }
            // 다음날 시작
            current = new Date(selectedDate);
            current.setDate(current.getDate() + 1); // 날짜를 다음 날로 설정
            current.setHours(0, 0, 0, 0); // 다음 날 자정으로 설정
            // 다음 날 자정부터 closeTime까지 시간 슬롯 추가
            while (current.getHours() < closeHour || (current.getHours() === closeHour && current.getMinutes() <= closeMinute)) {
                slots.push(current.toTimeString().substring(0, 5));
                current.setMinutes(current.getMinutes() + 30);
            }
        } else {
            // 일반적인 영업 시간 (같은 날 내에서)
            while (current.getTime() < closeTime.getTime()) {
                slots.push(current.toTimeString().substring(0, 5)); // HH:MM 형식
                current.setMinutes(current.getMinutes() + 30); // 30분 간격
            }
        }
        return slots;
    };


    const timeSlots = selectedDate && shopOperatingHours
        ? generateTimeSlots(shopOperatingHours.openTime, shopOperatingHours.closeTime)
        : [];

    // 포인트 입력 핸들러
    const handlePointsToUseChange = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, '');
        setPointsToUse(numericValue);
    };

    // "모두 사용" 버튼 핸들러
    const handleUseAllPoints = () => {
        setPointsToUse(String(userPoints));
    };


    // 주문 제출 핸들러 (수정된 유효성 검사 및 페이로드)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 최종 유효성 검사 (캘린더 기반으로 변경)
        if (!orderItemsFromSource || orderItemsFromSource.length === 0) {
            alert("주문할 상품이 없습니다.");
            return;
        }
        if (!selectedDate || !selectedTime) { // 픽업 날짜/시간 필수
            alert("픽업 날짜와 시간을 선택해주세요.");
            return;
        }
        if (!finalShopId) { // 최종 매장 ID 필수
            alert("픽업 매장을 선택해주세요.");
            return;
        }
        if (finalPaymentPrice < 0) { // 결제 금액 0원 미만 불가
            alert("결제 금액이 0원 미만이 될 수 없습니다. 포인트 사용을 조절해주세요.");
            return;
        }

        const cartItemIds = [];
        const directItems = [];

        orderItemsFromSource.forEach(item => {
            if (item.cartItemId) { // 장바구니 아이템인 경우
                cartItemIds.push(item.cartItemId);
            } else { // 바로구매 아이템인 경우
                // item.options는 Map<Long, Integer> 형태로 넘어왔을 때 객체임
                // 백엔드 요청 페이로드의 options는 { mappingId: count } 형태여야 함.
                const optionsPayload = {};
                if (item.options && typeof item.options === 'object') {
                    Object.entries(item.options).forEach(([mappingId, count]) => {
                        // mappingId를 숫자형으로 변환하여 사용 (백엔드가 Long을 기대하므로)
                        optionsPayload[Number(mappingId)] = count;
                    });
                }
                directItems.push({

                    shopId: finalShopId, // ⭐ finalShopId 사용 ⭐
                    cakeId: item.cakeDetailDTO?.cakeId || item.cakeId, // DirectItem은 cakeDetailDTO 안에 cakeId가 있을 수 있음
                    cakeItemId: item.cakeDetailDTO?.cakeId || item.cakeId, // CakeItem 엔티티의 ID, 보통 cakeId와 동일하게 사용
                    quantity: item.productCnt,
                    options: optionsPayload // 올바르게 변환된 옵션 객체
                });
            }
        });

        const payload = {
            shopId: finalShopId, // ⭐ finalShopId 사용 ⭐
            cartItemIds: cartItemIds.length > 0 ? cartItemIds : undefined,
            directItems: directItems.length > 0 ? directItems : undefined,
            pickupDate: selectedDate.toISOString().split('T')[0], // ⭐ selectedDate 사용 ⭐
            pickupTime: selectedTime + ":00", // ⭐ selectedTime 사용 ⭐
            orderNote: orderNote,
            usedPoints: discountAmount,
        };

        console.log("전송될 payload:", payload);

        try {
            // ⭐⭐⭐ 수정된 부분 시작 ⭐⭐⭐
            // buyerOrderApi.js의 createOrder 함수가 이미 response.data를 반환하도록 수정했으므로
            // responseData 변수 자체가 서버의 실제 응답 데이터를 가리킵니다.
            const responseData = await createOrder(payload); // createOrder 함수는 주문 ID를 포함한 응답을 줘야 함

            // 서버 응답에서 주문 ID를 추출합니다.
            // 이제 responseData는 서버에서 실제 보내준 JSON 객체이므로,
            // orderId 필드가 직접 있을 것입니다 (예: { "orderId": 123, ... }).
            const newOrderId = responseData.orderId; // ⭐⭐⭐ 바로 orderId에 접근! ⭐⭐⭐

            if (newOrderId) {
                alert("주문이 완료되었습니다.");
                // ⭐⭐⭐ 주문 상세 페이지로 이동 ⭐⭐⭐
                navigate(`/buyer/orders/${newOrderId}`); // 추출된 주문 ID를 사용하여 이동
            } else {
                // orderId를 받지 못했을 경우의 처리
                console.error("주문은 생성되었으나, 서버 응답에서 orderId를 찾을 수 없습니다.", responseData); // responseData로 변경
                alert("주문이 완료되었으나, 주문 상세 페이지로 이동할 수 없습니다. 주문 목록에서 확인해주세요.");
                navigate("/buyer/orders"); // 안전하게 주문 목록으로 리다이렉트
            }
            // ⭐⭐⭐ 수정된 부분 끝 ⭐⭐⭐

            if (cartItemIds.length > 0 && (!directItems || directItems.length === 0)) {
                clearCart(); // 장바구니에서 주문했으면 장바구니 비우기
            }

        } catch (error) {
            console.error("주문 생성 실패 (catch 블록 진입):", error);
            console.log("Full error object from catch:", error);

            if (error.response) {
                const errorMessage = error.response.data.message || error.response.data.detail || '알 수 없는 서버 오류';
                // 스케줄 관련 오류 메시지 처리 강화 (백엔드 ShopScheduleServiceImpl에서 던지는 메시지)
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
            {/* 왼쪽 섹션: 캘린더 */}
            <div style={{ flex: '1 1 45%', minWidth: '320px', marginBottom: '20px' }}>
                <h2>1. 픽업 날짜를 선택해주세요</h2>
                <div style={{ width: '100%', maxWidth: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', margin: '0 auto' }}>
                    <Calendar
                        onChange={handleCalendarDateChange}
                        value={selectedDate}
                        minDate={new Date()}
                        maxDate={new Date(now.setMonth(now.getMonth() + 3))} // 오늘로부터 3개월 뒤
                        selectRange={false}
                        tileDisabled={tileDisabled}
                        className="react-calendar-custom"
                    />
                </div>
                {selectedDate && (
                    <p style={{ marginTop: '15px', fontSize: '1.1em', fontWeight: 'bold', textAlign: 'center' }}>
                        선택된 날짜: {selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                    </p>
                )}
            </div>

            {/* 오른쪽 섹션: 예약 가능한 매장 목록 또는 시간 선택 */}
            <div style={{ flex: '1 1 45%', minWidth: '350px', marginBottom: '20px' }}>
                {initialShopIdFromProps ? ( // ⭐ CASE 1: shopId가 이미 고정된 경우 (예: 케이크 상세에서 바로 주문) ⭐
                    <>
                        <h2>2. 픽업 시간을 선택해주세요</h2>
                        {selectedDate && shopOperatingHours ? (
                            shopOperatingHours.isClosed ? ( // 매장이 휴무일인 경우
                                <p style={{ textAlign: 'center', color: '#dc3545', fontStyle: 'italic', padding: '20px', border: '1px dashed #f5c6cb', borderRadius: '8px' }}>
                                    매장 휴무일입니다: {shopOperatingHours.message || '예약 불가능'}
                                </p>
                            ) : ( // 매장이 휴무일이 아닐 경우 시간 슬롯 표시
                                timeSlots.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', maxHeight: '600px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}>
                                        {timeSlots.map((time, index) => {
                                            const isBooked = occupiedTimeSlots.includes(time);
                                            const currentTime = new Date();
                                            const slotDateTime = new Date(selectedDate);
                                            const [slotHour, slotMinute] = time.split(':').map(Number);
                                            slotDateTime.setHours(slotHour, slotMinute, 0, 0);

                                            const isPast = selectedDate.toDateString() === currentTime.toDateString() && slotDateTime <= currentTime;

                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleTimeSelect(time)}
                                                    disabled={isBooked || isPast}
                                                    style={{
                                                        padding: '10px 15px',
                                                        border: `1px solid ${selectedTime === time ? '#007bff' : '#ddd'}`,
                                                        borderRadius: '5px',
                                                        backgroundColor: isBooked || isPast ? '#f0f0f0' : (selectedTime === time ? '#eaf4ff' : 'white'),
                                                        color: isBooked || isPast ? '#bbb' : '#333',
                                                        cursor: isBooked || isPast ? 'not-allowed' : 'pointer',
                                                        fontWeight: selectedTime === time ? 'bold' : 'normal',
                                                        transition: 'background-color 0.2s, border-color 0.2s',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {time}
                                                    {isPast && <span style={{fontSize: '0.8em', display: 'block', color: 'red'}}> (지남)</span>}
                                                    {isBooked && <span style={{fontSize: '0.8em', display: 'block', color: '#888'}}> (예약됨)</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                                        선택하신 날짜에 예약 가능한 시간대가 없습니다 (영업 시간: {shopOperatingHours.openTime?.substring(0,5)}~{shopOperatingHours.closeTime?.substring(0,5)}).
                                    </p>
                                )
                            )
                        ) : (
                            <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                                날짜를 선택하면 예약 가능한 시간이 표시됩니다.
                            </p>
                        )}
                    </>
                ) : ( // ⭐ CASE 2: 여러 매장 중 사용자가 선택해야 하는 경우 ⭐
                    <>
                        <h2>2. 예약 가능한 매장을 선택해주세요</h2>
                        {selectedDate ? (
                            availableShops.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, maxHeight: '600px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px' }}>
                                    {availableShops.map((shop) => (
                                        <li key={shop.shopId}
                                            style={{
                                                marginBottom: '10px',
                                                border: `2px solid ${selectedShop?.shopId === shop.shopId ? '#007bff' : '#eee'}`,
                                                padding: '15px',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                backgroundColor: selectedShop?.shopId === shop.shopId ? '#eaf4ff' : '#f9f9f9',
                                                transition: 'background-color 0.2s, border-color 0.2s',
                                            }}
                                            onClick={() => handleShopSelect(shop)}
                                            onMouseOver={e => e.currentTarget.style.backgroundColor = selectedShop?.shopId === shop.shopId ? '#eaf4ff' : '#eef'}
                                            onMouseOut={e => e.currentTarget.style.backgroundColor = selectedShop?.shopId === shop.shopId ? '#eaf4ff' : '#f9f9f9'}
                                        >
                                            <strong style={{ fontSize: '1.2em', color: '#333' }}>{shop.shopName}</strong>
                                            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>{shop.address}</p>
                                            <p style={{ fontSize: '0.8em', color: '#999' }}>
                                                영업 시간: {shop.openTime?.substring(0, 5)} ~ {shop.closeTime?.substring(0, 5)}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                                    선택하신 날짜에 예약 가능한 매장이 없습니다.
                                </p>
                            )
                        ) : (
                            <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px', border: '1px dashed #ccc', borderRadius: '8px' }}>
                                날짜를 선택하면 예약 가능한 매장이 표시됩니다.
                            </p>
                        )}
                    </>
                )}
            </div>

            {/* 하단 섹션: 요청사항, 포인트, 결제 정보, 주문 버튼 */}
            {/* 최종 주문 버튼 활성화 조건: 날짜 선택 AND (매장 고정 시 시간 선택 OR 매장 선택 후 시간 선택) */}
            {selectedDate && (initialShopIdFromProps ? selectedTime : (selectedShop && selectedTime)) && (
                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    border: '1px solid #007bff',
                    borderRadius: '8px',
                    backgroundColor: '#eaf4ff',
                    width: '100%',
                    flexBasis: '100%'
                }}>
                    <h2 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '15px' }}>3. 주문 정보 확인 및 결제</h2>

                    {selectedShop && ( // 매장 정보는 selectedShop에서 가져와 표시
                        <p style={{ marginBottom: '15px', fontSize: '1.1em', fontWeight: 'bold', textAlign: 'center' }}>
                            선택된 매장: {selectedShop.shopName} ({selectedShop.address})
                        </p>
                    )}


                    {/* 요청사항 섹션 */}
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="orderNote" style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>요청사항 (선택 사항)</label>
                        <textarea
                            id="orderNote"
                            rows="3"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                            placeholder="예) 초콜릿 토핑 추가해주세요, 문 앞에 놓아주세요."
                            value={orderNote}
                            onChange={(e) => setOrderNote(e.target.value)}
                        ></textarea>
                    </div>

                    {/* 포인트 사용 섹션 */}
                    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #a0a0ff', borderRadius: '8px', backgroundColor: '#e0e0ff' }}>
                        <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '10px' }}>포인트 사용</h3>
                        <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>보유 포인트: <span style={{ fontWeight: 'bold', color: '#6a0dad' }}>{userPoints.toLocaleString()} P</span></p>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="number"
                                id="pointsToUse"
                                style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                placeholder="사용할 포인트를 입력하세요"
                                value={pointsToUse}
                                onChange={handlePointsToUseChange}
                                min="0"
                                max={userPoints}
                            />
                            <button
                                type="button"
                                onClick={handleUseAllPoints}
                                style={{ padding: '10px 15px', backgroundColor: '#6a0dad', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                disabled={userPoints === 0 || totalOrderPrice === 0}
                            >
                                모두 사용
                            </button>
                        </div>
                        <p style={{ fontSize: '1em', fontWeight: 'bold', marginTop: '10px' }}>적용 할인: <span style={{ color: '#dc3540' }}>-{discountAmount.toLocaleString()}원</span></p>
                    </div>

                    {/* 결제 정보 섹션 */}
                    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #70e081', borderRadius: '8px', backgroundColor: '#e0ffe0' }}>
                        <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '10px' }}>최종 결제 정보</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span>기존 주문 금액:</span>
                            <span style={{ fontWeight: 'bold' }}>{totalOrderPrice.toLocaleString()}원</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>포인트 할인:</span>
                            <span style={{ fontWeight: 'bold', color: '#dc3545' }}>-{discountAmount.toLocaleString()}원</span>
                        </div>
                        <hr style={{ borderTop: '1px solid #ccc', margin: '10px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '1.3em', fontWeight: 'bold' }}>최종 결제 금액:</span>
                            <span style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#007bff' }}>{finalPaymentPrice.toLocaleString()}원</span>
                        </div>
                    </div>

                    {/* 최종 확인 및 주문하기 버튼 */}
                    <div style={{ textAlign: 'center' }}>
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
        </form>
    );
}

export default CreateOrder;