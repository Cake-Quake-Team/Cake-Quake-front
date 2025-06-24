import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import SellerOrderList from "../../../components/order/seller/SellerOrderList";
import { getSellerOrderList } from "../../../api/sellerOrderApi";

const ListLoading = () => (
    <div className="text-center p-8 text-blue-600 font-semibold">
        주문 목록을 불러오는 중...
    </div>
);

const ListErrorDisplay = ({ message }) => (
    <div className="text-center p-8 text-red-500 font-semibold">
        오류 발생: {message}
    </div>
);

export default function SellerOrderListPage() {
    const { shopId } = useParams();

    const [orderStatus, setOrderStatus] = useState("RESERVATION_CONFIRMED");
    const [cakeTypeFilter, setCakeTypeFilter] = useState("ALL");

    const [page, setPage] = useState(0);
    const size = 10;

    const {
        data,
        isLoading,
        error,
        isFetching
    } = useQuery({
        queryKey: ["sellerOrders", shopId, orderStatus, cakeTypeFilter, page],
        queryFn: async () => {
            if (!shopId) {
                throw new Error("가게 ID가 없습니다.");
            }
            return getSellerOrderList(shopId, { page: page, size: size, status: orderStatus, type: cakeTypeFilter });
        },
        enabled: !!shopId,
        keepPreviousData: true,
    });

    const orders = data?.orders || [];
    const pageInfo = data?.pageInfo;

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    if (isLoading && !isFetching) {
        return <ListLoading />;
    }

    if (error) {
        return <ListErrorDisplay message={error.message} />;
    }

    if ((!orders || orders.length === 0) && !isLoading && !isFetching) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                {/* ⭐ (가상) <Header /> 컴포넌트가 있었다면 여기에서 제거했을 것임 ⭐ */}
                <h2 className="text-xl font-bold mb-4">판매자 주문 목록 (가게 ID: {shopId})</h2>
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setOrderStatus("RESERVATION_CONFIRMED")}
                        className={`px-3 py-1 rounded-md ${orderStatus === "RESERVATION_CONFIRMED" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        확정된 주문
                    </button>
                    <button
                        onClick={() => setOrderStatus("ALL")}
                        className={`px-3 py-1 rounded-md ${orderStatus === "ALL" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        모든 주문
                    </button>
                    <button
                        onClick={() => setCakeTypeFilter("ALL")}
                        className={`px-3 py-1 rounded-md ${cakeTypeFilter === "ALL" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        전체 케이크 타입
                    </button>
                    <button
                        onClick={() => setCakeTypeFilter("LETTERING")}
                        className={`px-3 py-1 rounded-md ${cakeTypeFilter === "LETTERING" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        레터링 케이크
                    </button>
                    <button
                        onClick={() => setCakeTypeFilter("NORMAL")}
                        className={`px-3 py-1 rounded-md ${cakeTypeFilter === "NORMAL" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        일반 케이크
                    </button>
                </div>
                <div className="text-center p-8 text-gray-500">
                    해당 조건의 주문이 없습니다.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* ⭐ (가상) <Header /> 컴포넌트가 있었다면 여기에서 제거했을 것임 ⭐ */}
            <h2 className="text-xl font-bold mb-4">판매자 주문 목록 (가게 ID: {shopId})</h2>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => {
                        setOrderStatus("RESERVATION_CONFIRMED");
                        setPage(0);
                    }}
                    className={`px-3 py-1 rounded-md ${orderStatus === "RESERVATION_CONFIRMED" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    확정된 주문
                </button>
                <button
                    onClick={() => {
                        setOrderStatus("ALL");
                        setPage(0);
                    }}
                    className={`px-3 py-1 rounded-md ${orderStatus === "ALL" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    모든 주문
                </button>
                <button
                    onClick={() => {
                        setCakeTypeFilter("ALL");
                        setPage(0);
                    }}
                    className={`px-3 py-1 rounded-md ${cakeTypeFilter === "ALL" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    전체 케이크 타입
                </button>
                <button
                    onClick={() => {
                        setCakeTypeFilter("LETTERING");
                        setPage(0);
                    }}
                    className={`px-3 py-1 rounded-md ${cakeTypeFilter === "LETTERING" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    레터링 케이크
                </button>
                <button
                    onClick={() => {
                        setCakeTypeFilter("NORMAL");
                        setPage(0);
                    }}
                    className={`px-3 py-1 rounded-md ${cakeTypeFilter === "NORMAL" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    일반 케이크
                </button>
            </div>

            {isFetching && (
                <div className="text-center text-sm text-blue-500 mb-2">
                    데이터 업데이트 중...
                </div>
            )}

            <SellerOrderList orders={orders} />

            {pageInfo && pageInfo.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0 || isFetching}
                        className="px-3 py-1 border rounded-md"
                    >
                        이전
                    </button>
                    {[...Array(pageInfo.totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            disabled={isFetching}
                            className={`px-3 py-1 border rounded-md ${page === i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= pageInfo.totalPages - 1 || isFetching}
                        className="px-3 py-1 border rounded-md"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}