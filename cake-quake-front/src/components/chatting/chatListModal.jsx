import {useEffect, useRef, useState} from "react";
import {useAuth} from "../../store/AuthContext.jsx";
import Modal from "./modal.jsx";
import ShopChatPage from "../../pages/shop/shopChatPage.jsx";
import {getShopListInfinity} from "../../api/shopApi.jsx";
import {useNavigate} from "react-router";
import {createOrGetChatRoom} from "../../api/chatAPi.jsx";

const CHAT_LIST_PAGE_SIZE = 15; // 한 번에 불러올 매장 수

const ChatListModal = ({ isOpen, onClose, positionStyles = {} }) => {
    const [shops, setShops] = useState([]);
    const { user, isLoading: isAuthLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [selectedShop, setSelectedShop] = useState(null);

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [isChatRoomModalOpen, setIsChatRoomModalOpen] = useState(false);
    const [selectedRoomKey, setSelectedRoomKey] = useState(null);


    const [chatRoomModalPosition, setChatRoomModalPosition] = useState({});

    const scrollRef = useRef(null);
    const chatListModalRef = useRef(null);

    const handleScroll = () => {
        if (!scrollRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollHeight - scrollTop <= clientHeight + 100 && hasMore && !loading) {
            loadMoreShops();
        }
    };

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasMore, loading, shops]);

    const fetchShops = async (pageToFetch = 0, reset = false) => {
        if (isAuthLoading || !user || !user.uid) {
            console.warn("[ChatListModal] User data not loaded or UID missing, delaying shop list fetch.");
            setLoading(false);
            return;
        }
        if (!hasMore && !reset) return;

        try {
            setLoading(true);
            setError(null);

            const responseData = await getShopListInfinity({
                page: pageToFetch,
                size: CHAT_LIST_PAGE_SIZE,
                filter: "ACTIVE",
                sort: "shopId,asc"
            });

            if (responseData && Array.isArray(responseData.content)) {
                setShops(prevShops => reset ? responseData.content : [...prevShops, ...responseData.content]);
                setHasMore(!responseData.last);
                setPage(pageToFetch + 1);
            } else {
                console.error("[ChatListModal] getShopListInfinity 반환 데이터 형식이 예상과 다름:", responseData);
                setError('매장 목록 데이터 형식이 올바르지 않습니다.');
                if (reset) setShops([]);
            }

        } catch (err) {
            console.error("[ChatListModal] 매장 목록 조회 실패:", err);
            setError('매장 목록을 불러오는 데 실패했습니다.');
            if (reset) setShops([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && !isAuthLoading && user && user.uid) {
            setShops([]);
            setPage(0);
            setHasMore(true);
            fetchShops(0, true);
        }
        if (!isOpen) {
            setShops([]);
            setPage(0);
            setHasMore(true);
            setLoading(false);
            setError(null);
            setSelectedShop(null);
            setSelectedRoomKey(null);
            setIsChatRoomModalOpen(false);
            setChatRoomModalPosition({}); // ⭐ 채팅방 모달 위치 초기화
        }
    }, [isOpen, user, isAuthLoading]);

    const loadMoreShops = () => {
        fetchShops(page, false);
    };


    const handleShopClick = async (shop) => {
        if (isAuthLoading || !user || !user.uid) {
            alert('로그인 정보가 없거나 로딩 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        try {
            const data = await createOrGetChatRoom({
                sellerUid: shop.sellerUid,
                buyerUid: user.uid,
                shopId: shop.shopId
            });

            setSelectedShop(shop);
            const roomKey = data.roomKey;
            setSelectedRoomKey(roomKey);

            if (chatListModalRef.current) {
                const rect = chatListModalRef.current.getBoundingClientRect();
                const modalWidth = 320;
                const modalHeight = 500;


                let newLeft = rect.left + rect.width + 20;
                let newTop = rect.top;

                // 화면 경계 처리 (오른쪽으로 너무 나가지 않게)
                if (newLeft + modalWidth > window.innerWidth - 10) {
                    newLeft = window.innerWidth - modalWidth - 10;
                }
                if (newTop + modalHeight > window.innerHeight - 10) {
                    newTop = window.innerHeight - modalHeight - 10;
                }
                newTop = Math.max(newTop, 10);
                newLeft = Math.max(newLeft, 10);


                setChatRoomModalPosition({
                    top: `${newTop}px`,
                    left: `${newLeft}px`,
                });
            } else {
                setChatRoomModalPosition({ top: '50%', left: '50%' });
            }

            setIsChatRoomModalOpen(true);
        } catch (err) {
            console.error("[ChatListModal] 채팅방 생성/조회 실패:", err);
            alert('채팅방을 여는 데 실패했습니다.');
        }
    };

    const handleCloseChatRoomModal = () => {
        setIsChatRoomModalOpen(false);
        setSelectedRoomKey(null);
        setChatRoomModalPosition({});
    };

    const handleViewFullChat = (shopId, roomKey) => {
        handleCloseChatRoomModal();
        navigate(`/buyer/shops/${shopId}/chatting/${roomKey}`);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="채팅 가능한 매장 목록"
                positionStyles={positionStyles}
                modalRefProp={chatListModalRef}
            >
                <div className="flex-1 overflow-y-auto" ref={scrollRef}>
                    {loading && shops.length === 0 && (
                        <div className="text-center text-gray-500">매장 목록을 불러오는 중...</div>
                    )}
                    {error && <div className="text-center text-red-500">{error}</div>}
                    {!loading && !error && shops.length === 0 && (
                        <div className="text-center text-gray-600">활성화된 매장이 없습니다.</div>
                    )}
                    {!loading && !error && shops.length > 0 && (
                        <div className="space-y-2">
                            {shops.map(shop => (
                                <div
                                    key={shop.shopId}
                                    className="flex items-center p-3 border rounded-lg cursor-pointer
                                               hover:bg-blue-50 transition duration-200 border-gray-200" // ⭐ 호버 색상 파란색
                                    onClick={() => handleShopClick(shop)}
                                >
                                    <img
                                        src={shop.thumbnailUrl || 'https://placehold.co/60x60/black/white?text=Shop'}
                                        alt={shop.shopName}
                                        className="w-12 h-12 object-cover rounded-md mr-3"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-800">{shop.shopName}</h3>
                                        <p className="text-sm text-gray-600">{shop.address}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && shops.length > 0 && (
                                <div className="text-center text-gray-500 mt-2">더 많은 매장을 불러오는 중...</div>
                            )}
                            {!hasMore && shops.length > 0 && (
                                <div className="text-center text-gray-400 mt-2">더 이상 매장이 없습니다.</div>
                            )}
                        </div>
                    )}
                </div>
            </Modal>

            {selectedRoomKey && (
                <Modal
                    isOpen={isChatRoomModalOpen}
                    onClose={handleCloseChatRoomModal}
                    title={`[[${selectedShop?.shopName || '매장'}]] 채팅방`}
                    positionStyles={chatRoomModalPosition}
                >
                    <ShopChatPage initialRoomId={selectedRoomKey} />

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => {
                                handleCloseChatRoomModal();
                                handleViewFullChat(selectedShop.shopId, selectedRoomKey);
                            }}
                            className="text-blue-600 underline text-sm hover:text-blue-800" // ⭐ 버튼 텍스트 색상 파란색
                        >
                            전체 화면으로 보기
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
};


export default ChatListModal;