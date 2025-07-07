import { useEffect, useRef } from "react";
import { Bot } from 'lucide-react';

function AiResultBox({ chatHistory, loading }) {
    const latestMessageRef = useRef(null);

    useEffect(() => {
        if (!Array.isArray(chatHistory)) {
            console.warn("AiResultBox useEffect: chatHistory prop is not an array. Skipping scroll.");
            return;
        }

        // 스크롤 로직: 새 메시지가 추가되거나 로딩이 끝날 때 최신 메시지로 스크롤
        if (latestMessageRef.current && chatHistory.length > 0) {
            // 메시지가 추가되었거나 (가장 마지막 메시지의 answer가 null일 때),
            // 또는 답변이 완료되어 (answer가 null이 아닐 때) 스크롤이 필요할 때
            // 로딩 상태가 false가 되었을 때 (답변이 완료되었을 때) 또는 새로운 질문이 입력되어 answer가 아직 null일 때
            if (!loading || (loading && chatHistory[chatHistory.length - 1]?.answer === null)) {
                latestMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
            }
        }
    }, [chatHistory, loading]);

    if (!Array.isArray(chatHistory)) {
        console.error("AiResultBox: chatHistory prop is not an array on render, showing error message.");
        return (
            <p className="text-center text-gray-500 italic">
                채팅 기록을 불러오는 중 오류가 발생했습니다. (Type Error)
            </p>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 py-4">
            {/* 초기 메시지 */}
            {chatHistory.length === 0 && !loading && (
                <p className="text-center text-gray-400 italic">
                    안녕하세요 CQ봇입니다 무엇을 도와드릴까요?
                </p>
            )}
            {/* 채팅 메시지 목록 */}
            {chatHistory.map(({ question, answer }, idx) => (
                <div
                    key={idx}
                    className="flex flex-col gap-4"
                    // 마지막 메시지에만 ref 할당. answer가 null이 아닐 때만 스크롤하도록 조건 추가
                    ref={idx === chatHistory.length - 1 ? latestMessageRef : null}
                >
                    {/* 사용자 질문 말풍선 */}
                    <div className="self-end bg-pink-100 text-gray-800 px-4 py-1 rounded-xl rounded-br-none max-w-[75%] shadow flex items-start gap-1">
                        <p className="mt-1 text-sm font-medium whitespace-pre-line">
                            {question}
                        </p>
                    </div>

                    {/* AI 답변 말풍선 */}
                    {answer !== null && (
                        <div className="mt-3 self-start text-gray-800 flex items-start gap-1">
                            <Bot className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm font-semibold text-pink-500 select-none ml-1">:</span>
                            <div
                                className="text-sm whitespace-pre-line ml-1"
                                dangerouslySetInnerHTML={{ __html: answer }}
                            />
                        </div>
                    )}

                </div>
            ))}

            {/* 로딩 인디케이터 - 마지막 메시지가 사용자 질문이고, answer가 null인 경우 */}
            {loading && chatHistory.length > 0 && chatHistory[chatHistory.length - 1]?.answer === null && (
                <div className="flex items-center justify-center gap-3 p-6 bg-gray-100 rounded-xl max-w-[75%] shadow mx-auto">
                    <svg className="animate-spin h-6 w-6 text-pink-500" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                    <span className="text-pink-500 font-semibold">CQ봇이 생각 중이에요...</span>
                </div>
            )}
        </div>
    );
}

export default AiResultBox;