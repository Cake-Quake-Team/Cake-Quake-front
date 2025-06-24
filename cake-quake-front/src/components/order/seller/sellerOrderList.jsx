import React from "react";
import SellerOrderItem from "./SellerOrderItem";


const SellerOrderList = ({ orders }) => {
    // 로딩, 에러, 데이터 없음 상태 처리


    if (!orders || orders.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500">
                해당 조건의 주문이 없습니다.
            </div>
        );
    }

    // 주문 목록 렌더링
    return (
        <div className="flex flex-col gap-4">
            {orders.map((order) => {

                return (
                    <div key={order.orderId}>
                        {/* SellerOrderItem 컴포넌트에 단일 주문 객체(order)를 props로 전달 */}
                        <SellerOrderItem order={order} />
                    </div>
                );
            })}
        </div>
    );
};

export default SellerOrderList;