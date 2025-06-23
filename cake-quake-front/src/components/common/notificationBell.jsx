import { useEffect, useState } from "react";
import { getMyNotifications, markAsRead } from "../../api/notificationApi";

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [showList, setShowList] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getMyNotifications();
            setNotifications(data);
        } catch (e) {
            console.error("알림 불러오기 실패", e);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleClickNotification = async (noti) => {
        if (!noti.isRead) {
            await markAsRead(noti.id);
        }

        // referenceId로 이동
        if (noti.type === "NEW_ORDER") {
            window.location.href = `/seller/profile`;
        } else if (noti.type === "PICKUP_REMINDER") {
            window.location.href = `/buyer/pickup/${noti.referenceId}`;
        }
    };

    return (
        <div className="relative">
            <button onClick={() => setShowList(prev => !prev)} className="relative w-5 h-5 cursor-pointer">
                🔔
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showList && (
                <div className="absolute right-0 mt-2 w-72 bg-white border shadow-md z-50 rounded">
                    {notifications.length === 0 ? (
                        <p className="p-4 text-gray-400 text-sm text-center">알림이 없습니다</p>
                    ) : (
                        notifications.map(noti => (
                            <div
                                key={noti.id}
                                onClick={() => handleClickNotification(noti)}
                                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                                    noti.isRead ? 'bg-white' : 'bg-blue-50'
                                }`}
                            >
                                <p className="text-sm">{noti.content}</p>
                                <p className="text-xs text-gray-400 mt-1">{noti.regDate}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;