import { Send } from 'lucide-react';

function AiForm({ question, onQuestionChange, selectedType, onTypeChange, onSubmit }) {
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    return (
        <form
            onSubmit={onSubmit}
            className="mt-8 w-full max-w-2xl mx-auto flex flex-col items-center px-4 space-y-3"
        >
            {/* 선택 영역 */}
            <div className="flex gap-2 text-xs text-gray-600">
                {[
                    { label: "문구", value: "lettering", color: "pink" },
                    { label: "옵션", value: "options", color: "pink" },
                    { label: "디자인", value: "image", color: "pink" },
                    { label: "일반", value: "", color: "pink" },
                ].map(({ label, value, color }) => (
                    <button
                        type="button"
                        key={value}
                        onClick={() => onTypeChange(value)}
                        className={`px-2 py-1 rounded-full border text-xs font-medium ${
                            selectedType === value
                                ? `bg-${color}-100 border-${color}-400 text-${color}-600`
                                : 'bg-gray-100 border-gray-300'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* 입력창 + 버튼 */}
            <div className="w-full flex items-center bg-white border border-gray-300 rounded-full px-5 py-3 shadow-sm">
                <textarea
                    rows="2"
                    value={question}
                    onChange={(e) => onQuestionChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요..."
                    className="flex-grow resize-none text-base focus:outline-none bg-transparent placeholder-gray-400"
                />
                <button
                    type="submit"
                    className="ml-2 p-2 rounded-full bg-black hover:bg-gray-500 transition text-white"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </form>
    );
}

export default AiForm;
