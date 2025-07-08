const CompleteOrderModal = ({ onClose, onGoToOrders }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
                <h2 className="text-xl font-bold text-green-600 mb-2">🎉 주문 완료</h2>
                <p className="text-gray-700 mb-4">
                    주문이 성공적으로 완료되었습니다!
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        닫기
                    </button>
                    <button
                        onClick={onGoToOrders}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        주문 내역 보기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompleteOrderModal;
