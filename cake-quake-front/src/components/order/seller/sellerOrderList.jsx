// src/components/order/seller/SellerOrderList.jsx
import { useEffect } from "react";
import SellerOrderItem from "./SellerOrderItem";
import { useInView } from "react-intersection-observer";

const SellerOrderList = ({ orders, isLoading, error, hasNextPage, fetchNextPage }) => {
    const { ref, inView } = useInView({ threshold: 1.0 });

    useEffect(() => {
        if (inView && hasNextPage && !isLoading) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isLoading, fetchNextPage]);

    if (isLoading && (!orders || orders.length === 0)) {
        return <div className="text-center p-8">주문 목록을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">에러가 발생했습니다: {error.message}</div>;
    }

    if (!orders || orders.length === 0) {
        return <div className="text-center p-8 text-gray-500">해당 조건의 주문이 없습니다.</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {orders.map((order, index) => {
                const isLast = index === orders.length - 1;
                return (
                    <div key={order.orderId} ref={isLast ? ref : null}>
                        <SellerOrderItem order={order} />
                    </div>
                );
            })}
        </div>
    );
};

export default SellerOrderList;
