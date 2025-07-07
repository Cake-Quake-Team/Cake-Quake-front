
import {useEffect, useRef, useState} from "react";
import useWebSocket from "../hooks/useWebSocket.jsx";
import {useAuth} from "../store/AuthContext.jsx";
import {useParams} from "react-router";


const ChatPage = () => { // 더 이상 roomKey prop을 받지 않습니다.
    const { roomId } = useParams(); // URL 파라미터에서 roomId를 가져옵니다.
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const { user } = useAuth();
    const bottomRef = useRef(null);

    // useParams에서 가져온 roomId를 직접 사용합니다.
    const { sendMessage, isConnected } = useWebSocket(roomId, (msg) => {
        console.log("[ChatPage] 💬 받은 메시지:", msg);
        setMessages(prev => [...prev, msg]);
    });

    useEffect(() => {
        console.log("[ChatPage] 🚀 roomKey:", roomId); // roomId를 사용합니다.
        console.log("[ChatPage] 👤 로그인 사용자:", user);
    }, [roomId, user]); // 의존성 배열에 roomId를 추가합니다.

    const handleSend = () => {
        console.log("[ChatPage] 📝 handleSend 호출됨 - 입력값:", input);

        if (!input.trim()) {
            console.warn("[ChatPage] 입력이 비어있음. 메시지 전송 안함");
            return;
        }

        if (!isConnected) {
            console.warn("[ChatPage] ⚠ WebSocket 아직 연결 안됨. 전송 취소");
            return;
        }

        const messagePayload = {
            roomId: roomId, // roomId를 사용합니다.
            senderUid: user?.uid,
            message: input
        };

        console.log("[ChatPage] 🚀 보낼 메시지:", messagePayload);
        sendMessage(messagePayload);
        setInput("");
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Chat Room: {roomId}</h2> {/* roomId를 표시합니다. */}

            <div className="border rounded-lg p-3 h-80 overflow-y-auto bg-gray-50 mb-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className="mb-2">
                        <span className="font-semibold">{msg.senderUid}:</span> {msg.message}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="flex gap-2">
                <input
                    className="border rounded-lg flex-1 p-2"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요"
                />
                <button
                    onClick={handleSend}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    보내기
                </button>
            </div>
        </div>
    );
};
export default ChatPage;