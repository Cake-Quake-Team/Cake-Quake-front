import { useEffect, useState, useCallback } from "react";
import AiForm from "../../components/ai/aiForm";
import AiResultBox from "../../components/ai/aiResultBox";
import ChatSidebar from "../../components/ai/ChatSidebar";
import { Menu } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../store/AuthContext";
import AlertModal from "../../components/common/AlertModal.jsx";

import {
    generateAnswer,
    recommendCakeLettering,
    recommendCakeOptions,
    recommendCakeImage,
    getChatHistory
} from "../../api/aiApi";

function AiRecommendPage() {
    const { user } = useAuth();
    const userId = user?.uid;

    const historyKey = `aiChatHistory_${userId}`;
    const sessionKey = `aiSessionId_${userId}`;

    const [question, setQuestion] = useState("");
    const [selectedType, setSelectedType] = useState("chat");
    const [chatHistory, setChatHistory] = useState(() => {
        try {
            const saved = localStorage.getItem(historyKey);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [selectedChatIndex, setSelectedChatIndex] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // 새롭게 추가된 상태 - formError 메시지와 노출 제어용
    const [formError, setFormError] = useState(null);
    const [showError, setShowError] = useState(false);

    const startNewChat = useCallback(() => {
        const newSessionId = uuidv4();
        localStorage.setItem(sessionKey, newSessionId);
        setCurrentSessionId(newSessionId);
        setChatHistory(prev => {
            const newChatEntry = { sessionId: newSessionId, title: "새로운 대화", messages: [] };
            return [...prev, newChatEntry];
        });
        setSelectedChatIndex(prev => (prev === null ? 0 : prev + 1));
        setQuestion("");
        setFormError(null);
        setShowError(false);
    }, [sessionKey]);

    const handleSelectChat = useCallback((index) => {
        if (!chatHistory[index] || index === selectedChatIndex) return;
        setSelectedChatIndex(index);
        setCurrentSessionId(chatHistory[index].sessionId);
        setQuestion("");
        setIsLoading(false);
        setFormError(null);
        setShowError(false);
    }, [chatHistory, selectedChatIndex]);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(historyKey, JSON.stringify(chatHistory));
        } catch {}
    }, [chatHistory, historyKey]);

    useEffect(() => {
        let storedSessionId = localStorage.getItem(sessionKey);
        if (chatHistory.length === 0 && !storedSessionId) {
            startNewChat();
        } else if (storedSessionId) {
            const existingIndex = chatHistory.findIndex(chat => chat.sessionId === storedSessionId);
            if (existingIndex !== -1) {
                setSelectedChatIndex(existingIndex);
                setCurrentSessionId(storedSessionId);
            } else {
                setCurrentSessionId(storedSessionId);
            }
        }
    }, [startNewChat, chatHistory, sessionKey]);

    useEffect(() => {
        if (!currentSessionId) return;

        async function fetchChatLogsForSession() {
            const currentChat = chatHistory[selectedChatIndex];

            if (currentChat?.sessionId === currentSessionId && currentChat.messages?.length > 0) {
                return;
            }

            setIsLoading(true);
            try {
                const logs = await getChatHistory(currentSessionId);
                const formattedMessages = logs.map(log => ({
                    question: log.question,
                    answer: log.answer
                }));

                setChatHistory(prev => {
                    const existingIndex = prev.findIndex(chat => chat.sessionId === currentSessionId);
                    const newChatEntry = {
                        sessionId: currentSessionId,
                        title: formattedMessages.length > 0
                            ? formattedMessages[0].question.slice(0, 30) + (formattedMessages[0].question.length > 30 ? '...' : '')
                            : "새로운 대화",
                        messages: formattedMessages
                    };

                    if (existingIndex !== -1) {
                        const updated = [...prev];
                        updated[existingIndex] = newChatEntry;
                        setSelectedChatIndex(existingIndex);
                        return updated;
                    } else {
                        setSelectedChatIndex(prev.length);
                        return [...prev, newChatEntry];
                    }
                });
            } catch {
                setChatHistory(prev => {
                    const existingIndex = prev.findIndex(chat => chat.sessionId === currentSessionId);
                    if (existingIndex !== -1) {
                        const updated = [...prev];
                        updated[existingIndex].messages = [];
                        return updated;
                    }
                    return prev;
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchChatLogsForSession();
    }, [currentSessionId, selectedChatIndex]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) {
            setFormError({message:"질문을 입력해주세요!", type: 'error'});
            setShowError(true);
            return;
        }
        if (!currentSessionId || selectedChatIndex === null || !chatHistory[selectedChatIndex]) {
            startNewChat();
            setFormError({message:"새로운 대화 세션이 시작되었습니다. 다시 질문해주세요!", type: 'success'});
            setShowError(true);
            return;
        }

        const userQuestion = question;
        setQuestion("");
        setIsLoading(true);

        setChatHistory(prev =>
            prev.map((chat, idx) =>
                idx === selectedChatIndex
                    ? {
                        ...chat,
                        messages: [...chat.messages, { question: userQuestion, answer: null }],
                        title: chat.messages.length === 0
                            ? userQuestion.slice(0, 30) + (userQuestion.length > 30 ? '...' : '')
                            : chat.title
                    }
                    : chat
            )
        );

        try {
            let aiAnswerContent = null;
            const payload = { question: userQuestion, sessionId: currentSessionId };

            if (selectedType === "lettering") {
                aiAnswerContent = await recommendCakeLettering(payload);
            } else if (selectedType === "options") {
                aiAnswerContent = await recommendCakeOptions(payload);
            } else if (selectedType === "image") {
                const imageData = await recommendCakeImage(payload);
                aiAnswerContent = `<img src="${imageData}" alt="AI 이미지" class="max-w-full h-auto rounded-lg mt-2" />`;
            } else {
                aiAnswerContent = await generateAnswer(payload);
            }

            setChatHistory(prev =>
                prev.map((chat, idx) =>
                    idx === selectedChatIndex
                        ? {
                            ...chat,
                            messages: chat.messages.map((msg, msgIdx) =>
                                msgIdx === chat.messages.length - 1
                                    ? { ...msg, answer: aiAnswerContent }
                                    : msg
                            )
                        }
                        : chat
                )
            );
        } catch {
            setChatHistory(prev =>
                prev.map((chat, idx) =>
                    idx === selectedChatIndex
                        ? {
                            ...chat,
                            messages: chat.messages.map((msg, msgIdx) =>
                                msgIdx === chat.messages.length - 1
                                    ? { ...msg, answer: "죄송합니다. 요청 처리에 실패했습니다. 다시 시도해주세요." }
                                    : msg
                            )
                        }
                        : chat
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    const currentChatMessages =
        selectedChatIndex !== null &&
        chatHistory[selectedChatIndex] &&
        Array.isArray(chatHistory[selectedChatIndex].messages)
            ? chatHistory[selectedChatIndex].messages
            : [];

    return (
        <div className="flex h-screen bg-white text-gray-900 font-sans -mb-10">
            <div className="flex flex-1">
                {isSidebarOpen ? (
                    <ChatSidebar
                        chatHistory={chatHistory}
                        onSelectChat={handleSelectChat}
                        selectedIndex={selectedChatIndex}
                        onClose={toggleSidebar}
                        onNewChat={startNewChat}
                    />
                ) : (
                    <div className="w-12 flex flex-col items-center justify-start pt-4 bg-gray-200 border-r border-gray-300">
                        <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-800 p-2 rounded-md">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                )}
                <main className="flex flex-col flex-1 bg-white">
                    <div className="flex-1 overflow-y-auto px-4 py-6">
                        <AiResultBox chatHistory={currentChatMessages} loading={isLoading} />
                    </div>
                    <div className="py-4 px-4 bg-white border-t border-gray-200">
                        <AiForm
                            question={question}
                            onQuestionChange={setQuestion}
                            selectedType={selectedType}
                            onTypeChange={setSelectedType}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </main>
            </div>

            {showError && formError && (
                <AlertModal
                    message={formError}
                    type="error"
                    show={showError}
                />
            )}
        </div>
    );
}

export default AiRecommendPage;
