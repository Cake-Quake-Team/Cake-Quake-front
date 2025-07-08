
import {useCallback, useEffect, useRef, useState} from "react";
import useWebSocket from "../../hooks/useWebSocket.jsx";
import {useAuth} from "../../store/AuthContext.jsx";
import {useParams} from "react-router";
import ChatMessageList from "../../components/chatting/chatMessageList.jsx";
import ChatInput from "../../components/chatting/chatInput.jsx";
import {getChatMessages} from "../../api/chatAPi.jsx";


const ShopChatPage = ({ initialRoomId }) => {

    const { roomId: paramRoomId } = useParams();
    const currentRoomId = initialRoomId || paramRoomId;

    const { user, isLoading: isAuthLoading } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const bottomRef = useRef(null);


    const handleMessageReceived = useCallback((msg) => {
        setMessages(prev => {

            if (msg.messageId && prev.some(m => m.messageId === msg.messageId)) {
                return prev;
            }
            return [...prev, msg];
        });
    }, []);

    const { sendMessage, isConnected } = useWebSocket(currentRoomId, handleMessageReceived);

    const handleSend = useCallback(() => {
        if (!input.trim()) {
            console.warn("[ChatPage] 입력값 없음 → 전송 취소");
            return;
        }

        if (!isConnected) {
            console.warn("[ChatPage] ⚠ WebSocket 미연결 → 전송 불가");
            return;
        }

        if (!user || !user.uid) {
            console.warn("[ChatPage] 🚫 사용자 UID 없음 → 전송 불가");
            return;
        }

        const messagePayload = {
            roomId: currentRoomId, // ⭐ currentRoomId 사용
            senderUid: user.uid,
            message: input
        };

        sendMessage(messagePayload);
        setInput("");
    }, [input, isConnected, user, currentRoomId, sendMessage]);


    useEffect(() => {
        const fetchPastMessages = async () => {
            if (!currentRoomId) { // ⭐ currentRoomId 사용
                console.warn("[ChatPage] ⚠️ roomId 없음 → 과거 메시지 로드 안함");
                setIsInitialLoading(false);
                return;
            }
            if (isAuthLoading || !user || !user.uid) {
                console.log("[ChatPage] ⏳ 인증 정보 로딩 중이거나 없음 → 과거 메시지 로드 대기");
                return;
            }

            try {
                const data = await getChatMessages(currentRoomId);
                setMessages(data);
            } catch (error) {
                console.error("[ChatPage] ❗ 과거 메시지 로드 실패:", error);
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchPastMessages();

    }, [currentRoomId, user, isAuthLoading]); // ⭐ 의존성 배열에 currentRoomId 추가

    // 메시지가 추가될 때마다 스크롤을 최하단으로 이동
    useEffect(() => {
        if (!isInitialLoading) {
            const timer = setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [messages, isInitialLoading]);

    // 사용자 정보 로딩 중 또는 유효하지 않을 때 처리
    if (isAuthLoading || isInitialLoading) {
        return <div className="p-4 max-w-md mx-auto text-center">채팅 기록을 불러오는 중...</div>;
    }

    if (!user || !user.uid) {
        return <div className="p-4 max-w-md mx-auto text-center">로그인이 필요합니다.</div>;
    }

    return (
        <div className="p-4 max-w-md mx-auto flex flex-col h-[calc(100vh-80px)]">
            <div className="border rounded-lg p-3 flex-1 overflow-y-auto bg-gray-50 mb-4 flex flex-col">
                <ChatMessageList messages={messages} myUserId={user.uid} />
                <div ref={bottomRef} />
            </div>

            <ChatInput
                message={input}
                setMessage={setInput}
                onSendMessage={handleSend}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                isConnected={isConnected}
            />
        </div>
    );
};


export default ShopChatPage;