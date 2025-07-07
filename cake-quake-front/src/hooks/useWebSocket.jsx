
import SockJS from "sockjs-client";
import {Client, over} from "webstomp-client";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "../store/AuthContext.jsx"; //사용자 인증 정보 가져오기


const useWebSocket = (roomId, onMessageReceived) => {
    const stompClientRef = useRef(null); //STOMP 클라이언트 객체 참조할 ref
    const [isConnected, setIsConnected] = useState(false); //Web Socket 연결 상태
    const { user, isLoading } = useAuth(); //로그인 사용자 정보와 로딩 상태

    useEffect(() => {
        console.log("==============================================");
        console.log("[useWebSocket] 📝 useEffect 호출됨");
        console.log("[useWebSocket] 👉 roomId:", roomId);
        console.log("[useWebSocket] 👉 isLoading:", isLoading);
        console.log("[useWebSocket] 👉 user:", user);
        console.log("==============================================");

        // 인증 정보 로딩 중인 경우 연결하지 않음
        if (isLoading) {
            console.warn("[useWebSocket] ⏳ isLoading=true → 연결 안함");
            return;
        }

        // roodId 없는 경우 연결하지 않음
        if (!roomId) {
            console.warn("[useWebSocket] ⚠️ roomId 없음 → 연결 안함");
            return;
        }

        // 로그인 사용자 없으면 연결하지 않음
        if (user === null) {
            console.warn("[useWebSocket] 🚫 user=null → 연결 안함");
            return;
        }

        // 모든 조건 충족 → WebSocket 연결 시작
        console.log("[useWebSocket] ✅ 모든 조건 만족 → SockJS 연결 시도");

        //SockJS 객체 생성 (withCredentials로 쿠키 전달 가능)
        const socket = new SockJS("http://localhost:8080/ws",{withCredentials: true})

        // STOMP 클라이언트 생성
        const stompClient = over(socket);


        console.log("[useWebSocket] 🌐 SockJS 객체 생성됨:", socket);
        console.log("[useWebSocket] 🌐 STOMP 클라이언트 생성됨:", stompClient);

        // WebSocket 연결 및 구독
        stompClient.connect({}, () => {
            console.log("[useWebSocket] 🔗 WebSocket 연결 성공");
            setIsConnected(true);

            // 특정 채팅방 구독
            const topic = `/topic/chat/${roomId}`;
            console.log("[useWebSocket] 📢 구독 요청:", topic);

            stompClient.subscribe(topic, (message) => {
                console.log("[useWebSocket] 📩 메시지 수신:", message);

                try {
                    // 수신 메시지 JSON 파싱
                    const parsedMessage = JSON.parse(message.body);
                    console.log("[useWebSocket] ✅ 메시지 파싱:", parsedMessage);

                    // 콜백 함수 호출 (새 메시지 전달)
                    if (onMessageReceived) {
                        onMessageReceived(parsedMessage);
                    }
                } catch (error) {
                    console.error("[useWebSocket] ❗ 메시지 파싱 실패:", error);
                }
            });
        }, (error) => {
            // 연결 실패 시
            console.error("[useWebSocket] ❌ WebSocket 연결 실패:", error);
            console.error("[useWebSocket] ❌ 실패 상세:", error ? error.toString() : '알 수 없는 오류');
            setIsConnected(false);
        });

        // stompClient를 ref에 저장
        stompClientRef.current = stompClient;

        /// 컴포넌트 언마운트 시 연결 종료
        return () => {
            console.log("[useWebSocket] 🛑 컴포넌트 언마운트 → WebSocket 연결 종료");
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.disconnect(() => {
                    console.log("[useWebSocket] 🛑 WebSocket 완전 종료");
                });
            }
        };
    }, [roomId, user, isLoading]); // 변경사항 발생 시 재호출

    //웹소켓으로 메시지 전송
    const sendMessage = (messageDto) => {
        console.log("[useWebSocket] 📤 sendMessage 호출:", messageDto);

        if (stompClientRef.current && stompClientRef.current.connected) {
            // 메시지 전송
            stompClientRef.current.send(`/app/chat/${roomId}`, {}, JSON.stringify(messageDto));
            console.log("[useWebSocket] ✅ 메시지 전송 성공:", messageDto);
        } else {
            console.error("[useWebSocket] ❗ 연결 안됨 → 메시지 전송 실패");
        }
    };

    // 외부로 노출
    return { sendMessage, isConnected };
};

export default useWebSocket;