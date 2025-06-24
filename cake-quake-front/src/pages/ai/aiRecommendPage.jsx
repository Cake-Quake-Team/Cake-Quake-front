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

        setIsLoading(true);
        try {
            let response;
            if (selectedType === "lettering") {
                response = await recommendCakeLettering({ question });
            } else if (selectedType === "options") {
                response = await recommendCakeOptions({ question });
            } else if (selectedType === "image") {
                response = await recommendCakeImage({ question });
                setChatHistory(prev => [...prev, { question, answer: `<img src="${response.imageUrl}" alt="AI 이미지" style="max-width:100%;" />` }]);
                setIsLoading(false);
                setQuestion('');
                return;
            } else {
                response = await generateAnswer({ question });
            }

            setChatHistory(prev => [...prev, { question, answer: response }]);
            setQuestion('');
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
