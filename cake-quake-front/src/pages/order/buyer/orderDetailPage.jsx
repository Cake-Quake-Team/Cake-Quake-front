import React from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // ⭐ useQuery, useMutation, useQueryClient 임포트 ⭐
import { getOrderDetail, cancelMyOrder } from '../../../api/buyerOrderApi';
import OrderDetailComponent from '../../../components/order/buyer/OrderDetail';
import {getOrderPayments} from "../../../api/paymentApi.jsx";

// 로딩 및 에러 컴포넌트 분리 (재사용성 목적)
const PageLoading = () => (
    <div className="text-center p-8 text-blue-600 font-semibold">
        주문 상세 정보를 불러오는 중...
    </div>
);

const PageErrorDisplay = ({ message }) => (
    <div className="text-center p-8 text-red-500 font-semibold">
        오류 발생: {message}
    </div>
);

export default function OrderDetailPageWrapper() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient(); // queryClient 훅 초기화

    // useQuery 훅을 사용하여 데이터 로딩 관리
    const {
        data: order,
        isLoading,
        isFetching,
        error,
        isError
    } = useQuery({
        queryKey: ['orderDetail', orderId], // 고유한 쿼리 키
        queryFn: () => {
            if (!orderId) {
                // orderId가 없을 경우 쿼리를 실행하지 않음 (enabled: false 로 처리 가능)
                throw new Error("유효한 주문 ID가 없습니다.");
            }
            return getOrderDetail(orderId);
        },
        enabled: !!orderId, // orderId가 유효할 때만 쿼리 실행
        staleTime: 5 * 60 * 1000, // 5분 동안은 stale 상태가 아님 (캐시 유효 시간)
        cacheTime: 10 * 60 * 1000, // 10분 후 캐시에서 제거
        retry: 1, // 실패 시 1회 재시도
        onError: (err) => {
            console.error("❌ useQuery: 주문 상세 정보 불러오기 실패:", err);
        }
    });

    // ① 주문별 결제 내역 조회
    const { data: payments = [] } = useQuery({
        queryKey: ['orderPayments', orderId],
        queryFn: () => getOrderPayments(orderId),
        enabled: !!orderId,
    });

    // ② 승인된 결제 찾기
    const approvedPayment = payments.find(p => p.status === 'APPROVED');

    // useMutation 훅을 사용하여 주문 취소 로직 관리
    const cancelOrderMutation = useMutation({
        mutationFn: cancelMyOrder,
        onSuccess: () => {
            // ⭐⭐⭐ 주문 취소 성공 시 포인트 반환 메시지 추가 ⭐⭐⭐
            // orderDetail?.discountAmount를 사용하여 주문 상세 정보에서 할인된 포인트 금액을 가져옵니다.
            const refundedPoints = order?.discountAmount || 0;

            let successMessage = "주문이 성공적으로 취소되었습니다.";
            if (refundedPoints > 0) {
                successMessage += `\n사용하신 포인트 ${refundedPoints.toLocaleString()}P가 반환되었습니다.`;
            }
            alert(successMessage);
            // ⭐⭐⭐ 포인트 반환 메시지 추가 끝 ⭐⭐⭐

            queryClient.invalidateQueries(['orderDetail', orderId]);
            queryClient.invalidateQueries(['myOrders']); // 주문 목록 쿼리도 무효화 (만약 사용한다면)
            navigate('/buyer/orders'); // 주문 목록 페이지로 이동
        },
        onError: (err) => {
            console.error('❌ 주문 취소 실패 (mutation):', err);
            alert(`주문 취소 중 오류가 발생했습니다: ${err.response?.data?.message || err.message || '알 수 없는 오류'}`);
        }
    });

    // OrderDetailComponent에 전달할 취소 핸들러
    const handleCancelOrder = (idToCancel) => {
        // 이미 OrderDetailComponent에서 confirm 메시지를 띄웠다고 가정
        cancelOrderMutation.mutate(idToCancel);
    };

    //이 부분을 수정
    const handleBack = () => {
        navigate('/buyer/orders'); // 명확하게 주문 리스트 페이지로 이동
    };

    // ⭐ 로딩 상태 UI ⭐
    if (isLoading && !isFetching) { // 초기 로딩 또는 데이터가 없는 상태
        return <PageLoading />;
    }

    // ⭐ 에러 상태 UI ⭐
    if (isError) {
        return <PageErrorDisplay message={error.message} />;
    }

    // ⭐ 주문 데이터가 없을 경우 (API에서 null을 반환하거나, orderId가 없는 경우 등) ⭐
    // useQuery의 enabled: !!orderId 로 인해 orderId가 없으면 쿼리 자체가 실행 안되므로,
    // order가 null인 경우는 주로 백엔드에서 해당 orderId에 해당하는 주문을 찾지 못했을 때임.
    if (!order) {
        return <div className="p-4 text-center text-gray-500">주문 정보를 찾을 수 없습니다.</div>;
    }

    // ③ 결제하기 or 결제내역 보기 핸들러
    const handlePayOrView = () => {
        if (approvedPayment) {
            navigate(`/buyer/payments/${approvedPayment.paymentId}`);
        } else {
            navigate(`/buyer/payments/start?orderId=${order.orderId}&amount=${order.finalPaymentAmount}`);
        }
    };


    // 모든 준비가 되면 OrderDetailComponent에 데이터 및 핸들러 전달
    return (
        <OrderDetailComponent
            order={order}
            onCancel={handleCancelOrder}
            onBack={handleBack}
            onPay={handlePayOrView}                // 변경된 onPay
            hasApprovedPayment={!!approvedPayment} // 승인 여부 prop 추가
            isPaying={false}
            isCancelling={cancelOrderMutation.isPending} // 취소 요청 중인지 상태 전달
        />
    );
}