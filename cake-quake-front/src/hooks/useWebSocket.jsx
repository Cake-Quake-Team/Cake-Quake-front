
// let sock = new SockJS("http://localhost:8080/socket");

import {useEffect, useRef, useState} from "react";
import * as StompJS from 'stompjs'; // STOMP 클라이언트 임포트
import SockJS from "sockjs-client"; // SockJS 클라이언트 임포트

const WEBSOCKET_URL='/socket';

const useWebSocket = (roomId,token) => {
    const [isConnected, setIsConnected] = useState(false); // 웹 소켓 연결 상태
    const [lastMessage, setLastMessage] = useState(null); //가장 최근 받은 메세지

    //Stomp 클라이언트 인스턴스 저장 -> 컴포넌트가 리렌더링되도 인스턴스 유지
    const clientRef = useRef(null);
    //Stomp 구독 객체 저장 -> 언마운트 시 구독 해제
    const subscriptionRef = useRef(null);

    //웹소켓 연결 및 해제 로직 관리
    useEffect(() => {
        const sock = new SockJS(WEBSOCKET_URL);
        const client = StompJS.over(sock);
        clientRef.current = client;

        const headers = { Authorization: token };

        client.connect(
            headers,
            () => {
                setIsConnected(true);
                console.log('STOMP Connected.');

                subscriptionRef.current = client.subscribe(`/sub/room/${roomId}`, (data) => {
                    setLastMessage(JSON.parse(data.body));
                });
            },
            (error) => {
                setIsConnected(false);
                console.error('STOMP connection error:', error);
                // 필요하다면 재접속 시도 로직 추가 가능
            }
        );

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            if (clientRef.current && clientRef.current.connected) {
                clientRef.current.disconnect(() => {
                    console.log('STOMP Disconnected on cleanup.');
                });
            }
            setIsConnected(false);
        };
    }, [roomId, token]);

    //7. 메세지 전송 함수 -> 훅 사용하는 컴포넌트에서 호출
    const sendMessage = (destination, messageBody) => {
        if (clientRef.current && clientRef.current.connected) {
            // 연결되어 있을 때만 메시지 전송
            clientRef.current.send(destination, {}, JSON.stringify(messageBody));
        } else {
            console.warn('WebSocket not connected. Message not sent.');
        }
    };

    //8. 훅이 반환하는 값
    return {isConnected, lastMessage, sendMessage, client: clientRef.current};
};

export default useWebSocket;




