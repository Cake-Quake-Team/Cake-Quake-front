import React, {useState, useEffect} from 'react';
import {Link} from 'react-router';
import BuyerProfile from '../../../components/member/buyer/buyerProfile.jsx';
import {getMyReviewList} from "../../../api/reviewApi.jsx";
import {useNavigate} from "react-router";
import {getPointBalance} from "../../../api/pointApi.jsx";
import {getOrderList} from "../../../api/buyerOrderApi.jsx"; // 구매자 주문 목록 API 임포트
import {useAuth} from '../../../store/AuthContext.jsx'; // useAuth 훅 임포트
import {getRepresentativeBadge} from "../../../api/badgeApi.jsx";

function MyPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const currentUserUid = user?.userId;

    const [reviewCount, setReviewCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [pointBalance, setPointBalance] = useState(0);

    const [recentOrders, setRecentOrders] = useState([]);
    const [loadingRecentOrders, setLoadingRecentOrders] = useState(true);
    const [errorRecentOrders, setErrorRecentOrders] = useState(null);
    const [representativeBadge, setRepresentativeBadge] = useState(null); // 대표 뱃지 상태


    const orderStatusMap = {
        RESERVATION_PENDING: '예약 확인 중',
        RESERVATION_CONFIRMED: '예약 확정',
        PREPARING: '준비 중',
        READY_FOR_PICKUP: '픽업 준비 완료',
        PICKUP_COMPLETED: '픽업 완료',
        RESERVATION_CANCELLED: '예약 취소',
        NO_SHOW: '노쇼',
    };


    useEffect(() => {
        if (!currentUserUid) return;

        const fetchAllData = async () => {
            // 리뷰 수 조회
            try {
                const payload = await getMyReviewList(currentUserUid, { page: 0, size: 1 });
                setReviewCount(payload.totalCount);
            } catch (e) {
                console.error('리뷰 수 조회 실패', e);
                setReviewCount(0);
            }

            // 포인트 잔액 조회
            try {
                const bal = await getPointBalance(currentUserUid);
                setPointBalance(bal);
            } catch (e) {
                console.error('포인트 잔액 조회 실패', e);
                setPointBalance(0);
            }

            // 전체 주문 수 및 최신 주문 내역 조회
            try {
                setLoadingRecentOrders(true);
                setErrorRecentOrders(null);

                const allOrdersResponse = await getOrderList(currentUserUid, { page: 0, size: 1 });
                setOrderCount(allOrdersResponse.pageInfo?.totalElements ?? 0);

                const recentOrdersResponse = await getOrderList(currentUserUid, {
                    page: 0,
                    size: 3,
                    sort: 'modDate,desc'
                });

                if (recentOrdersResponse && Array.isArray(recentOrdersResponse.orders)) {
                    setRecentOrders(recentOrdersResponse.orders);
                } else if (recentOrdersResponse && Array.isArray(recentOrdersResponse.content)) {
                    setRecentOrders(recentOrdersResponse.content);
                } else {
                    console.error("구매자 최신 주문 API 응답 구조가 예상과 다릅니다:", recentOrdersResponse);
                    setRecentOrders([]);
                    setErrorRecentOrders("최신 주문 데이터를 불러오는 데 문제가 발생했습니다.");
                }

            } catch (err) {
                console.error("주문 정보 불러오기 실패:", err);
                setErrorRecentOrders("주문 정보를 불러오는 데 실패했습니다.");
                setOrderCount(0);
                setRecentOrders([]);
            } finally {
                setLoadingRecentOrders(false);
            }

            // 대표 뱃지 정보 조회
            try {
                const badge = await getRepresentativeBadge(user.uid);
                if (badge) {
                    setRepresentativeBadge(badge);
                } else {
                    setRepresentativeBadge(null);
                }
            } catch (e) {
                console.error('대표 뱃지 정보 조회 실패:', e);
                setRepresentativeBadge(null);
            }

        };

        fetchAllData();
    }, [currentUserUid]);

    const handleViewOrderDetail = (orderId) => {
        navigate(`/buyer/orders/${orderId}`);
    };

    if (!user || !currentUserUid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">사용자 정보를 불러오는 중입니다...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:px-6 lg:px-8 max-w-4xl min-h-screen">

            {/* 1. 온도 표시 컴포넌트 사용 */}
            <BuyerProfile representativeBadge={representativeBadge}/>

            {/* 2. 요약 정보 (쿠폰, 나의 리뷰, 전체 주문 내역, 찜) */}
            <section className="bg-white rounded-lg p-6 mb-6 border border-gray-300">
                <div className="flex justify-around text-center divide-x divide-gray-200">
                    {/* 나의 리뷰 */}
                    <div
                        className="flex-1 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => navigate('/buyer/reviews')}
                    >
                        <p className="text-lg font-semibold text-gray-700">나의 리뷰</p>
                        <p className="text-gray-400">{reviewCount}</p>
                    </div>
                    {/* 전체 주문 내역 */}
                    <div className="flex-1 px-4">
                        <Link to="/buyer/orders" className="block cursor-pointer hover:bg-gray-50 transition-colors">
                            <p className="text-lg font-semibold text-gray-700">전체 주문 내역</p>
                            <p className="text-gray-400">{orderCount}</p>
                        </Link>
                    </div>
                    {/* 찜 섹션 */}
                    <Link
                        to="/buyer/profile/likes"
                        className="flex-1 px-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <p className="text-lg font-semibold text-gray-700">찜 목록</p>
                        <p className="text-gray-400">♥️</p>
                    </Link>
                </div>
            </section>


            {/* 3. 포인트 별도 섹션 */}
            <section
                className="bg-white rounded-lg p-6 mb-6 border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate('/buyer/profile/points')}
            >
                <p className="text-lg font-semibold text-gray-700 text-center mb-2">포인트</p>
                <p className="text-2xl font-bold text-orange-500 text-center">{pointBalance}P</p>
            </section>

            {/* 4. 최신 주문 내역 리스트 (수정된 부분) */}
            <section className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">최신 주문 내역</h3>
                <p className="text-gray-500 mb-6 text-sm">주문한 케이크들을 확인하세요.</p>

                {loadingRecentOrders ? (
                    <p className="text-gray-500 text-center">최신 주문 내역을 불러오는 중...</p>
                ) : errorRecentOrders ? (
                    <p className="text-red-500 text-center">{errorRecentOrders}</p>
                ) : recentOrders.length === 0 ? (
                    <p className="text-gray-500 text-center">최근 주문 내역이 없습니다.</p>
                ) : (
                    <ul className="space-y-4">
                        {recentOrders.map(order => (
                            <li key={order.orderId}
                                className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-semibold text-gray-800">주문 번호: {order.orderNumber}</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                                        ${order.status === 'RESERVATION_PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'PICKED_UP' || order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                            order.status === 'RESERVATION_CANCELLED' || order.status === 'NO_SHOW' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                    }`}
                                    >
                                        {orderStatusMap[order.status] || order.status}
                                    </span>
                                </div>
                                {/* 주문 아이템 정보 표시 (첫 번째 아이템만 간단히) */}
                                {order.items && order.items.length > 0 && (
                                    <div className="flex items-center mt-2">
                                        {order.items[0].thumbnailImageUrl && (
                                            <img
                                                src={order.items[0].thumbnailImageUrl}
                                                alt={order.items[0].cname}
                                                className="w-12 h-12 object-cover rounded-md mr-3"
                                            />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">{order.items[0].cname} ({order.items[0].productCnt}개)</p>
                                        </div>
                                    </div>
                                )}
                                <p className="text-sm text-gray-600 mt-2">픽업
                                    일시: {order.pickupDate} {order.pickupTime}</p>
                                <p className="text-sm text-gray-600">총 결제 금액:
                                    ₩{order.orderTotalPrice?.toLocaleString()}</p>
                                <div className="text-right mt-2">
                                    <button
                                        onClick={() => handleViewOrderDetail(order.orderId)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        상세 보기
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
export default MyPage;