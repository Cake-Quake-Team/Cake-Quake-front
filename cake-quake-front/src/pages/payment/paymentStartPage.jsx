import { useState } from "react";
import { Navigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { createPayment } from "../../api/paymentApi.jsx";

export default function PaymentStartPage() {
    const [searchParams] = useSearchParams();
    const orderId = parseInt(searchParams.get("orderId"), 10);
    const amount  = parseInt(searchParams.get("amount"),  10);

    if (!orderId || !amount) {
        return <Navigate to="/" replace />;
    }

    const [provider, setProvider] = useState("KAKAO");
    const [redirectUrl, setRedirectUrl] = useState("");

    const mutation = useMutation({
        mutationFn: () => createPayment({ orderId, provider, amount }),
        onSuccess: (data) => {
            // 자동 리다이렉트 하고 싶으면 아래 한 줄만 쓰면 되고
             window.location.href = data.redirectUrl;

            // 링크를 화면에 보여주고 싶으면 state에 저장
            //setRedirectUrl(data.redirectUrl);
        },
        onError: (err) => {
            console.error(err);
            alert("결제 시작 실패");
        }
    });

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">결제하기</h1>
            <p>주문번호: {orderId}</p>
            <p>결제금액: {amount.toLocaleString()}원</p>

            {!redirectUrl && (
                <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="mt-4">
                    <div className="mb-4">
                        <label className="mr-4">
                            <input
                                type="radio"
                                value="KAKAO"
                                checked={provider==="KAKAO"}
                                onChange={() => setProvider("KAKAO")}
                            /> 카카오페이
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="TOSS"
                                checked={provider==="TOSS"}
                                onChange={() => setProvider("TOSS")}
                            /> 토스페이
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={mutation.isLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                        {mutation.isLoading ? "처리 중..." : "결제 시작"}
                    </button>
                </form>
            )}

            {redirectUrl && (
                <div className="mt-6 p-4 border rounded bg-gray-50">
                    <p className="mb-2">결제 페이지로 이동하려면 아래 버튼을 클릭하세요.</p>
                    <a
                        href={redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        결제 페이지 열기
                    </a>
                </div>
            )}
        </div>
    );
}
