export default function SelectDeleteModal({ message, onConfirm, onCancel }) {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onCancel}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="mb-4 text-center">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        onClick={onCancel}
                    >
                        취소
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={onConfirm}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
