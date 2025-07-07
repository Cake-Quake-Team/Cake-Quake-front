const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const ChatMessage = ({ message, isMine }) => (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className="flex flex-col max-w-[70%]"> {/* 메시지 최대 너비 설정 */}
            {/* 발신자 닉네임 (상대방 메시지일 경우만 표시) */}
            {!isMine && message.senderUsername && (
                <span className="text-xs text-gray-600 mb-1 pl-2">{message.senderUsername}</span>
            )}
            <div className={`inline-block p-2 rounded-lg break-words
                            ${isMine ? 'bg-orange-700 text-white self-end' : 'bg-white text-orange-700 self-start border border-orange-200'}`}>
                {/* 메시지 내용 */}
                <span className="text-sm">{message.message}</span>
                {/* 메시지 시간 */}
                <span className={`block text-right ${isMine ? 'text-orange-200' : 'text-gray-500'} text-xs mt-1`}>
                    {formatTimestamp(message.timestamp)}
                </span>
            </div>
        </div>
    </div>
);


export default ChatMessage;