
import {useCallback, useEffect, useRef, useState} from "react";
import useWebSocket from "../hooks/useWebSocket.jsx";
import {useAuth} from "../store/AuthContext.jsx";
import {useParams} from "react-router";
import ChatMessageList from "../components/chatting/chatMessageList.jsx";


const ChatPage = () => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    const handleMessageReceived = useCallback((msg) => {
        console.log("[ChatPage] 💬 받은 메시지:", msg);
        setMessages(prev => [...prev, msg]);
    }, []);

    const { sendMessage, isConnected } = useWebSocket(roomId, user, handleMessageReceived);

    const handleSend = () => {
        if (!input.trim()) {
            console.warn("[ChatPage] 입력값 없음 → 전송 취소");
            return;
        }

        if (!isConnected) {
            console.warn("[ChatPage] ⚠ WebSocket 미연결 → 전송 불가");
            return;
        }

        // 백엔드 ChatMessageDto의 @NotNull, @NotBlank 필드에 맞춰 데이터 전송
        const messagePayload = {
            roomId: roomId,
            senderUid: user?.uid, // useAuth()에서 가져온 user의 uid 사용
            message: input
        };

        sendMessage(messagePayload);
        setInput("");
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // user.uid가 없으면 메시지 전송 로직에서 문제 발생 가능
    if (!user || !user.uid) { // user.userId 대신 user.uid로 확인 (senderUid가 uid이기 때문)
        return <div className="p-4 max-w-md mx-auto text-center">사용자 정보를 불러오는 중... (로그인 필요)</div>;
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Chat Room: {roomId}</h2>

            <div className="border rounded-lg p-3 h-80 overflow-y-auto bg-gray-50 mb-4 flex flex-col">
                {/* ⭐ ChatMessageList 컴포넌트 사용 */}
                <ChatMessageList messages={messages} myUserId={user.uid} />
                <div ref={bottomRef} />
            </div>

            <div className="flex gap-2">
                <input
                    className="border rounded-lg flex-1 p-2"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요"
                    disabled={!isConnected}
                    onKeyPress={(e) => { // 엔터 키로 메시지 보내기 기능 추가
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <button
                    onClick={handleSend}
                    className={`px-4 py-2 rounded-lg text-white ${isConnected ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
                    disabled={!isConnected}
                >
                    보내기
                </button>
            </div>
        </div>
    );
};

export default ChatPage;