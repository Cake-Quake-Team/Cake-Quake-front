//새로운 주문
import React, { useEffect, useState } from 'react';
import { getSellerOrderList, updateSellerOrderStatus } from '../../../../api/sellerOrderApi';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../../store/AuthContext.jsx';

const NewOrdersSection = () => {
    const [newOrders, setNewOrders] = useState([]);
    const [loadingNewOrders, setLoadingNewOrders] = useState(true);
    const [errorNewOrders, setErrorNewOrders] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const shopId = user?.shopId;

    const orderStatusMap = {
        RESERVATION_PENDING: '예약 확인 중',
        RESERVATION_CONFIRMED: '예약 확정',
        PREPARING: '준비 중',
        READY_FOR_PICKUP: '픽업 준비 완료',
        PICKUP_COMPLETED: '픽업 완료',
        RESERVATION_CANCELLED: '예약 취소',
        NO_SHOW: '노쇼',
    };

    const DEFAULT_ORDER_ITEM_IMAGE = '/cakeImage/default-order-item.png';

    const fetchNewOrders = async () => {
        if (!shopId) {
            setErrorNewOrders("판매자 상점 ID를 찾을 수 없습니다.");
            setLoadingNewOrders(false);
            return;
        }
        try {
            setLoadingNewOrders(true);
            setErrorNewOrders(null);

            const params = {
                page: 0,
                size: 5,
                sort: 'modDate,desc',
                status: 'RESERVATION_PENDING'
            };

            const data = await getSellerOrderList(shopId, params);

            if (data && Array.isArray(data.orders)) {
                setNewOrders(data.orders);
            } else if (data && Array.isArray(data.content)) {
                setNewOrders(data.content);
            }
            else {
                console.error("API 응답 구조가 예상과 다릅니다:", data);
                setNewOrders([]);
                setErrorNewOrders("주문 데이터를 불러오는 데 문제가 발생했습니다.");
            }
        } catch (err) {
            console.error("새로운 주문 불러오기 실패:", err);
            setErrorNewOrders("새로운 주문을 불러오는 데 실패했습니다.");
        } finally {
            setLoadingNewOrders(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNewOrders();
        } else if (user === null) {
            setNewOrders([]);
            setLoadingNewOrders(false);
            setErrorNewOrders("로그인 정보가 필요합니다.");
        }
    }, [user, shopId]);

    const handleConfirmOrder = async (orderId) => {
        if (!shopId) {
            alert("상점 정보가 없어 주문을 처리할 수 없습니다.");
            return;
        }

        const confirmMessage = "해당 주문을 확인하고 상태를 '예약 확정'으로 변경하시겠습니까?";
        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            await updateSellerOrderStatus(shopId, orderId, 'RESERVATION_CONFIRMED');
            alert("주문이 성공적으로 확인되었습니다.");
            fetchNewOrders();
        } catch (error) {
            console.error("주문 확인 실패:", error);
            const errorMessage = error.response?.data?.message || "주문 확인 중 오류가 발생했습니다.";
            alert(`주문 확인 실패: ${errorMessage}`);
        }
    };

    const handleViewOrderDetails = (orderId) => {
        if (shopId) {
            navigate(`/shops/${shopId}/orders/${orderId}`);
        } else {
            alert("상점 ID를 알 수 없어 상세 페이지로 이동할 수 없습니다. 로그인 상태를 확인하세요.");
        }
    };

    if (user === null && loadingNewOrders) {
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

    if (loadingNewOrders) {
        return (
            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                <p>새로운 주문을 불러오는 중...</p>
            </div>
        );
    }

    if (errorNewOrders) {
        return (
            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center text-red-500">
                <p>{errorNewOrders}</p>
            </div>
        );
    }

    if (newOrders.length === 0) {
        return (
            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
                <p className="text-gray-500">새로운 주문이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">새로운 주문</h2>
            <div className="grid grid-cols-1 gap-4">
                {newOrders.map((order) => (
                    <div key={order.orderId} className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4 border border-gray-200">
                        {/* 주문 이미지 섹션 */}
                        <div className="w-16 h-16 rounded-md flex-shrink-0 overflow-hidden">
                            {Array.isArray(order.items) && order.items.length > 0 && order.items[0].thumbnailImageUrl ? (
                                <img
                                    src={order.items[0].thumbnailImageUrl.startsWith('http') ? order.items[0].thumbnailImageUrl : `http://localhost:8080/${order.items[0].thumbnailImageUrl}`}
                                    alt={order.items[0].cname || '케이크 이미지'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_ORDER_ITEM_IMAGE; }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center">
                                    이미지<br/>없음
                                </div>
                            )}
                        </div>
                        {/* 주문 상세 정보 */}
                        <div className="flex-grow">
                            <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                            <p className="text-sm text-gray-600">총 가격: ₩{order.orderTotalPrice?.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">
                                픽업 일시: {order.pickupDate} {order.pickupTime}
                            </p>
                            <p className="text-sm text-gray-600">요청사항: {order.orderNote || '없음'}</p>
                            <p className="text-sm text-gray-600 font-medium">상태: {orderStatusMap[order.status] || order.status}</p>
                        </div>
                        {/* 액션 버튼들 */}
                        <div className="flex flex-col space-y-2 flex-shrink-0">
                            <button
                                onClick={() => handleConfirmOrder(order.orderId)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                            >
                                주문 확인
                            </button>
                            <button
                                onClick={() => handleViewOrderDetails(order.orderId)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
                            >
                                상세 보기
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewOrdersSection;