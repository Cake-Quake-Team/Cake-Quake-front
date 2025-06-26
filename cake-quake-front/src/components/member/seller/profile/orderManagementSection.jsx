import React, { useEffect, useState } from 'react';
import { getSellerOrderList } from '../../../../api/sellerOrderApi'; // API 경로 확인
import { useAuth } from '../../../../store/AuthContext.jsx'; // useAuth 훅 경로 확인
import OrderCard from "./OrderCake.jsx"; // OrderCard 컴포넌트 임포트 (이름이 OrderCake.jsx이므로)
import { useNavigate } from 'react-router';

const OrderManagementSection = ({ onViewOrderDetails }) => {
    const [managedOrders, setManagedOrders] = useState([]);
    const [loadingManagedOrders, setLoadingManagedOrders] = useState(true);
    const [errorManagedOrders, setErrorManagedOrders] = useState(null);
    const { user } = useAuth(); // useAuth 훅을 사용하여 user 객체 가져오기
    const navigate = useNavigate();
    const shopId = user?.shopId; // user 객체에서 sellerShopId 가져오기

    // ⭐ 주문 상태를 한국어로 매핑하는 객체 (필요시) ⭐
    const orderStatusMap = {
        RESERVATION_PENDING: '예약 확인 중',
        RESERVATION_CONFIRMED: '예약 확정',
        PREPARING: '준비 중',
        READY_FOR_PICKUP: '픽업 준비 완료',
        PICKUP_COMPLETED: '픽업 완료',
        RESERVATION_CANCELLED: '예약 취소',
        NO_SHOW: '노쇼',
    };

    // ⭐ 픽업 준비 완료 상태의 주문 목록을 가져오는 함수 ⭐
    const fetchManagedOrders = async () => {
        if (!shopId) {
            setErrorManagedOrders("판매자 상점 ID를 찾을 수 없습니다.");
            setLoadingManagedOrders(false);
            return;
        }
        try {
            setLoadingManagedOrders(true);
            setErrorManagedOrders(null);
            const data = await getSellerOrderList(shopId, {
                page: 0,
                size: 10, // 한 페이지에 보여줄 주문 수 (조절 가능)
                sort: 'modDate,desc', // 최신 수정일 기준 정렬
                status: 'READY_FOR_PICKUP' // ⭐⭐ '픽업 준비 완료' 상태로 필터링 ⭐⭐
            });

            // API 응답 구조에 따라 data.orders 또는 data.content 사용
            if (data && Array.isArray(data.orders)) {
                setManagedOrders(data.orders);
            } else if (data && Array.isArray(data.content)) {
                setManagedOrders(data.content);
            } else {
                console.error("API 응답 구조가 예상과 다릅니다 (OrderManagement):", data);
                setManagedOrders([]);
                setErrorManagedOrders("주문 데이터를 불러오는 데 문제가 발생했습니다.");
            }
        } catch (err) {
            console.error("주문 관리 목록 불러오기 실패:", err);
            setErrorManagedOrders("주문 관리 목록을 불러오는 데 실패했습니다.");
        } finally {
            setLoadingManagedOrders(false);
        }
    };

    useEffect(() => {
        // user 객체가 로드되고 sellerShopId가 유효할 때만 데이터를 가져옵니다.
        if (user && shopId) {
            fetchManagedOrders();

        } else if (user === null) {
            // user가 null이면 (로그인 안 됨) 목록 비우고 로딩 종료
            setManagedOrders([]);
            setLoadingManagedOrders(false);
            setErrorManagedOrders("로그인 정보가 필요합니다.");
        }
    }, [user, shopId]); // user 또는 sellerShopId가 변경될 때마다 다시 호출

    // ⭐ 로딩 및 에러 상태에 따른 UI 렌더링 ⭐
    if (user === null && loadingManagedOrders) {
        return (
            <div className="mb-8 p-6 text-center text-gray-500 rounded-xl shadow-lg border border-gray-100">
                인증 정보 로딩 중이거나 로그인되지 않았습니다.
            </div>
        );
    }

    if (!shopId) {
        return (
            <div className="mb-8 p-6 text-center text-red-500 rounded-xl shadow-lg border border-gray-100">
                판매자 정보를 찾을 수 없습니다. (shopId 없음)
            </div>
        );
    }

    if (loadingManagedOrders) {
        return (
            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                <p>주문 목록을 불러오는 중...</p>
            </div>
        );
    }

    if (errorManagedOrders) {
        return (
            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center text-red-500">
                <p>{errorManagedOrders}</p>
            </div>
        );
    }

    // ⭐⭐ 전체 주문 목록 보기 핸들러 ⭐⭐
    const handleViewAllOrders = () => {
        if (shopId) {
            navigate(`/shops/${shopId}/orders`);
        } else {
            alert("상점 ID를 알 수 없어 전체 주문 목록 페이지로 이동할 수 없습니다.");
        }
    };

    return (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            {/* 헤더: 왼쪽 제목, 오른쪽 버튼 그룹 */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">주문 관리</h2>
                {/* 여기에 '주문 목록 보기'와 같은 추가 버튼이 있다면 여기에 배치 */}
                <button
                    onClick={handleViewAllOrders} // ⭐⭐ 새로운 핸들러 연결 ⭐⭐
                    disabled={!shopId} // shopId가 없으면 비활성화
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                    전체 주문 목록
                </button>
            </div>

            {/* 본문: 픽업 준비 완료된 주문 목록 */}
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-gray-600">
                <p className="mb-2 font-medium">픽업 준비 완료된 주문</p>

                {managedOrders.length === 0 ? (
                    <p>픽업 준비 완료된 주문이 없습니다.</p>
                ) : (
                    <ul className="space-y-2">
                        {managedOrders.map(order => {
                            const cardOrderData = {
                                id: order.orderId, // OrderCard가 id를 사용한다면
                                cakeImage: order.items && order.items[0] && order.items[0].thumbnailImageUrl,
                                orderName: order.orderNumber, // 주문 번호를 이름으로 사용
                                details: `${order.pickupDate} ${order.pickupTime} - ${orderStatusMap[order.status] || order.status}`, // 상세 정보
                                orderTotalPrice: order.OrderTotalPrice, // 총 가격
                                originalOrderData: order
                            };

                            return (
                                <li
                                    key={order.orderId}
                                    className="p-4 bg-white rounded border hover:shadow cursor-pointer"
                                >
                                    <OrderCard
                                        order={cardOrderData} // OrderCard가 cardOrderData를 받도록 (필요에 따라 order={order}로 변경)
                                        type="managed"
                                        onActionClick={() => onViewOrderDetails(shopId, order.orderId)}  // '자세히 보기' 버튼 클릭 시
                                    />
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OrderManagementSection;
