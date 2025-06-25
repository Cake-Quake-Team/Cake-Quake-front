import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { createOrder } from "../../../api/buyerOrderApi";
import useCart from '../../../hooks/useCart';

const CreateOrder = () => {
    const navigate = useNavigate();
    const location = useLocation(); // useLocation 훅 초기화
    const { items: cartItems, clearCart } = useCart(); // 장바구니 아이템을 `cartItems`로 이름 변경, `clearCart` 추가

    // 주문할 상품 목록을 결정
    const orderItemsFromSource = location.state?.selectedItems || cartItems;

    // 폼 입력값 상태
    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [orderNote, setOrderNote] = useState("");

    // 장바구니 아이템 전체 및 첫 번째 아이템의 로그는 디버깅 후 제거합니다.
    console.log("CreateOrder 컴포넌트 렌더링 - 결정된 주문 아이템 (orderItemsFromSource):", orderItemsFromSource); // ⭐ 로그 수정 ⭐

    // shopId 추출 로직
    const shopId = (orderItemsFromSource && orderItemsFromSource.length > 0) ?
        (orderItemsFromSource[0].shopId ||          // DTO에 shopId가 직접 있는 경우 (CartItem 등)
            orderItemsFromSource[0].cakeItem?.shopId || // CartItem.cakeItem에 shopId가 있는 경우
            orderItemsFromSource[0].cakeDetailDTO?.shopId) // DirectItem에 cakeDetailDTO가 있다면
        : null; // ⭐ shopId 추출 로직 수정 ⭐

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사 (이제 `orderItemsFromSource`를 사용)
        if (!orderItemsFromSource.length) { // `items.length` 대신 `orderItemsFromSource.length` 사용 ⭐
            alert("주문할 상품이 없습니다."); // 메시지 수정
            return;
        }
        if (!pickupDate || !pickupTime) {
            alert("픽업 날짜와 시간을 선택해주세요.");
            return;
        }
        if (shopId === null) {
            alert("가게 정보가 없습니다. 주문 상품을 확인해주세요."); // ⭐ 메시지 수정 ⭐
            return;
        }

        // ⭐ `cartItemIds`와 `directItems` 분류 로직 수정 ⭐
        const cartItemIds = [];
        const directItems = [];

        orderItemsFromSource.forEach(item => {
            if (item.cartItemId) { // `cartItemId`가 있으면 장바구니 아이템으로 간주
                cartItemIds.push(item.cartItemId);
            } else { // `cartItemId`가 없으면 직접 주문 아이템으로 간주
                directItems.push({
                    cakeId: item.cakeItemId, // 백엔드 DTO에 맞게 필드명 확인 (cakeId, cakeItemId 둘 다 필요할 수도 있음)
                    cakeItemId: item.cakeItemId, // DTO에 둘 다 필요하다면 유지
                    quantity: item.productCnt,
                    options: item.options ? item.options.reduce((acc, opt) => {
                        if (opt.mappingId) { // 옵션의 mappingId가 필요
                            acc[opt.mappingId] = opt.optionCnt;
                        } else {
                            console.warn("Direct order option missing mappingId:", opt);
                        }
                        return acc;
                    }, {}) : {}
                });
            }
        });

        // 백엔드 DTO(CreateOrder.Request)에 맞춰 payload 객체 구성
        const payload = {
            shopId: shopId, // `orderItemsFromSource`에서 추출한 `shopId` 사용
            cartItemIds: cartItemIds, // ⭐ 필터링된 `cartItemIds` 사용 ⭐
            directItems: directItems, // ⭐ `directItems` 배열 사용 ⭐
            pickupDate: pickupDate,
            pickupTime: pickupTime + ":00",
            orderNote: orderNote,
        };

        console.log("전송될 payload:", payload);

        try {
            await createOrder(payload);

            alert("주문이 완료되었습니다."); // 또는 '주문 접수 완료! 이제 결제를 진행합니다.'
            navigate("/buyer/orders");// 주문 목록 페이지로 바로 이동


            // ⭐ 장바구니를 통해 주문이 진행된 경우에만 장바구니 비우기 ⭐
            // `directItems`가 비어있고 `cartItemIds`가 채워져 있다면 장바구니 주문으로 간주합니다.
            if (cartItemIds.length > 0 && directItems.length === 0) {
                clearCart(); // `useCart` 훅에서 `clearCart` 함수를 가져와 사용합니다.
            }

        } catch (error) {
            console.error("주문 생성 실패:", error);
            if (error.response) {
                console.error("응답 데이터:", error.response.data);
                console.error("응답 상태:", error.response.status);
                alert(`주문 생성 중 오류가 발생했습니다: ${error.response.data.message || '알 수 없는 서버 오류'}`);
            } else {
                alert("주문 생성 중 네트워크 오류가 발생했습니다.");
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
                />
            </div>

            <div>
                <label htmlFor="pickupTime" className="block font-medium">픽업 시간</label>
                <input
                    type="time"
                    id="pickupTime"
                    className="w-full border rounded px-2 py-1"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                />
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