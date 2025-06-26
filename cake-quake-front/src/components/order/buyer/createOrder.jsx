import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { createOrder } from "../../../api/buyerOrderApi";
import useCart from '../../../hooks/useCart';

const CreateOrder = () => {
    const navigate = useNavigate();
    const location = useLocation(); // useLocation 훅 초기화
    const { items: cartItems, clearCart } = useCart(); // 장바구니 아이템을 `cartItems`로 이름 변경, `clearCart` 추가

    // 주문할 상품 목록을 결정합니다.
    // location.state?.selectedItems는 '직접 주문하기' 버튼을 눌렀을 때 넘어오는 상품 정보
    // cartItems는 장바구니를 통해 넘어오는 상품 정보
    const orderItemsFromSource = location.state?.selectedItems || cartItems;

    // 폼 입력값 상태
    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [orderNote, setOrderNote] = useState("");

    // 디버깅용 로그: orderItemsFromSource의 실제 데이터 구조를 확인하는 데 매우 중요
    //console.log("CreateOrder 컴포넌트 렌더링 - 결정된 주문 아이템 (orderItemsFromSource):", orderItemsFromSource);

    // shopId 추출 로직 개선
    let extractedShopId = null;
    if (orderItemsFromSource && orderItemsFromSource.length > 0) {
        // 1. 아이템 객체에 shopId가 직접 포함된 경우 (직접 주문 아이템에서 흔함)
        if (orderItemsFromSource[0].shopId !== undefined) {
            extractedShopId = orderItemsFromSource[0].shopId;
        }
        // 2. CartItem처럼 cakeItem 객체 안에 shopId가 중첩된 경우 (장바구니 아이템에서 흔함)
        else if (orderItemsFromSource[0].cakeItem?.shopId !== undefined) {
            extractedShopId = orderItemsFromSource[0].cakeItem.shopId;
        }
        // 3. 페이지 라우터 state에 shopId가 직접 전달된 경우 (CreateOrderPage 같은 상위 컴포넌트에서 넘겨줄 때)
        else if (location.state?.shopId !== undefined) {
            extractedShopId = location.state.shopId;
        }
        // 4. CakeDetailDTO 안에 shopId가 있는 경우 (DirectItem이 CakeDetailDTO와 유사한 형태일 때)
        else if (orderItemsFromSource[0].cakeDetailDTO?.shopId !== undefined) {
            extractedShopId = orderItemsFromSource[0].cakeDetailDTO.shopId;
        }
    }
    const shopId = extractedShopId; // 추출된 shopId를 컴포넌트 전체에서 사용

    // 30분 단위 시간 목록 생성 함수(바꾸긴 했지만 나중에 다시 수정)
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

    const timeOptions = generateTimeOptions(); // 시간 옵션 목록을 미리 생성


    const handleSubmit = async (e) => {
        e.preventDefault();

        // 프론트엔드 유효성 검사 (API 요청 전 기본 검증)
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

        // ⭐ `cartItemIds`와 `directItems` 분류 로직 수정 ⭐
        // 백엔드 DTO의 `isEitherCartOrDirectProvided` 검증 조건에 맞춰 정확히 분류합니다.
        const cartItemIds = [];
        const directItems = [];

        orderItemsFromSource.forEach(item => {
            // ⭐ 핵심 수정: `item.cartItemId`가 존재하면 장바구니 아이템으로 간주합니다. ⭐
            if (item.cartItemId) {
                cartItemIds.push(item.cartItemId);
            } else {
                // ⭐ `item.cartItemId`가 없으면 직접 주문 아이템으로 간주하고 DirectItem DTO에 맞춰 구성합니다. ⭐
                // DirectItem DTO 필드명과 타입(@NotNull 여부)을 정확히 매핑해야 합니다.
                directItems.push({
                    shopId: shopId,
                    cakeId: item.cakeId,
                    cakeItemId: item.cakeItemId,
                    quantity: item.productCnt,
                    options: item.options ? item.options.reduce((acc, opt) => {
                        // 옵션 매핑: Map<Long, Integer> 형태
                        // opt 객체에 mappingId와 optionCnt가 있다고 가정
                        if (opt.mappingId !== undefined && opt.optionCnt !== undefined) {
                            acc[opt.mappingId] = opt.optionCnt;
                        } else {
                            console.warn("Direct order option missing mappingId or optionCnt:", opt);
                        }
                        return acc;
                    }, {}) : {} // 옵션이 없으면 빈 객체 전달
                });
            }
        });

        const payload = {
            shopId: shopId, // CreateOrder.Request의 최상위 shopId (필수)

            // `cartItemIds`와 `directItems` 중 정확히 하나만 전송되도록 합니다.
            cartItemIds: cartItemIds.length > 0 ? cartItemIds : undefined,
            directItems: directItems.length > 0 ? directItems : undefined,

            pickupDate: pickupDate, // 필수
            pickupTime: pickupTime + ":00", // 백엔드 LocalTime 형식에 맞춰 초(seconds) 추가 (필수)
            orderNote: orderNote, // 선택 사항
        };

        // ⭐ 백엔드로 전송될 최종 payload를 콘솔에 출력하여 DTO와 꼼꼼히 비교하세요 ⭐
        //console.log("전송될 payload:", payload);

        try {
            // createOrder 함수는 jwtAxios를 래핑한 것으로 추정됩니다.
            await createOrder(payload);

            alert("주문이 완료되었습니다."); // 사용자에게 성공 메시지 표시
            navigate("/buyer/orders"); // 주문 목록 페이지로 이동

            // 장바구니를 통해 주문이 진행된 경우에만 장바구니 비우기 로직
           if (cartItemIds.length > 0 && (!directItems || directItems.length === 0)) {
                clearCart();
            }

        } catch (error) {
            console.error("주문 생성 실패 (catch 블록 진입):", error);
            console.log("Full error object from catch:", error); // 전체 에러 객체 확인

            if (error.response) {
                alert(`주문 생성 중 오류가 발생했습니다: [${error.response.status}] ${error.response.data.message || error.response.data.detail || '알 수 없는 서버 오류'}`);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded space-y-4">
            <h2 className="text-lg font-bold">주문 정보 입력</h2>

            {/* shopId 표시: `shopId` 변수 사용 */}
            {shopId && <p className="text-sm text-gray-600">선택된 가게 ID: {shopId}</p>}

            <div>
                <label htmlFor="pickupDate" className="block font-medium">픽업 날짜</label>
                <input
                    type="date"
                    id="pickupDate"
                    className="w-full border rounded px-2 py-1"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required // HTML5 필수 필드 검사
                />
            </div>

            <div>
                <label htmlFor="pickupTime" className="block font-medium">픽업 시간</label>
                {/* ⭐ type="time" 대신 <select> 태그를 사용합니다. ⭐ */}
                <select
                    id="pickupTime"
                    className="w-full border rounded px-2 py-1"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                >
                    <option value="">시간 선택</option>
                    {/* 기본 옵션 */}
                    {timeOptions.map((time) => (
                        <option key={time} value={time}>
                            {time}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="orderNote" className="block font-medium">요청사항</label>
                <input
                    type="text"
                    id="orderNote"
                    className="w-full border rounded px-2 py-1"
                    placeholder="예) 초콜릿 토핑 추가해주세요"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                주문하기
            </button>
        </form>
    );
};

export default CreateOrder;