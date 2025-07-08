import {useNavigate, useParams} from "react-router";
import {useAuth} from "../../store/AuthContext.jsx";
import {useEffect, useState} from "react";
import {getSellerChatRooms} from "../../api/chatAPi.jsx";

const SellerChatRoomsPage = () => {
    const { shopId } = useParams();
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChatRooms = async () => {
            if (isLoading || !user || !user.uid) {
                // 사용자 정보 로딩 중이거나 로그인되지 않았다면 기다리거나 로그인 페이지로 리다이렉트
                if (!isLoading && (!user || !user.uid)) {
                    alert('로그인이 필요합니다.');
                    navigate('/auth/signin');
                }
                return;
            }

            if (!shopId) {
                setError('상점 ID가 필요합니다.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await getSellerChatRooms(shopId);
                setChatRooms(data);
            } catch (err) {
                console.error('채팅방 목록 불러오기 실패:', err);
                setError('채팅방 목록을 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchChatRooms();
    }, [shopId, user, isLoading, navigate]); // 의존성 배열에 필요한 값 포함

    const handleChatRoomClick = (roomKey) => {
        navigate(`/shops/${shopId}/chatting/${roomKey}`); // 해당 채팅방 페이지로 이동
    };

    if (loading) {
        return <div className="p-4 max-w-md mx-auto text-center">채팅방 목록을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="p-4 max-w-md mx-auto text-center text-red-500">{error}</div>;
    }

    if (chatRooms.length === 0) {
        return <div className="p-4 max-w-md mx-auto text-center text-gray-600">아직 개설된 채팅방이 없습니다.</div>;
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">내 가게 채팅방 목록 ({shopId})</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {chatRooms.map((room) => (
                    <div
                        key={room.roomKey}
                        className="p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition duration-200"
                        onClick={() => handleChatRoomClick(room.roomKey)}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg text-gray-800">
                                {room.buyerUsername} 님과의 채팅
                            </span>

                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            상점: {room.shopName}
                        </p>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerChatRoomsPage;
