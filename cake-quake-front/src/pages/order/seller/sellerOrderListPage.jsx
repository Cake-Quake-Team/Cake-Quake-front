import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import SellerOrderList from "../../../components/order/seller/sellerOrderList.jsx";
import { getSellerOrderList } from "../../../api/sellerOrderApi.jsx";

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

    // orderStatus의 초기값을 "ALL"로 설정하고, 다양한 주문 상태를 포함하도록 변경
    // 백엔드의 주문 상태 Enum 값에 맞춰 조정해야 합니다.
    const [orderStatus, setOrderStatus] = useState("ALL");


    const [page, setPage] = useState(0);
    const size = 10;

    const {
        data,
        isLoading,
        error,
        isFetching
    } = useQuery({
        // queryKey에서 cakeTypeFilter 제거
        queryKey: ["sellerOrders", shopId, orderStatus, page],
        queryFn: async () => {
            if (!shopId) {
                throw new Error("가게 ID가 없습니다.");
            }
            // getSellerOrderList 호출 시 type 파라미터 제거
            return getSellerOrderList(shopId, { page: page, size: size, status: orderStatus });
        },
        enabled: !!shopId,
        keepPreviousData: true,
    });

    const orders = data?.orders || [];
    const pageInfo = data?.pageInfo;

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // 주문 상태 필터링 버튼들을 위한 상수
    const orderStatusOptions = [
        { label: "모든 주문", value: "ALL" },
        { label: "예약 확정", value: "RESERVATION_CONFIRMED" },
        { label: "준비 중", value: "PREPARING" },
        { label: "픽업 준비 완료", value: "READY_FOR_PICKUP" },
        { label: "픽업 완료", value: "PICKUP_COMPLETED" },
        { label: "주문 취소", value: "RESERVATION_CANCELLED" },
        { label: "노쇼", value: "NO_SHOW" },
    ];

    if (isLoading && !isFetching) {
        return <ListLoading />;
    }

    if (error) {
        return <ListErrorDisplay message={error.message} />;
    }

    // 데이터가 없으면서 로딩 중이 아닐 때 메시지 표시
    if ((!orders || orders.length === 0) && !isLoading && !isFetching) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <h2 className="text-xl font-bold mb-4">판매자 주문 목록 (가게 ID: {shopId})</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                    {orderStatusOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                setOrderStatus(option.value);
                                setPage(0); // 필터 변경 시 페이지 초기화
                            }}
                            className={`px-3 py-1 rounded-md ${orderStatus === option.value ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <div className="text-center p-8 text-gray-500">
                    해당 조건의 주문이 없습니다.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">판매자 주문 목록 (가게 ID: {shopId})</h2>

            <div className="flex flex-wrap gap-2 mb-4">
                {orderStatusOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => {
                            setOrderStatus(option.value);
                            setPage(0); // 필터 변경 시 페이지 초기화
                        }}
                        className={`px-3 py-1 rounded-md ${orderStatus === option.value ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        {option.label}
                    </button>
                ))}
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