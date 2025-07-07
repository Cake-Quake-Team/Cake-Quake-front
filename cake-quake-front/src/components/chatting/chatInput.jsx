import {PaperAirplaneIcon} from "@heroicons/react/16/solid/index.js";

const ChatInput = ({ message, setMessage, onSendMessage, onKeyPress, isConnected }) => (
    <div className="flex border rounded-lg overflow-hidden shadow-md">
        <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyPress} // onKeyPress는 여전히 받아서 ChatPage에서 제어하도록 함
            placeholder={isConnected ? "메시지를 입력하세요" : "연결 중..."}
            className="flex-1 p-2 outline-none"
            disabled={!isConnected} // 연결 상태에 따라 비활성화
        />
        <button
            onClick={onSendMessage}
            className={`px-4 py-2 text-white ${
                isConnected ? "bg-orange-700 hover:bg-orange-800" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isConnected} // 연결 상태에 따라 비활성화
        >
            <PaperAirplaneIcon className="h-5 w-5 rotate-90" /> {/* 아이콘 회전 추가 */}
        </button>
    </div>
);


export default ChatInput;