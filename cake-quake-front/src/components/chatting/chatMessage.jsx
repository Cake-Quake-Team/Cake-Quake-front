const ChatMessage = ({ message, isMine }) => (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
        <div className="flex flex-col">
            {!isMine && <span className="text-xs text-gray-600 mb-1">{message.nickname}</span>}
            <div className={`inline-block p-2 rounded-lg max-w-xs break-words ${isMine ? 'bg-orange-700 text-white self-end' : 'bg-white text-orange-700 self-start border border-orange-200'}`}>
                <span className="text-sm">{message.message}</span>
                <span className={`block text-right ${isMine ? 'text-orange-200' : 'text-gray-500'} text-xs mt-1`}>
                    {message.createdAt?.substr(11, 5) ?? ''}
                </span>
            </div>
        </div>
    </div>
);

export default ChatMessage;