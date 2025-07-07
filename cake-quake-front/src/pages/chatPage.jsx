
import {useCallback, useEffect, useRef, useState} from "react";
import useWebSocket from "../hooks/useWebSocket.jsx";
import {useAuth} from "../store/AuthContext.jsx";
import {useParams} from "react-router";
import ChatMessageList from "../components/chatting/chatMessageList.jsx";
import ChatInput from "../components/chatting/chatInput.jsx";
import jwtAxios from "../utils/jwtUtil.js";


const ChatPage = () => {
    const { roomId } = useParams();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isInitialLoading, setIsInitialLoading] = useState(true); // 초기 메시지 로딩 상태
    const bottomRef = useRef(null);

    // WebSocket 훅에서 메시지를 받을 때 호출될 콜백 함수
    const handleMessageReceived = useCallback((msg) => {
        console.log("[ChatPage] 💬 받은 메시지:", msg);
        setMessages(prev => {
            // 실시간 메시지가 중복되지 않도록 방지 (예: 메시지에 고유 ID가 있다면 활용)
            // 여기서는 간단히 timestamp와 senderUid, message 내용으로 중복 확인
            if (prev.some(m => m.timestamp === msg.timestamp && m.senderUid === msg.senderUid && m.message === msg.message)) {
                return prev;
            }
            return [...prev, msg];
        });
    }, []);

    const { sendMessage, isConnected } = useWebSocket(roomId, handleMessageReceived);

    // 메시지 전송 핸들러
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
            roomId: roomId,
            senderUid: user.uid,
            message: input
        };

        sendMessage(messagePayload);
        setInput("");
    }, [input, isConnected, user, roomId, sendMessage]);

    // 컴포넌트 마운트 시 과거 메시지 로드
    useEffect(() => {
        const fetchPastMessages = async () => {
            if (!roomId) {
                console.warn("[ChatPage] ⚠️ roomId 없음 → 과거 메시지 로드 안함");
                setIsInitialLoading(false);
                return;
            }
            if (isAuthLoading || !user || !user.uid) {
                // 인증 정보 로딩 중이거나 없으면 기다림
                console.log("[ChatPage] ⏳ 인증 정보 로딩 중이거나 없음 → 과거 메시지 로드 대기");
                return;
            }

            try {
                console.log(`[ChatPage] ⏳ 과거 메시지 로드 시작: /api/v1/chatting/rooms/${roomId}/messages`);
                const response = await jwtAxios.get(`/api/v1/chatting/rooms/${roomId}/messages`);
                console.log("[ChatPage] ✅ 과거 메시지 로드 성공:", response.data);
                setMessages(response.data); // 불러온 과거 메시지로 상태 초기화
            } catch (error) {
                console.error("[ChatPage] ❗ 과거 메시지 로드 실패:", error);
                // 오류 처리: 사용자에게 메시지 표시 등
            } finally {
                setIsInitialLoading(false); // 로딩 완료
            }
        };

        // roomId, user, isAuthLoading이 변경될 때마다 과거 메시지 로드 시도
        fetchPastMessages();

    }, [roomId, user, isAuthLoading]); // 의존성 배열에 user와 isAuthLoading 추가

    // 메시지가 추가될 때마다 스크롤을 최하단으로 이동
    useEffect(() => {
        // 초기 로딩이 완료된 후에만 스크롤 (과거 메시지 로드 후 한 번만 스크롤)
        // 이후에는 실시간 메시지 수신 시에만 스크롤
        if (!isInitialLoading) {
            const timer = setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [messages, isInitialLoading]); // isInitialLoading을 의존성에 추가

    // 사용자 정보 로딩 중 또는 유효하지 않을 때 처리
    if (isAuthLoading || isInitialLoading) {
        return <div className="p-4 max-w-md mx-auto text-center">채팅 기록을 불러오는 중...</div>;
    }

    if (!user || !user.uid) {
        return <div className="p-4 max-w-md mx-auto text-center">로그인이 필요합니다.</div>;
    }

    return (
        <div className="p-4 max-w-md mx-auto flex flex-col h-[calc(100vh-80px)]">
            <h2 className="text-xl font-bold mb-4 text-center">채팅방: {roomId}</h2>

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


export default ChatPage;