import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { createOrder } from "../../../api/buyerOrderApi";
import useCart from '../../../hooks/useCart';
import { useAuth } from '../../../store/AuthContext';
import { getPointBalance } from '../../../api/pointApi';

const CreateOrder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth(); // 로그인된 사용자 정보
    const { items: cartItems, clearCart } = useCart();

    const orderItemsFromSource = location.state?.selectedItems || cartItems;

    // 폼 입력값 상태 (픽업 날짜/시간은 input/select 방식 유지)
    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [orderNote, setOrderNote] = useState("");

    // ⭐ 포인트 관련 상태
    const [userPoints, setUserPoints] = useState(0); // 보유 포인트
    const [pointsToUse, setPointsToUse] = useState(""); // 사용할 포인트 입력값 (문자열로 관리)
    const [totalOrderPrice, setTotalOrderPrice] = useState(0); // 기존 주문 금액
    const [discountAmount, setDiscountAmount] = useState(0); // 포인트로 적용될 할인 금액
    const [finalPaymentPrice, setFinalPaymentPrice] = useState(0); // 최종 결제 금액

    // shopId 추출 로직
    let extractedShopId = null;
    if (orderItemsFromSource && orderItemsFromSource.length > 0) {
        if (orderItemsFromSource[0].shopId !== undefined) {
            extractedShopId = orderItemsFromSource[0].shopId;
        } else if (orderItemsFromSource[0].cakeItem?.shopId !== undefined) {
            extractedShopId = orderItemsFromSource[0].cakeItem.shopId;
        } else if (location.state?.shopId !== undefined) {
            extractedShopId = location.state.shopId;
        } else if (orderItemsFromSource[0].cakeDetailDTO?.shopId !== undefined) {
            extractedShopId = orderItemsFromSource[0].cakeDetailDTO.shopId;
        }
    }
    const shopId = extractedShopId;

    // 30분 단위 시간 목록 생성 함수 (기존 로직 유지)
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

    // 컴포넌트 마운트 시 사용자 포인트 및 총 주문 금액 계산
    useEffect(() => {
        if (user && user.userId) {
            const fetchUserPoints = async () => {
                try {
                    const points = await getPointBalance(); // getPointBalance 호출
                    setUserPoints(points);
                } catch (err) {
                    console.error("사용자 포인트를 불러오는 데 실패했습니다:", err);
                    setUserPoints(0);
                }
            };
            fetchUserPoints();
        }

        // 총 주문 금액 계산 (기존 로직 유지)
        const calculatedTotalPrice = orderItemsFromSource.reduce((sum, item) => {
            let itemPrice = 0;
            let quantity = 0;
            let optionsPrice = 0;

            if (item.cakeDetailDTO) {
                itemPrice = item.cakeDetailDTO.price;
                quantity = item.productCnt;
                if (item.options) {
                    optionsPrice = item.options.reduce((acc, opt) => acc + (opt.price * opt.optionCnt), 0);
                }
            } else if (item.cakeItem) {
                itemPrice = item.cakeItem.price;
                quantity = item.productCnt;
                if (item.options) {
                    optionsPrice = item.options.reduce((acc, opt) => acc + (opt.price * opt.optionCnt), 0);
                }
            } else {
                itemPrice = item.price;
                quantity = item.productCnt;
                if (item.options) {
                    optionsPrice = item.options.reduce((acc, opt) => acc + (opt.price * opt.optionCnt), 0);
                }
            }
            return sum + (itemPrice * quantity) + optionsPrice;
        }, 0);
        setTotalOrderPrice(calculatedTotalPrice);

    }, [user, orderItemsFromSource]);

    // 포인트 사용 금액 변경 시 최종 결제 금액 업데이트
    useEffect(() => {
        const parsedPoints = parseInt(pointsToUse) || 0;
        let appliedDiscount = 0;

        // 사용할 포인트가 보유 포인트를 초과하지 않도록
        const actualPointsToUse = Math.min(parsedPoints, userPoints);
        // 사용할 포인트가 총 주문 금액을 초과하지 않도록 (총 주문 금액을 초과하여 할인 불가)
        appliedDiscount = Math.min(actualPointsToUse, totalOrderPrice);

        setDiscountAmount(appliedDiscount);
        setFinalPaymentPrice(totalOrderPrice - appliedDiscount);
    }, [pointsToUse, userPoints, totalOrderPrice]);

    // 포인트 입력 핸들러
    const handlePointsToUseChange = (e) => {
        const value = e.target.value;
        // 숫자가 아닌 입력 제거
        const numericValue = value.replace(/[^0-9]/g, '');
        setPointsToUse(numericValue);
    };

    // "모두 사용" 버튼 핸들러
    const handleUseAllPoints = () => {
        setPointsToUse(String(userPoints)); // 보유 포인트를 문자열로 변환하여 입력 필드에 설정
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // 프론트엔드 유효성 검사
        if (!orderItemsFromSource || orderItemsFromSource.length === 0) {
            alert("주문할 상품이 없습니다.");
            return;
        }
        if (!pickupDate || !pickupTime) {
            alert("픽업 날짜와 시간을 선택해주세요.");
            return;
        }
        if (shopId === null) {
            alert("가게 정보가 없습니다. 주문 상품을 확인해주세요.");
            return;
        }
        if (finalPaymentPrice < 0) { // 최종 결제 금액이 0원 미만인 경우 방지
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
                    shopId: shopId,
                    cakeId: item.cakeId,
                    cakeItemId: item.cakeItemId,
                    quantity: item.productCnt,
                    options: item.options ? item.options.reduce((acc, opt) => {
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
            pickupTime: pickupTime + ":00",
            orderNote: orderNote,
            // 포인트 관련 필드 추가
            usedPoints: discountAmount, // 실제로 할인에 사용된 포인트 금액
        };

        console.log("전송될 payload:", payload);

        try {
            await createOrder(payload);

            alert("주문이 완료되었습니다."); // 성공 메시지 먼저 띄움
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

            {shopId && <p className="text-sm text-gray-600 text-center">선택된 가게 ID: {shopId}</p>}

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
                    {timeOptions.map((time) => (
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

            {/* ⭐ 포인트 사용 섹션 ⭐ */}
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

            {/* ⭐ 결제 정보 섹션 ⭐ */}
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
            >
                주문하기
            </button>
        </form>
    );
};

export default CreateOrder;