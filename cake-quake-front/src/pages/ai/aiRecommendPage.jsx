import { useState } from "react";
import AiForm from "../../components/ai/aiForm";
import AiResultBox from "../../components/ai/aiResultBox";
import {
    generateAnswer,
    recommendCakeLettering,
    recommendCakeOptions,
    recommendCakeImage,
} from "../../api/aiApi";

function AiRecommendPage() {
    const [question, setQuestion] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) {
            alert("질문을 입력해주세요!");
            return;
        }

        const userQuestion = question; // 현재 질문을 변수에 저장
        setQuestion("");

        setChatHistory(prev => [...prev, { question: userQuestion, answer: null }]);
        setIsLoading(true);

        setIsLoading(true);
        try {
            let aiResponseData; // API 응답 데이터를 받을 변수
            let aiAnswerContent = null; // chatHistory에 최종적으로 들어갈 AI 답변 내용

            if (selectedType === "lettering") {
                aiResponseData = await recommendCakeLettering({ question: userQuestion });
                aiAnswerContent = aiResponseData; // 텍스트 답변은 바로 내용이 옴
            } else if (selectedType === "options") {
                aiResponseData = await recommendCakeOptions({ question: userQuestion });
                aiAnswerContent = aiResponseData; // 텍스트 답변은 바로 내용이 옴
            } else if (selectedType === "image") {
                aiResponseData = await recommendCakeImage({ question: userQuestion });
                // 이미지 응답일 경우 HTML img 태그 형태로 저장
                aiAnswerContent = `<img src="${aiResponseData.imageUrl}" alt="AI 이미지" style="max-width:100%;" />`;
            } else {
                aiResponseData = await generateAnswer({ question: userQuestion }); // 일관성 있게 userQuestion 사용
                aiAnswerContent = aiResponseData; // 일반 텍스트 답변은 바로 내용이 옴
            }

            // 모든 경우에 대해 AI 답변이 오면 해당 질문의 answer를 업데이트
            setChatHistory(prev =>
                prev.map((item, index) =>
                    index === prev.length - 1 // 가장 마지막에 추가된 질문을 찾아 업데이트
                        ? { ...item, answer: aiAnswerContent }
                        : item
                )
            );
        } catch (error) {
            console.error("AI 추천 실패", error);
            setChatHistory(prev =>
                prev.map((item, index) =>
                    index === prev.length - 1
                        ? { ...item, answer: "죄송합니다. 추천에 실패했습니다. 다시 시도해주세요." } // 사용자 친화적 메시지
                        : item
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen pt-16">
            {/* 채팅 영역 */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <AiResultBox chatHistory={chatHistory} loading={isLoading} />
            </div>

            {/* 입력창 */}
            <AiForm
                question={question}
                onQuestionChange={setQuestion}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                onSubmit={handleSubmit}
            />

        </div>
    );
}

export default AiRecommendPage;
