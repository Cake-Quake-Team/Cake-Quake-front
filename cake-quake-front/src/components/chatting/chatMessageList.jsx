import ChatMessage from "./ChatMessage.jsx";

const ChatMessageList = ({ messages, myUserId }) => (
    <>
        {messages.map((msg, idx) => (
            // isMine 판단 기준을 msg.senderUid와 myUserId (user.uid)로 변경
            <ChatMessage key={idx} message={msg} isMine={msg.senderUid === myUserId} />
        ))}
    </>
);

export default ChatMessageList;