// src/pages/payment/KakaoApprovePage.jsx
import React from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { approveKakaoPayment } from "../../api/paymentApi";

export default function KakaoApprovePage() {
    const [qs] = useSearchParams();
    const orderId = qs.get("partner_order_id");
    const userId  = qs.get("partner_user_id");
    const pgToken = qs.get("pg_token");
    const navigate = useNavigate();

    // ❗ 훅은 최상단에서만 호출
    const mutation = useMutation({
        mutationFn: () => approveKakaoPayment({ orderId, userId, pgToken }),
        onSuccess: dto => {
            navigate(`/buyer/payments/${dto.paymentId}`);
        },
        onError: () => {
            alert("결제 승인 중 오류가 발생했습니다.");
            navigate("/buyer/orders");
        }
    });

    React.useEffect(() => {
        // 필수 파라미터 체크 후에만 mutate
        if (orderId && userId && pgToken) {
            mutation.mutate();
        } else {
            // 파라미터가 없으면 바로 뒤로
            navigate("/buyer/orders", { replace: true });
        }
    }, [orderId, userId, pgToken, mutation, navigate]);

    return (
        <div className="p-6 text-center">
            {mutation.isLoading && "결제 승인 처리 중…"}
            {mutation.isError   && "결제 승인에 실패했습니다."}
            {/* onSuccess 시점엔 navigate 하므로 이 텍스트는 안 보입니다 */}
        </div>
    );
}