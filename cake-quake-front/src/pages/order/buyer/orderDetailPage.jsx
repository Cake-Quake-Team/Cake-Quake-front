// src/pages/order/buyer/orderDetailPage.jsx
import React from "react";
import { useParams } from "react-router-dom";

const OrderDetailPage = () => {
    const { orderId } = useParams();

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-xl font-bold mb-4">주문 상세</h1>
            <p>주문 ID: <strong>{orderId}</strong></p>
            <p>선택된 주문의 상세 정보를 보여주는 페이지입니다.</p>
            {/* 주문 상세 컴포넌트 연결 예정 */}
        </div>
    );
};

export default OrderDetailPage;
