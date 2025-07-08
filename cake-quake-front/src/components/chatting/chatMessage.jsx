const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const ChatMessage = ({ message, isMine }) => (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className="flex flex-col max-w-[70%]">
            {!isMine && message.senderUsername && (
                <span className="text-xs text-gray-600 mb-1 pl-2">{message.senderUsername}</span>
            )}
            <div className={`inline-block p-3 rounded-lg break-words
                            ${isMine ? 'bg-blue-500 text-white self-end' : 'bg-white text-gray-800 self-start border border-gray-200'}`}> {/* 상대방 메시지 테두리 변경 */}
                <span className="text-sm">{message.message}</span>
                {/* 타임스탬프 스타일 유지 */}
                <span className={`block text-right ${isMine ? 'text-blue-200' : 'text-gray-500'} text-xs mt-1`}>
                    {formatTimestamp(message.timestamp)}
                </span>
            </div>
        </div>
    </div>
);


export default ChatMessage;