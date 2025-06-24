import OrderCard from "./OrderCake.jsx";

const tempManagedOrder = { // 임시 데이터, 실제로는 API로 받아옵니다.
    id: 2,
    cakeImage: '/cake_example_2.jpeg',
    orderName: "쁘띠 크리스마스 케이크",
    details: "1단, 과일: 딸기, 우유크림",
    dueDate: "배송 예정: 2025-12-24 16:00",
};

const OrderManagementSection = ({ onViewOrderDetails }) => {
    return (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">주문 관리</h2>
            {tempManagedOrder ? ( // 실제 데이터가 있을 때만 렌더링
                <OrderCard order={tempManagedOrder} type="managed" onActionClick={onViewOrderDetails} />
            ) : (
                <p className="text-gray-600">관리할 주문이 없습니다.</p>
            )}
        </div>
    );
};

export default OrderManagementSection;