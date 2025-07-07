// src/pages/member/buyer/MyPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import BuyerProfile from '../../../components/member/buyer/buyerProfile.jsx';
import { getMyReviewList } from '../../../api/reviewApi.jsx';
import { getPointBalance } from '../../../api/pointApi.jsx';
import { getOrderList } from '../../../api/buyerOrderApi.jsx';
import { getRepresentativeBadge } from '../../../api/badgeApi.jsx';
import { listMyPayments } from '../../../api/paymentApi.jsx';  // ← 새로 추가
import { useAuth } from '../../../store/AuthContext.jsx';

export default function MyPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const currentUserUid = user?.userId;

    const [reviewCount, setReviewCount]       = useState(0);
    const [paymentCount, setPaymentCount]     = useState(0);  // ← 새로 추가
    const [orderCount, setOrderCount]         = useState(0);
    const [pointBalance, setPointBalance]     = useState(0);
    const [recentOrders, setRecentOrders]     = useState([]);
    const [loadingRecentOrders, setLoadingRecentOrders] = useState(true);
    const [errorRecentOrders, setErrorRecentOrders]     = useState(null);
    const [representativeBadge, setRepresentativeBadge] = useState(null);

    const orderStatusMap = {
        RESERVATION_PENDING:   '예약 확인 중',
        RESERVATION_CONFIRMED: '예약 확정',
        PREPARING:             '준비 중',
        READY_FOR_PICKUP:      '픽업 준비 완료',
        PICKUP_COMPLETED:      '픽업 완료',
        RESERVATION_CANCELLED: '예약 취소',
        NO_SHOW:               '노쇼',
    };

    useEffect(() => {
        if (!currentUserUid) return;

        const fetchAllData = async () => {
            // 1) 리뷰 수
            try {
                const payload = await getMyReviewList(currentUserUid, { page: 0, size: 1 });
                setReviewCount(payload.totalCount || 0);
            } catch {
                setReviewCount(0);
            }

            // 2) 결제 내역 수 ← 새로 추가
            try {
                const paymentsPage = await listMyPayments({ page: 0, size: 1 });
                // if your API returns { pageInfo: { totalElements } }
                const total = paymentsPage.pageInfo?.totalElements
                    // or, if it returns an array:
                    ?? (Array.isArray(paymentsPage) ? paymentsPage.length : 0);
                setPaymentCount(total);
            } catch {
                setPaymentCount(0);
            }

            // 3) 포인트
            try {
                const bal = await getPointBalance(currentUserUid);
                setPointBalance(bal);
            } catch {
                setPointBalance(0);
            }

            // 4) 주문 내역과 최신 주문
            try {
                setLoadingRecentOrders(true);
                const allOrdersRes    = await getOrderList(currentUserUid, { page: 0, size: 1 });
                setOrderCount(allOrdersRes.pageInfo?.totalElements ?? 0);

                const recentOrdersRes = await getOrderList(currentUserUid, {
                    page: 0, size: 3, sort: 'modDate,desc'
                });
                setRecentOrders(
                    Array.isArray(recentOrdersRes.orders)
                        ? recentOrdersRes.orders
                        : recentOrdersRes.content || []
                );
            } catch (err) {
                console.error(err);
                setErrorRecentOrders('주문 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoadingRecentOrders(false);
            }

            // 5) 대표 뱃지
            try {
                const badge = await getRepresentativeBadge(user.uid);
                setRepresentativeBadge(badge || null);
            } catch {
                setRepresentativeBadge(null);
            }
        };

        fetchAllData();
    }, [currentUserUid, user.uid]);

    const handleViewOrderDetail = orderId => navigate(`/buyer/orders/${orderId}`);

    if (!user || !currentUserUid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">사용자 정보를 불러오는 중입니다...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:px-6 lg:px-8 max-w-4xl min-h-screen">

            {/* 1. 프로필 */}
            <BuyerProfile representativeBadge={representativeBadge} />

            {/* 2. 요약 */}
            <section className="bg-white rounded-lg p-6 mb-6 border border-gray-300">
                <div className="grid grid-cols-4 divide-x divide-gray-200">
                    {/* 나의 리뷰 */}
                    <div
                        className="flex flex-col items-center justify-center py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => navigate('/buyer/reviews')}
                    >
                        <p className="text-lg font-semibold text-gray-700">리뷰 내역</p>
                        <p className="mt-1 text-lg font-semibold text-gray-800">{reviewCount}</p>
                    </div>

                    {/* 나의 결제 내역 */}
                    <div
                        className="flex flex-col items-center justify-center py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => navigate('/buyer/payments')}
                    >
                        <p className="text-lg font-semibold text-gray-700">결제 내역</p>
                        <p className="mt-1 text-lg font-semibold text-gray-800">{paymentCount}</p>
                    </div>

                    {/* 전체 주문 내역 */}
                    <div
                        className="flex flex-col items-center justify-center py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => navigate('/buyer/orders')}
                    >
                        <p className="text-lg font-semibold text-gray-700">전체 주문 내역</p>
                        <p className="mt-1 text-lg font-semibold text-gray-800">{orderCount}</p>
                    </div>

                    {/* 찜 목록 */}
                    <div
                        className="flex flex-col items-center justify-center py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => navigate('/buyer/profile/likes')}
                    >
                        <p className="text-lg font-semibold text-gray-700">찜 목록</p>
                        <p className="mt-1 text-lg font-semibold text-gray-800">♥️</p>
                    </div>
                </div>
            </section>

            {/* 3. 포인트 */}
            <section
                className="bg-white rounded-lg p-6 mb-6 border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate('/buyer/profile/points')}
            >
                <p className="text-lg font-semibold text-gray-700 text-center mb-2">포인트</p>
                <p className="text-2xl font-bold text-orange-500 text-center">{pointBalance}P</p>
            </section>

            {/* 4. 최신 주문 */}
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
                            <li
                                key={order.orderId}
                                className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-semibold text-gray-800">주문 번호: {order.orderNumber}</p>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            order.status === 'RESERVATION_PENDING'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : order.status === 'PICKED_UP' || order.status === 'COMPLETED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                    {orderStatusMap[order.status] || order.status}
                  </span>
                                </div>
                                {/* … 이하 생략 … */}
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
