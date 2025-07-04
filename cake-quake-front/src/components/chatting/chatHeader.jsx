import {ArrowLeftIcon} from "lucide-react";

const ChatHeader =({onBackClick})=>{
    return (
        <div className="flex items-center p-4 h-16 border-b-2 border-orange-700 text-orange-700 text-2xl font-bold">
            <ArrowLeftIcon className="h-8 w-8 cursor-pointer mr-4" onClick={onBackClick} />
            <span>채팅방</span>
        </div>
    );
};

export default ChatHeader;