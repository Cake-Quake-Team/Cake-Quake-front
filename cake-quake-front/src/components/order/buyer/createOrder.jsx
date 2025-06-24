import { useState } from "react";
import { useNavigate } from "react-router"; // react-router-dom 사용 시 useNavigate는 'react-router-dom'에서 import
import { createOrder } from "../../../api/buyerOrderApi";
import useCart from '../../../hooks/useCart';

const CreateOrder = () => {
    const navigate = useNavigate();
    const { items } = useCart(); // 장바구니 아이템

    // 폼 입력값 상태
    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [orderNote, setOrderNote] = useState("");

    // 장바구니 아이템 전체 및 첫 번째 아이템의 로그는 디버깅 후 제거합니다.
    console.log("CreateOrder 컴포넌트 렌더링 - 장바구니 아이템 전체:", items);
    if (items && items.length > 0) {
        console.log("CreateOrder 컴포넌트 렌더링 - 첫 번째 장바구니 아이템:", items[0]);
    }

    // shopId 추출 로직
    // 장바구니 아이템이 비어있지 않고, 첫 번째 아이템에 shopId 필드가 있다고 가정
    // 만약 items[0].shopId가 아닌 다른 경로(예: items[0].product.shopId)라면 해당 경로로 수정
    const shopId = (items && items.length > 0) ? items[0].shopId : null; // ✅ shopId를 가져오는 올바른 방법

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사 (shopId 유효성 검사 추가)
        if (!items.length) {
            alert("장바구니가 비어 있습니다.");
            return;
        }
        if (!pickupDate || !pickupTime) {
            alert("픽업 날짜와 시간을 선택해주세요.");
            return;
        }
        if (shopId === null) { // shopId가 null인 경우 (장바구니가 비어 있거나 아이템에 shopId 정보가 없을 때)
            alert("가게 정보가 없습니다. 장바구니를 확인해주세요.");
            return;
        }

        const cartItemIds = items.map((item) => item.cartItemId); // 장바구니 아이템 ID 추출

        // 백엔드 DTO(CreateOrder.Request)에 맞춰 payload 객체 구성
        const payload = {
            shopId: shopId, // ✅ `this.shopId` 대신 위에서 선언한 `shopId` 변수 사용
            cartItemIds: cartItemIds,
            directItems: [], // 현재는 카트 주문이므로 directItems는 빈 배열
            pickupDate: pickupDate, // "YYYY-MM-DD" 형태의 문자열
            pickupTime: pickupTime + ":00", // "HH:MM:SS" 형태의 문자열 (LocalTime 파싱을 위해 초 추가)
            orderNote: orderNote,
        };

        console.log("전송될 payload:", payload); // 실제 전송될 데이터 확인

        try {
            await createOrder(payload);
            alert("주문이 완료되었습니다.");
            navigate("/buyer/orders"); // 주문 목록 페이지로 이동
        } catch (error) {
            console.error("주문 생성 실패:", error);
            // 서버에서 받은 상세 에러 메시지 표시 (UX 개선)
            if (error.response) {
                console.error("응답 데이터:", error.response.data);
                console.error("응답 상태:", error.response.status);
                // 서버에서 'message' 필드에 에러 메시지를 담아 보낸다고 가정
                alert(`주문 생성 중 오류가 발생했습니다: ${error.response.data.message || '알 수 없는 서버 오류'}`);
            } else {
                // 네트워크 오류 등 서버 응답이 없는 경우
                alert("주문 생성 중 네트워크 오류가 발생했습니다.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded space-y-4">
            <h2 className="text-lg font-bold">주문 정보 입력</h2>

            {/* shopId 표시: `this.shopId` 대신 위에서 선언한 `shopId` 변수 사용 */}
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