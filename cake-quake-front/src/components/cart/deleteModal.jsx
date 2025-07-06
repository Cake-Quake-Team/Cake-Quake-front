export default function DeleteModal({ message, onConfirm, onCancel }) {
    return (
        <div
            // fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
            // ⭐⭐⭐ 위 라인을 아래와 같이 수정합니다 ⭐⭐⭐
            // 배경 투명하게 (혹은 아예 없애고 싶으면 이 div 자체를 없애고 모달만 직접 렌더링)
            className="fixed inset-0 flex items-center justify-center z-50" // 배경 색상 및 투명도 관련 클래스 제거
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