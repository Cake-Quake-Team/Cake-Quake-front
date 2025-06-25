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
            let response;
            if (selectedType === "lettering") {
                response = await recommendCakeLettering({ question: userQuestion });
            } else if (selectedType === "options") {
                response = await recommendCakeOptions({ question: userQuestion });
            } else if (selectedType === "image") {
                response = await recommendCakeImage({ question: userQuestion });
                return;
            } else {
                response = await generateAnswer({ question });
            }
            setChatHistory(prev =>
                prev.map((item, index) =>
                    index === prev.length - 1 // 마지막 질문 (방금 보낸 질문)
                        ? { ...item, answer: response }
                        : item
                )
            );
        } catch (error) {
            console.error("AI 추천 실패", error);
            setChatHistory(prev => [...prev, { question, answer: "추천에 실패했습니다. 다시 시도해주세요." }]);
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
