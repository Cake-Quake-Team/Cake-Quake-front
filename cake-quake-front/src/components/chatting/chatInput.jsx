import {PaperAirplaneIcon} from "@heroicons/react/16/solid/index.js";

const ChatInput = ({ message, setMessage, onSendMessage, onKeyPress }) => (
    <div className="flex border rounded-lg overflow-hidden shadow-md">
        <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder="메시지를 입력하세요"
            className="flex-1 p-2 outline-none"
        />
        <button
            onClick={onSendMessage}
            className="bg-orange-700 text-white px-4 py-2 hover:bg-orange-800"
        >
            전송
        </button>
    </div>
);


export default ChatInput;