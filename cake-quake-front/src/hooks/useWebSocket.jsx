
import Stomp from 'stompjs';
import {useCallback, useEffect, useRef, useState} from "react";
import {useAuth} from "../store/AuthContext.jsx"; //사용자 인증 정보 가져오기


const useWebSocket = (roomId, onMessageReceived) => {
    const stompClientRef = useRef(null); // STOMP 클라이언트 인스턴스 참조
    const [isConnected, setIsConnected] = useState(false); // WebSocket 연결 상태
    const { user, isLoading } = useAuth(); // 사용자 인증 정보 및 로딩 상태

    // onMessageReceived 콜백 함수를 메모이제이션하여 불필요한 리렌더링 방지
    const memoizedOnMessageReceived = useCallback(onMessageReceived, [onMessageReceived]);

    /**
     * WebSocket 연결을 해제하는 함수
     */
    const disconnectWebSocket = useCallback(() => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            console.log("[useWebSocket] 🔌 STOMP 연결 해제 시도...");
            stompClientRef.current.disconnect(() => { // stompjs의 연결 해제 메서드
                setIsConnected(false);
                console.log("[useWebSocket] 🔌 STOMP 연결 해제 완료");
            });
        }
    }, []); // 의존성 배열 비워 한 번만 생성되도록 함

    useEffect(() => {
        console.log("==============================================");
        console.log("[useWebSocket] 📝 useEffect 호출됨");
        console.log("[useWebSocket] 👉 roomId:", roomId);
        console.log("[useWebSocket] 👉 isLoading:", isLoading);
        console.log("[useWebSocket] 👉 user:", user);
        console.log("==============================================");

        // 초기화: 연결 상태를 false로 설정
        setIsConnected(false);

        // 연결 조건 검사
        if (isLoading) {
            console.warn("[useWebSocket] ⏳ isLoading=true → 연결 시도 안함");
            return;
        }

        if (!roomId) {
            console.warn("[useWebSocket] ⚠️ roomId 없음 → 연결 시도 안함");
            return;
        }

        if (user === null) {
            console.warn("[useWebSocket] 🚫 user=null → 연결 시도 안함");
            return;
        }

        // 이미 연결되어 있다면 새로 연결하지 않음
        if (stompClientRef.current && stompClientRef.current.connected) {
            console.log("[useWebSocket] ℹ️ 이미 연결되어 있음. 새로운 연결 시도 안함.");
            return;
        }

        console.log("[useWebSocket] ✅ 모든 조건 만족 → STOMP 연결 시도");

        try {
            // WebSocket 객체 생성 (운영에서는 wss 사용)
            const socket = new WebSocket(import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws");
            console.log("[useWebSocket] 🌐 WebSocket 객체 생성됨:", socket);

            // stompjs의 client 메서드를 사용하여 STOMP 클라이언트 인스턴스 생성
            const stompClient = Stomp.client(import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws");
            // NOTE: stompjs (2.3.3)는 WebSocket 객체를 직접 인자로 받지 않고, brokerURL을 통해 내부적으로 WebSocket을 생성합니다.
            // 따라서 위의 `new WebSocket(...)` 라인은 사실상 필요 없지만, 기존 코드 흐름을 유지하기 위해 남겨두었습니다.
            // 실제로는 `Stomp.client(brokerURL)`이 내부적으로 WebSocket을 관리합니다.

            stompClientRef.current = stompClient; // 클라이언트 인스턴스 참조 저장

            console.log("[useWebSocket] 🌐 STOMP 클라이언트 생성됨:", stompClient);

            // 연결 시도
            stompClient.connect(
                {}, // headers (필요시 JWT 추가 가능)
                () => {
                    console.log("[useWebSocket] ✅ STOMP 연결 성공");
                    setIsConnected(true);

                    const topic = `/topic/chat/room/${roomId}`;
                    // 메시지 구독
                    stompClient.subscribe(topic, (message) => {
                        console.log("[useWebSocket] 📩 메시지 수신:", message);

                        try {
                            const parsedMessage = JSON.parse(message.body);
                            console.log("[useWebSocket] ✅ 메시지 파싱:", parsedMessage);

                            if (memoizedOnMessageReceived) {
                                memoizedOnMessageReceived(parsedMessage);
                            }
                        } catch (error) {
                            console.error("[useWebSocket] ❗ 메시지 파싱 실패:", error);
                        }
                    });
                },
                (error) => {
                    console.error("[useWebSocket] ❌ STOMP 연결 실패:", error);
                    setIsConnected(false);
                    disconnectWebSocket(); // 오류 발생 시 연결 해제
                }
            );

        } catch (error) {
            console.error("[useWebSocket] 💥 WebSocket/STOMP 생성 또는 활성화 오류:", error);
            setIsConnected(false);
            disconnectWebSocket();
        }

        // 컴포넌트 언마운트 시 연결 정리
        return () => {
            console.log("[useWebSocket] 🛑 컴포넌트 언마운트 → WebSocket 연결 종료 정리");
            disconnectWebSocket();
        };

    }, [roomId, user, isLoading, memoizedOnMessageReceived, disconnectWebSocket]); // 의존성 배열에 disconnectWebSocket 추가

    /**
     * 메시지를 전송하는 함수
     * @param {Object} messageDto - 전송할 메시지 데이터 객체
     */
    const sendMessage = useCallback((messageDto) => {
        console.log("[useWebSocket] 📤 sendMessage 호출:", messageDto);
        console.log("[useWebSocket] 💡 messageDto JSON:", JSON.stringify(messageDto));
        console.log("[useWebSocket] 💡 messageDto Type:", Array.isArray(messageDto) ? "Array" : "Object");

        if (stompClientRef.current && stompClientRef.current.connected) {
            // stompjs의 send 메서드 사용 (destination, headers, body)
            stompClientRef.current.send(
                `/app/chat/${roomId}`,
                {}, // 필요시 헤더 추가
                JSON.stringify(messageDto)
            );
            console.log("[useWebSocket] ✅ 메시지 전송 성공:", messageDto);
        } else {
            console.error("[useWebSocket] ❗ 연결 안됨 → 메시지 전송 실패");
        }
    }, [roomId]); // roomId가 변경될 때마다 함수 재생성

    return { sendMessage, isConnected };
};

export default useWebSocket;