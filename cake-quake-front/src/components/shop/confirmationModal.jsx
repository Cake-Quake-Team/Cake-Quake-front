const ConfirmationModal=({isOpen,message,onConfirm,onCancel})=>{
    if(!isOpen) return null; //모달이 열려있지 않은 경우 렌더링 X

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4">
                <p className="text-lg font-semibold mb-6 text-center">{message}</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors text-md"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-md"
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;