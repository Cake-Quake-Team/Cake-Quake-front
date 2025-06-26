import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import BuyerProfile from '../../../components/member/buyer/buyerProfile.jsx';
import { getMyReviewList } from "../../../api/reviewApi.jsx";
import { useNavigate } from "react-router";
import { getPointBalance } from "../../../api/pointApi.jsx";
import { getOrderList } from "../../../api/buyerOrderApi.jsx"; // 구매자 주문 목록 API 임포트
import { useAuth } from '../../../store/AuthContext.jsx'; // useAuth 훅 임포트

function MyPage() {
    const navigate = useNavigate();
    const { user } = useAuth(); // useAuth 훅을 사용하여 로그인한 사용자 정보 가져오기
    const currentUserUid = user?.userId; // user 객체에서 userId 가져오기

    // 마이페이지의 다른 상태들...
    const [couponCount, setCouponCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0); // 전체 주문 개수
    const [pointBalance, setPointBalance] = useState(0);

    // 최신 주문 3개 관련 상태
    const [recentOrders, setRecentOrders] = useState([]);
    const [loadingRecentOrders, setLoadingRecentOrders] = useState(true);
    const [errorRecentOrders, setErrorRecentOrders] = useState(null);

    // 주문 상태를 한국어로 매핑하는 객체
    const orderStatusMap = {
        RESERVATION_PENDING: '예약 확인 중',
        RESERVATION_CONFIRMED: '예약 확정',
        PREPARING: '준비 중',
        READY_FOR_PICKUP: '픽업 준비 완료',
        PICKUP_COMPLETED: '픽업 완료',
        RESERVATION_CANCELLED: '예약 취소',
        NO_SHOW: '노쇼',
    };

    // (1) 쿠폰 개수 더미 초기화 (user id에 따라 변경될 수 있음)
    useEffect(() => {
        // 실제 백엔드에서 쿠폰 개수를 가져오는 API 호출 로직 추가 필요
        setCouponCount(5);
    }, []); // currentUserUid는 useEffect의 의존성으로 두지 않고, user를 사용

    // 리뷰 개수 조회
    useEffect(() => {
        if (!currentUserUid) return; // userId가 없으면 호출 안 함

        async function fetchReviewCount() {
            try {
                const payload = await getMyReviewList(currentUserUid, { page: 0, size: 1 }); // userId 파라미터 추가
                setReviewCount(payload.pageInfo?.totalElements ?? 0); // pageInfo에서 totalElements 가져오기
            } catch (e) {
                console.error('리뷰 수 조회 실패', e);
            }
        }
        fetchReviewCount();
    }, [currentUserUid]); // currentUserUid가 변경될 때마다 호출

    // 포인트 잔액 조회
    useEffect(() => {
        if (!currentUserUid) return; // userId가 없으면 호출 안 함

        async function fetchPoint() {
            try {
                // getPointBalance API는 userId를 받는지 확인 (가정)
                const bal = await getPointBalance(currentUserUid); // userId 파라미터 추가
                setPointBalance(bal);
            } catch (e) {
                console.error('포인트 잔액 조회 실패', e);
            }
        }
        fetchPoint();
    }, [currentUserUid]); // currentUserUid가 변경될 때마다 호출

    // 전체 주문 개수 조회
    useEffect(() => {
        if (!currentUserUid) return; // userId가 없으면 호출 안 함

        async function fetchOrderCount() {
            try {
                const response = await getOrderList(currentUserUid, { page: 0, size: 1 });
                setOrderCount(response.pageInfo?.totalElements ?? 0);
            } catch (e) {
                console.error('전체 주문 수 조회 실패', e);
            }
        }
        fetchOrderCount();
    }, [currentUserUid]); // currentUserUid가 변경될 때마다 호출


    // 최신 주문 3개 조회 (핵심 로직)
    useEffect(() => {
        if (!currentUserUid) {
            setErrorRecentOrders("로그인 정보가 필요합니다.");
            setLoadingRecentOrders(false);
            return;
        }

        const fetchRecentOrders = async () => {
            try {
                setLoadingRecentOrders(true);
                setErrorRecentOrders(null);
                const response = await getOrderList(currentUserUid, {
                    page: 0, // 첫 번째 페이지
                    size: 3, // 3개만 가져오기
                    sort: 'modDate,desc' // 최신 수정일 기준으로 내림차순 정렬
                });

                // API 응답 구조에 따라 response.orders 또는 response.content 사용
                if (response && Array.isArray(response.orders)) {
                    setRecentOrders(response.orders);
                } else if (response && Array.isArray(response.content)) {
                    setRecentOrders(response.content);
                } else {
                    console.error("구매자 최신 주문 API 응답 구조가 예상과 다릅니다:", response);
                    setRecentOrders([]);
                    setErrorRecentOrders("최신 주문 데이터를 불러오는 데 문제가 발생했습니다.");
                }

            } catch (err) {
                console.error("최신 주문 불러오기 실패:", err);
                setErrorRecentOrders("최신 주문을 불러오는 데 실패했습니다.");
            } finally {
                setLoadingRecentOrders(false);
            }
        };

        fetchRecentOrders();
    }, [currentUserUid]); // currentUserUid가 변경될 때마다 호출


    // 주문 상세 보기 핸들러
    const handleViewOrderDetail = (orderId) => {
        navigate(`/buyer/orders/${orderId}`); // 구매자 주문 상세 페이지로 이동
    };

    // user가 로딩되지 않았거나 (null) userId가 없는 경우 초기 로딩 메시지
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
            <BuyerProfile currentUserUid={currentUserUid} />

            {/* 2. 요약 정보 (쿠폰, 나의 리뷰, 전체 주문 내역) */}
            <section className="bg-white rounded-lg p-6 mb-6 border border-gray-300">
                <div className="flex justify-around text-center divide-x divide-gray-200">
                    <div className="flex-1 px-4">
                        <p className="text-lg font-semibold text-gray-700">쿠폰</p>
                        <p className="text-gray-400 ">{couponCount} <span className="text-gray-400">장</span></p>
                    </div>
                    <div
                        className="flex-1 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => navigate('/buyer/reviews')}
                    >
                        <p className="text-lg font-semibold text-gray-700">나의 리뷰</p>
                        <p className="text-gray-400">{reviewCount}</p>
                    </div>
                    <div className="flex-1 px-4">
                        <Link to="/buyer/orders" className="block">
                            <p className="text-lg font-semibold text-gray-700">전체 주문 내역</p>
                            <p className="text-gray-400">{orderCount}</p>
                        </Link>
                    </div>
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
                            <li key={order.orderId} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
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
                                                src={order.items[0].thumbnailImageUrl} // 이미 전체 URL이라고 가정
                                                alt={order.items[0].cname}
                                                className="w-12 h-12 object-cover rounded-md mr-3"
                                            />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">{order.items[0].cname} ({order.items[0].productCnt}개)</p>
                                        </div>
                                    </div>
                                )}
                                <p className="text-sm text-gray-600 mt-2">픽업 일시: {order.pickupDate} {order.pickupTime}</p>
                                <p className="text-sm text-gray-600">총 결제 금액: ₩{order.orderTotalPrice?.toLocaleString()}</p>
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
