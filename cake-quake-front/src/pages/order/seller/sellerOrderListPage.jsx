// SellerOrderListPage.jsx
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import SellerOrderList from "./SellerOrderList";
import { getSellerOrders } from "../../../api/sellerOrderApi";

const SellerOrderListPage = () => {
    const [filterType, setFilterType] = useState("ALL"); // "ALL", "LETTERING", "NORMAL"
    const status = "RESERVATION_CONFIRMED"; //

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery({
        queryKey: ["sellerOrders", status, filterType],
        queryFn: ({ pageParam = 1 }) =>
            getSellerOrders({ page: pageParam, size: 10, status, type: filterType }),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasNext ? allPages.length + 1 : undefined;
        },
    });

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const orders = data?.pages.flatMap((page) => page.content) || [];

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">판매자 주문 목록</h2>

            <div className="flex gap-2 mb-4">
                <button onClick={() => setFilterType("ALL")}>전체</button>
                <button onClick={() => setFilterType("LETTERING")}>레터링</button>
                <button onClick={() => setFilterType("NORMAL")}>일반</button>
            </div>

            <SellerOrderList orders={orders} isLoading={isLoading} error={error} />

            <div ref={ref} className="text-center py-4">
                {isFetchingNextPage && <p>다음 페이지 불러오는 중...</p>}
                {!hasNextPage && !isLoading && <p>모든 주문을 불러왔습니다.</p>}
            </div>
        </div>
    );
};

export default SellerOrderListPage;
