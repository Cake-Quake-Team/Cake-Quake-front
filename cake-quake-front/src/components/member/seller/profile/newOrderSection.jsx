//새로운 주문

//api 받아와야함 -> 수정 필요
import OrderCard from "./OrderCake.jsx";

const tempNewOrder = {
    id: 1,
    cakeImage: '/cake_example_1.jpeg',
    customerName: "맛있었어요!",
    orderContent: "친구 생일을 위해 주문했는데, 디자인도 예쁘고 맛도 정말 좋았어요! 특히 얼그레이 크림이 일품이었어요. 주문하는 과정도 친절하게 도와주시고 답장도 빨리빨리 해주셔서 좋았어요 :) 다음에도 꼭 다시 주문할게요!",
    isConfirmed: false,
};

const NewOrdersSection = ({ onConfirmOrder }) => {
    return (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">새로운 주문</h2>
            {tempNewOrder ? ( // 실제 데이터가 있을 때만 렌더링
                <OrderCard order={tempNewOrder} type="new" onActionClick={onConfirmOrder} />
            ) : (
                <p className="text-gray-600">새로운 주문이 없습니다.</p>
            )}
        </div>
    );
};

export default NewOrdersSection;