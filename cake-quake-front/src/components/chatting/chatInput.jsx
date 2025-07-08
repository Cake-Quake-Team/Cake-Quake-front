import {PaperAirplaneIcon} from "@heroicons/react/16/solid/index.js";

const ChatInput = ({ message, setMessage, onSendMessage, onKeyPress, isConnected }) => (
    <div className="flex border rounded-lg overflow-hidden shadow-md">
        <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder={isConnected ? "메시지를 입력하세요" : "연결 중..."}
            // ⭐ 파란색 계열 입력 필드 스타일
            className="flex-1 p-3 outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!isConnected}
        />
        <button
            onClick={onSendMessage}
            // ⭐ 파란색 계열 보내기 버튼 스타일
            className={`px-4 py-2 text-white ${
                isConnected ? "bg-blue-700 hover:bg-blue-800" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isConnected}
        >
            <PaperAirplaneIcon className="h-5 w-5 rotate-90" />
        </button>
    </div>
);



export default ChatInput;