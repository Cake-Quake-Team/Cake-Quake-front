import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {deleteNotification, getMyNotifications, markAsRead} from "../../api/notificationApi";
import {useAuth} from "../../store/AuthContext.jsx";
import {Bell, Trash2, Loader2} from "lucide-react";
import { parseISO, formatDistanceToNow, differenceInSeconds } from 'date-fns';
import { ko } from 'date-fns/locale';
import AlertModal from "./AlertModal.jsx";

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [showList, setShowList] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const bellRef = useRef(null);
    const navigate = useNavigate();
    const {user} = useAuth();
    const [formError, setFormError] = useState(null);
    const [showError, setShowError] = useState(false);

    const isAuthenticated = !!user;

    useEffect(() => {
        let intervalId;

        if (isAuthenticated) {
            fetchNotifications();

            // 1분마다 알림을 다시 불러와서 "XX분 전" 같은 상대 시간 업데이트
            intervalId = setInterval(() => {
                fetchNotifications();
            }, 60000); // 60초 (1분)마다 폴링
        } else {
            setNotifications([]);
            setIsLoading(false);
        }

        const handleClickOutside = (event) => {
            if (bellRef.current && !bellRef.current.contains(event.target)) {
                setShowList(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isAuthenticated]);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const data = await getMyNotifications();
            setNotifications(data);
        } catch (e) {
            console.error("알림 불러오기 실패", e);
        } finally {
            setIsLoading(false);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleClickNotification = async (noti) => {
        if (!noti.isRead) {
            try {
                await markAsRead(noti.id);
                setNotifications(prev => prev.map(n => n.id === noti.id ? {...n, isRead: true} : n));
            } catch (e) {
                console.error("알림 읽음 처리 실패", e);
            }
        }

        // 알림 타입별 경로 이동 처리
        const buyerTypes = [
            "PICKUP_REMINDER",
            "RESERVATION_CONFIRMATION",
            "CANCELLED_ORDER",
            "READY_FOR_PICKUP",
            "NO_SHOW_CONFIRMATION",
        ];
        const sellerTypes = [
            "NEW_ORDER",
            "ORDER_CANCELLED_BY_BUYER",
        ];

        if (buyerTypes.includes(noti.type)) {
            navigate(`/buyer/orders/${noti.referenceId}`);
        } else if (sellerTypes.includes(noti.type)) {
            navigate(`/shops/${user.shopId}/orders/${noti.referenceId}`);
        } else {
            console.warn("알 수 없는 알림 타입:", noti.type);
        }
    };

    const handleDeleteNotification = async (e, notificationId) => {
        e.stopPropagation();
        if (!window.confirm("정말로 이 알림을 삭제하시겠습니까?")) {
            return;
        }
        try {
            await deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            console.log(`알림 (ID: ${notificationId}) 삭제 성공`);
        } catch (error) {
            console.error(`알림 (ID: ${notificationId}) 삭제 실패`, error);
            setFormError({message: "알림 삭제에 실패했습니다.", type: 'error'});
            setShowError(true);
        }
    };

    // 상대 시간을 계산하는 헬퍼 함수
    const getRelativeTime = (dateString) => {
        if (!dateString) {
            return "날짜 정보 없음";
        }
        try {
            const date = parseISO(dateString);
            const now = new Date(); // 현재 시간

            const secondsDiff = differenceInSeconds(now, date); // 현재 시간과 알림 시간의 초 차이 계산

            if (secondsDiff < 60) { // 60초 (1분) 미만이면 "지금"으로 표시
                return "지금";
            } else {
                return formatDistanceToNow(date, { addSuffix: true, includeSeconds: false, locale: ko });
            }
        } catch (e) {
            console.error("날짜 파싱 또는 포맷팅 오류:", e, "원본 날짜 문자열:", dateString);
            return "날짜 오류";
        }
    };

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    return (
        <div className="relative" ref={bellRef}>
            {showError && formError && (
                <AlertModal
                    message={formError.message}
                    type={formError.type || "error"}
                    show={showError}
                />
            )}
            {isAuthenticated && (
                <button
                    onClick={() => setShowList(prev => !prev)}
                    className="relative p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    aria-label="알림 열기"
                >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] h-[20px] flex items-center justify-center border-2 border-white animate-bounce">
                            {unreadCount}
                        </span>
                    )}
                </button>
            )}

            {showList && (
                <div
                    className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden z-50 transform origin-top-right transition-all duration-200 ease-out"
                    style={{ maxHeight: '400px', overflowY: 'auto' }}
                >
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">알림</h3>
                        {unreadCount > 0 && (
                            <span className="text-sm text-blue-600 font-medium">{unreadCount}개 읽지 않음</span>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="p-4 flex items-center justify-center text-gray-500">
                            <Loader2 className="animate-spin mr-2" size={20} />
                            <span>알림 불러오는 중...</span>
                        </div>
                    ) : notifications.length === 0 ? (
                        <p className="p-4 text-gray-400 text-sm text-center">알림이 없습니다.</p>
                    ) : (
                        notifications.map(noti => (
                            <div
                                key={noti.id}
                                onClick={() => handleClickNotification(noti)}
                                className={`flex items-start justify-between p-4 border-b border-gray-100 cursor-pointer transition-colors duration-150 last:border-b-0
                                    ${noti.isRead ? 'bg-white text-gray-700' : 'bg-blue-50 text-gray-900 font-medium'}`}
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm leading-snug break-words">
                                        {!noti.isRead && (
                                            <span className="inline-block w-2 h-2 mr-2 bg-blue-500 rounded-full align-middle"></span>
                                        )}
                                        {noti.content}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {getRelativeTime(noti.regDate)} {/* ⭐ 상대 시간 표시 적용 ⭐ */}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteNotification(e, noti.id)}
                                    className="flex-shrink-0 ml-3 p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-gray-100 transition-colors duration-200"
                                    aria-label="알림 삭제"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                    {!isAuthenticated && (
                        <div className="p-4 text-gray-500 text-sm text-center border-t border-gray-200">
                            로그인이 필요합니다.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;