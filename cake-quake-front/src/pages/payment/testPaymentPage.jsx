import React from 'react';
import { requestKakaoPayment } from '../../api/paymentAPI';

const TestPaymentPage = () => {
    const handleKakaoPay = async () => {
        try {
            const response = await requestKakaoPayment(100,1, 60000); // 테스트용 주문 ID & 금액
            console.log("redirectUrl =", response.redirectUrl);
            window.location.href = response.redirectUrl;
        } catch (err) {
            console.error('결제 요청 실패', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">🧁 카카오페이 결제 테스트</h2>

                <div className="text-left mb-6">
                    <p className="mb-2">✅ 테스트용 주문 번호: <strong className="text-indigo-600">#1</strong></p>
                    <p>💰 금액: <strong className="text-green-600">10,000원</strong></p>
                </div>

                <button
                    onClick={handleKakaoPay}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-full transition duration-200"
                >
                    카카오페이로 결제하기
                </button>
            </div>
        </div>
    );
};

export default TestPaymentPage;
