import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { createOrder } from "../../../api/buyerOrderApi";
import useCart from '../../../hooks/useCart';
import { useAuth } from '../../../store/AuthContext';
import { getPointBalance } from '../../../api/pointApi';

const CreateOrder = ({ shopId: propShopId, pickupDate: propPickupDate, pickupTime: propPickupTime }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { items: cartItems, clearCart } = useCart();

    const orderItemsFromSource = location.state?.selectedItems || cartItems;

    // --- 픽업 날짜, 시간, 가게 ID 초기화 로직 ---
    // location.state에서 우선적으로 가져오고, 없으면 prop으로 받은 값을 사용
    const initialPickupDate = location.state?.pickupDate || propPickupDate || "";
    const initialPickupTime = location.state?.pickupTime || propPickupTime || "";

    // shopId는 location.state에서 우선, 그 다음 propShopId, 마지막으로 orderItemsFromSource에서 추출
    // 이 값은 CreateOrder 페이지에서 변경되지 않는 '고정' 값으로 사용됨
    const shopId = location.state?.shopId || propShopId || (() => {
        let extracted = null;
        if (orderItemsFromSource && orderItemsFromSource.length > 0) {
            if (orderItemsFromSource[0].shopId !== undefined) {
                extracted = orderItemsFromSource[0].shopId;
            } else if (orderItemsFromSource[0].cakeItem?.shopId !== undefined) {
                extracted = orderItemsFromSource[0].cakeItem.shopId;
            } else if (orderItemsFromSource[0].cakeDetailDTO?.shopId !== undefined) {
                extracted = orderItemsFromSource[0].cakeDetailDTO.shopId;
            }
        }
        return extracted;
    })();

    // 픽업 날짜와 시간은 사용자가 변경할 수 있는 상태로 유지
    const [pickupDate, setPickupDate] = useState(initialPickupDate);
    const [pickupTime, setPickupTime] = useState(initialPickupTime);

    // 나머지 상태들은 기존과 동일
    const [orderNote, setOrderNote] = useState("");
    const [userPoints, setUserPoints] = useState(0);
    const [pointsToUse, setPointsToUse] = useState("");
    const [totalOrderPrice, setTotalOrderPrice] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalPaymentPrice, setFinalPaymentPrice] = useState(0);

    // --- 픽업 시간 옵션 생성 함수 (유지) ---
    const generateTimeOptions = () => {
        const times = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const hour = String(h).padStart(2, '0');
                const minute = String(m).padStart(2, '0');
                times.push(`${hour}:${minute}`);
            }
        }
        return times;
    };
    const timeOptions = generateTimeOptions();


    // 디버깅용 console.log: 초기 값 확인 (필요 없으면 제거해도 됨)
    useEffect(() => {
        console.log("CreateOrder Mounted. Initial Values:");
        console.log("Initial Pickup Date:", initialPickupDate);
        console.log("Initial Pickup Time:", initialPickupTime);
        console.log("Determined Shop ID:", shopId); // shopId가 어떻게 결정되었는지 확인
        console.log("Order Items from Source:", orderItemsFromSource);
        orderItemsFromSource.forEach((item, index) => {
            console.log(`Item ${index} options:`, item.options, `(Type: ${typeof item.options}, Is Array: ${Array.isArray(item.options)})`);
        });
    }, [initialPickupDate, initialPickupTime, shopId, orderItemsFromSource]);


    // 기존 useEffect (포인트, 총 가격 계산) 로직은 그대로 유지
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
            let optionsPrice = 0;

            if (item.cakeDetailDTO) {
                itemPrice = item.cakeDetailDTO.price;
                quantity = item.productCnt;
                if (item.options && Array.isArray(item.options)) {
                    optionsPrice = item.options.reduce((acc, opt) => acc + (opt.price * opt.optionCnt), 0);
                }
            } else if (item.cakeItem) {
                itemPrice = item.cakeItem.price;
                quantity = item.productCnt;
                if (item.options && Array.isArray(item.options)) {
                    optionsPrice = item.options.reduce((acc, opt) => acc + (opt.price * opt.optionCnt), 0);
                }
            } else {
                itemPrice = item.price;
                quantity = item.productCnt;
                if (item.options && Array.isArray(item.options)) {
                    optionsPrice = item.options.reduce((acc, opt) => acc + (opt.price * opt.optionCnt), 0);
                }
            }
            return sum + (itemPrice * quantity) + optionsPrice;
        }, 0);
        setTotalOrderPrice(calculatedTotalPrice);

    }, [user, orderItemsFromSource]);


    useEffect(() => {
        const parsedPoints = parseInt(pointsToUse) || 0;
        let appliedDiscount = 0;

        const actualPointsToUse = Math.min(parsedPoints, userPoints);
        appliedDiscount = Math.min(actualPointsToUse, totalOrderPrice);

        setDiscountAmount(appliedDiscount);
        setFinalPaymentPrice(totalOrderPrice - appliedDiscount);
    }, [pointsToUse, userPoints, totalOrderPrice]);

    const handlePointsToUseChange = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, '');
        setPointsToUse(numericValue);
    };

    const handleUseAllPoints = () => {
        setPointsToUse(String(userPoints));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!orderItemsFromSource || orderItemsFromSource.length === 0) {
            alert("주문할 상품이 없습니다.");
            return;
        }
        if (!pickupDate || !pickupTime) {
            alert("픽업 날짜와 시간을 선택해주세요.");
            return;
        }
        // shopId는 고정 값으로 사용되므로, 반드시 존재하는지 확인
        if (!shopId) {
            alert("가게 정보가 없습니다. 주문을 진행할 수 없습니다.");
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
                directItems.push({
                    shopId: shopId, // shopId는 고정 값
                    cakeId: item.cakeId,
                    cakeItemId: item.cakeItemId,
                    quantity: item.productCnt,
                    options: (item.options && Array.isArray(item.options)) ? item.options.reduce((acc, opt) => {
                        if (opt.mappingId !== undefined && opt.optionCnt !== undefined) {
                            acc[opt.mappingId] = opt.optionCnt;
                        } else {
                            console.warn("Direct order option missing mappingId or optionCnt:", opt);
                        }
                        return acc;
                    }, {}) : {}
                });
            }
        });

        const payload = {
            shopId: shopId,
            cartItemIds: cartItemIds.length > 0 ? cartItemIds : undefined,
            directItems: directItems.length > 0 ? directItems : undefined,
            pickupDate: pickupDate,
            pickupTime: pickupTime,
            orderNote: orderNote,
            usedPoints: discountAmount,
        };

        console.log("전송될 payload:", payload);

        try {
            await createOrder(payload);

            alert("주문이 완료되었습니다.");
            navigate("/buyer/orders");

            if (cartItemIds.length > 0 && (!directItems || directItems.length === 0)) {
                clearCart();
            }

        } catch (error) {
            console.error("주문 실패했습니다. 다시 한번 더 시도해주세요:", error);
            console.log("Full error object from catch:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded space-y-4">
            <h2 className="text-lg font-bold text-center mb-4">주문 정보 입력</h2>

            {/* shopId는 이제 상단에 읽기 전용으로만 표시 */}
            {shopId && (
                <div className="border p-4 rounded-lg shadow-sm space-y-2 bg-gray-50 border-gray-200">
                    <h3 className="font-semibold text-lg text-gray-800">픽업 가게 정보</h3>
                    <div className="flex justify-between items-center">
                        <p className="text-gray-700 font-medium">선택 가게 ID:</p>
                        <p className="font-bold text-lg text-blue-600">{shopId}</p>
                    </div>
                    {/* 만약 가게 이름도 함께 location.state로 넘어온다면 shopId 대신 가게 이름을 여기에 표시 */}
                    {/* <div className="flex justify-between items-center">
                        <p className="text-gray-700 font-medium">가게 이름:</p>
                        <p className="font-bold text-lg text-blue-600">{location.state?.shopName || "정보 없음"}</p>
                    </div> */}
                </div>
            )}
            {!shopId && (
                <div className="p-2 bg-red-100 border border-red-300 text-red-700 rounded text-sm mb-4">
                    가게 정보가 누락되었습니다. 주문을 진행할 수 없습니다.
                </div>
            )}


            {/* 픽업 날짜 입력 필드 (사용자 변경 가능) */}
            <div>
                <label htmlFor="pickupDate" className="block font-medium mb-1">픽업 날짜</label>
                <input
                    type="date"
                    id="pickupDate"
                    className="w-full border rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                />
            </div>

            {/* 픽업 시간 선택 필드 (사용자 변경 가능) */}
            <div>
                <label htmlFor="pickupTime" className="block font-medium mb-1">픽업 시간</label>
                <select
                    id="pickupTime"
                    className="w-full border rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                >
                    <option value="">시간 선택</option>
                    {timeOptions && timeOptions.map((time) => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="orderNote" className="block font-medium mb-1">요청사항</label>
                <textarea
                    id="orderNote"
                    rows="3"
                    className="w-full border rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예) 초콜릿 토핑 추가해주세요"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                ></textarea>
            </div>

            <div className="border p-4 rounded-lg shadow-sm space-y-3 bg-purple-50 border-purple-200">
                <h3 className="font-semibold text-lg text-purple-800">포인트 사용</h3>
                <p className="text-sm text-gray-700">
                    보유 포인트: <span className="font-bold text-purple-700">{userPoints.toLocaleString()} P</span>
                </p>
                <div className="flex gap-2">
                    <input
                        type="number"
                        id="pointsToUse"
                        className="flex-1 border rounded px-2 py-1 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="사용할 포인트를 입력하세요"
                        value={pointsToUse}
                        onChange={handlePointsToUseChange}
                        min="0"
                        max={userPoints}
                    />
                    <button
                        type="button"
                        onClick={handleUseAllPoints}
                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors"
                        disabled={userPoints === 0 || totalOrderPrice === 0}
                    >
                        모두 사용
                    </button>
                </div>
                <p className="text-md font-semibold text-gray-800">
                    적용 할인: <span className="text-red-500">-{discountAmount.toLocaleString()}원</span>
                </p>
            </div>

            <div className="border p-4 rounded-lg shadow-sm space-y-2 bg-green-50 border-green-200">
                <h3 className="font-semibold text-lg text-green-800">결제 정보</h3>
                <div className="flex justify-between">
                    <p className="text-gray-700">기존 주문 금액:</p>
                    <p className="font-bold">{totalOrderPrice.toLocaleString()}원</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-700">포인트 할인:</p>
                    <p className="font-bold text-red-500">-{discountAmount.toLocaleString()}원</p>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2 border-gray-300">
                    <p className="text-lg font-bold">최종 결제 금액:</p>
                    <p className="text-xl font-bold text-blue-600">{finalPaymentPrice.toLocaleString()}원</p>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                disabled={!pickupDate || !pickupTime || !shopId || finalPaymentPrice < 0}
            >
                주문하기
            </button>
        </form>
    );
};

export default CreateOrder;