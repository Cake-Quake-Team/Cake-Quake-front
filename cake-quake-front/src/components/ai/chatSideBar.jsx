import React from 'react';
import { Menu , SquarePen } from 'lucide-react';

function ChatSidebar({ chatHistory, onSelectChat, selectedIndex, onClose, onNewChat }) {
    return (
        <aside className="w-64 h-full bg-gray-50 text-gray-700 flex flex-col shadow-md">
            <div className="flex items-center justify-end px-4 py-3">
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    title="사이드바 닫기"
                >
                    <Menu   className="w-5 h-5 text-gray-700" />
                </button>
            </div>
            <div className="ml-2 px-4 py-3 hover:bg-gray-200">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center gap-2 from-emerald-500 to-teal-500 transition-all duration-200 text-sm"
                >
                    <SquarePen className="w-4 h-4" />
                    새 채팅
                </button>
            </div>
            <div className="flex items-center justify-between px-4 py-3 pb-3">
                <span className="text-sm text-gray-500 tracking-wide mt-2 inline-block">내 채팅 목록</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {chatHistory.length === 0 ? (
                    <p className="text-gray-500 text-center text-sm py-4 px-2">아직 대화가 없습니다.</p>
                ) : (
                    chatHistory.map((chatSession, index) => (
                        <button
                            // 고유한 sessionId를 key로 사용하고, 없다면 index로 폴백
                            key={chatSession.sessionId || `session-${index}`}
                            onClick={() => onSelectChat(index)}
                            className={`rounded-2xl w-full text-left px-4 py-3 text-sm border-b border-gray-100 transition-all duration-200
                            ${selectedIndex === index
                                ? "font-medium bg-gray-200 border-l-4 "
                                : "text-gray-700 hover:bg-gray-100 border-l-4 border-transparent"
                            }`}
                        >
                            {/* chatSession.title이 비어있거나 null이면 '새로운 대화' 표시 */}
                            {chatSession.title || "새로운 대화"}
                        </button>
                    ))
                )}
            </div>
        </aside>
    );
}

export default ChatSidebar;