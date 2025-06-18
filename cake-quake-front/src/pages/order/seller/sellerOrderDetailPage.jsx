import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSellerOrderDetail, updateOrderStatus } from "../../api/sellerOrderApi";
import SellerOrderDetail from "../../components/order/seller/SellerOrderDetail";

const SellerOrderDetailPage = () => {
    const { orderId } = useParams();
    const queryClient = useQueryClient();

    const { data: order, isLoading } = useQuery({
        queryKey: ["sellerOrderDetail", orderId],
        queryFn: () => getSellerOrderDetail(orderId),
    });

    const mutation = useMutation({
        mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries(["sellerOrderDetail", orderId]);
        }
    });

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        mutation.mutate({ orderId, status: newStatus });
    };

    if (isLoading) return <p>불러오는 중...</p>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <SellerOrderDetail
                order={order}
                onStatusChange={handleStatusChange}
                isUpdating={mutation.isPending}
            />
        </div>
    );
};

export default SellerOrderDetailPage;
