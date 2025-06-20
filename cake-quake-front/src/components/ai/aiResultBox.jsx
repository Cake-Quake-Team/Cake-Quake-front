import { useEffect, useRef } from "react";

function AiResultBox({ chatHistory, loading }) {
    const latestMessageRef = useRef(null);

    useEffect(() => {
        if (latestMessageRef.current) {
            latestMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [chatHistory, loading]);

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
            {chatHistory.length === 0 && !loading && (
                <p className="text-center text-gray-400 italic">
                    AI의 답변이 여기에 표시됩니다.
                </p>
            )}
            {chatHistory.map(({ question, answer }, idx) => (
                // 마지막 메시지에만 ref를 달아 스크롤 타겟으로 사용합니다.
                <div key={idx}
                     className="flex flex-col gap-4"
                    // 현재 메시지가 chatHistory의 마지막 메시지인 경우에만 ref를 할당
                     ref={idx === chatHistory.length - 1 ? latestMessageRef : null}>
                    {/* 사용자 질문 */}
                    <div className="self-end bg-pink-100 text-gray-800 px-4 py-3 rounded-xl rounded-br-none max-w-[75%] shadow">
                        <p className="mt-1 text-sm font-medium whitespace-pre-line">{question}</p>
                    </div>
                    {/* AI 답변 - answer가 null이 아닐 때만 AI 답변 박스를 렌더링 */}
                    {answer !== null && (
                        <div className="self-start bg-gray-100 text-gray-800 px-4 py-3 rounded-xl rounded-bl-none max-w-[75%] shadow">
                            <span className="text-sm font-semibold text-pink-500">🎂 CQ봇:</span>
                            <div
                                className="mt-1 text-sm whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: answer }}
                            />
                        </div>
                    )}
                </div>
            ))}

            {loading && (
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