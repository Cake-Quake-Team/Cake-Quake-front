import {useNavigate, useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import {useInfiniteQuery, useQuery, useQueryClient} from "@tanstack/react-query";
import { motion } from "framer-motion";
import {useAuth} from "../store/AuthContext.jsx";
import jwtAxios from "../utils/jwtUtil.js";
import ChatInput from "../components/chatting/chatInput.jsx";
import ChatMessageList from "../components/chatting/chatMessageList.jsx";
import ChatHeader from "../components/chatting/chatHeader.jsx";
import useWebSocket from "../hooks/useWebSocket.jsx";
import SockJS from "sockjs-client";

const ChatPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const scrollRef = useRef();
    const queryClient = useQueryClient();
    const { user, accessToken } = useAuth();

    const [message, setMessage] = useState("");
    const [messageCount, setMessageCount] = useState(0);

    //useWebSocket 훅 사용
    const { isConnected, lastMessage, sendMessage, client } = useWebSocket(roomId, accessToken);

    //메시지 목록 불러옴
    const getRoomMessages = async (pageParam = null) => {
        // /api/v1/message/{roomId}로 GET 요청
        const res = await jwtAxios.get(`/api/v1/message/${roomId}`, {
            params: { page: pageParam }, // 페이지네이션을 구현한다면 pageParam 사용
        });
        return res.data;  // MessageResponseDto 리스트가 바로 반환된다고 가정
    };

    const {
        data: messagesQueryData, // 'data' 충돌 방지를 위해 이름 변경
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["chatMessages", roomId], // 쿼리 키에 roomId 포함
        queryFn: ({ pageParam }) => getRoomMessages(pageParam),
        initialPageParam: null,
        getNextPageParam: (lastPage, allPages) => {
            // TODO: 백엔드 메시지 API에 페이지네이션 구현 시 다음 페이지 번호를 반환하도록 로직 추가
            // 현재는 간단히 null 반환하여 더 이상 페이지가 없음을 나타냅니다.
            return undefined;
        },
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5분
        // 메시지 로드 후 스크롤을 맨 아래로 이동
        onSuccess: () => {
            if (scrollRef.current) {
                // setTimeout을 사용하여 DOM 업데이트 후 스크롤되도록 보장
                setTimeout(() => {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }, 100);
            }
        },
    });


    // 새 메시지 수신 시 처리
    useEffect(() => {
        if (lastMessage) {
            queryClient.setQueryData(['chatMessages', roomId], (oldData) => {
                const newDataPages = oldData ? [...oldData.pages] : [[]];
                // 마지막 페이지에 새 메시지 추가
                newDataPages[newDataPages.length - 1] = [...newDataPages[newDataPages.length - 1], lastMessage];
                return {
                    ...oldData,
                    pages: newDataPages,
                };
            });
            setMessageCount((prev) => prev + 1); // 스크롤 트리거용
        }
    }, [lastMessage, roomId, queryClient]);

    // 메시지 목록 업데이트 시 또는 컴포넌트 마운트 시 스크롤 맨 아래로
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messageCount, messagesQueryData]); // messagesQueryData 전체 변경 시에도 스크롤

    // 메시지 전송 함수
    const handleSendMessage = () => {
        if (!message.trim()) return;
        // ✨ 수정: STOMP Destination을 백엔드 @MessageMapping("/chat/{roomId}")에 맞춰 `/app/chat/${roomId}`로 변경
        sendMessage(`/app/chat/${roomId}`, {
            senderUid: user.uid,   // MessageRequestDto의 senderUid 필드에 맞춤
            nickname: user.uname,  // MessageRequestDto의 nickname 필드에 맞춤
            message,
        });
        setMessage("");
    };

    // 엔터 키 입력 시 메시지 전송
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { // Shift+Enter는 줄바꿈
            e.preventDefault();
            handleSendMessage();
        }
    };


    // 채팅방 나가기 및 웹소켓 연결 해제
    const disconnectAndNavigate = () => {
        if (client && client.connected) {
            client.disconnect(() => console.log("STOMP disconnected"));
        }
        navigate("/myrooms"); // 채팅방 목록 페이지로 이동 또는 홈으로 이동
    };

    // 모든 메시지 페이지를 하나의 배열로 병합
    const allMessages = messagesQueryData?.pages?.flatMap(page => page) || [];


    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-xl h-screen mx-auto flex flex-col bg-orange-50 border-x-2 border-orange-700">
            <ChatHeader onBackClick={disconnectAndNavigate} />
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {isFetching && !isFetchingNextPage && allMessages.length === 0 && (
                    <div className="text-center text-gray-500">메시지를 불러오는 중...</div>
                )}
                {/* 무한 스크롤을 위한 "더 불러오기" 버튼 (옵션) */}
                {hasNextPage && (
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="w-full py-2 text-sm text-blue-600 hover:underline disabled:opacity-50"
                    >
                        {isFetchingNextPage ? '불러오는 중...' : '이전 메시지 불러오기'}
                    </button>
                )}
                {/* messages prop에 allMessages를 전달 */}
                <ChatMessageList messages={allMessages} myUserId={user.uid} /> {/* user.uid로 변경 */}
            </div>
            <div className="p-4 border-t-2 border-orange-700">
                <ChatInput message={message} setMessage={setMessage} onSendMessage={handleSendMessage} onKeyPress={handleKeyPress} />
            </div>
        </motion.div>
    );

};

export default ChatPage;