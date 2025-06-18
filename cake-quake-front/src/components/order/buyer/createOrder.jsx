import { useState } from "react";
import { useNavigate } from "react-router";
import { createOrder } from "../../../api/buyerOrderApi";
import useCart from '../../../hooks/useCart';
import { useAuth } from '../../../store/AuthContext';

const CreateOrder = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // 로그인한 유저 정보 (user.userId)
    const { items } = useCart(); // 장바구니 아이템
    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [orderNote, setOrderNote] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!items.length) return alert("장바구니가 비어 있습니다.");
        if (!pickupDate || !pickupTime) return alert("픽업 날짜/시간을 선택해주세요.");

        const cartItemIds = items.map((item) => item.cartItemId);

        const payload = {
            cartItemIds,
            directItems: [],
            pickupDate,
            pickupTime,
            orderNote,
        };

        try {
            await createOrder(user.userId, payload);
            alert("주문이 완료되었습니다.");
            navigate("/buyer/orders"); // 주문 목록 페이지로 이동
        } catch (error) {
            console.error("주문 생성 실패:", error);
            alert("주문 생성 중 오류가 발생했습니다.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded space-y-4">
            <h2 className="text-lg font-bold">주문 정보 입력</h2>

            <div>
                <label className="block font-medium">픽업 날짜</label>
                <input
                    type="date"
                    className="w-full border rounded px-2 py-1"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                />
            </div>

            <div>
                <label className="block font-medium">픽업 시간</label>
                <input
                    type="time"
                    className="w-full border rounded px-2 py-1"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                />
            </div>

            <div>
                <label className="block font-medium">요청사항</label>
                <input
                    type="text"
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
