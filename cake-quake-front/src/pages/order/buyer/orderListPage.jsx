import React, { useEffect, useState } from 'react';
import { getOrderList } from '../../../api/buyerOrderApi';
import OrderListItem from '../../../components/order/buyer/OrderListItem';

export default function OrderListPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageInfo, setPageInfo] = useState({ currentPage: 0, totalPages: 1, totalElements: 0 }); // pageInfo 상태

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true); // 로딩 시작
            setError(null);    // 에러 초기화
            try {
                // getOrderList API 호출
                // 서버의 페이지 인덱스가 0부터 시작하므로 page: 0으로 요청하는 것이 올바름
                const data = await getOrderList({ page: pageInfo.currentPage, size: 10 });
                console.log("📦 주문 리스트 응답:", data); // 응답 데이터 로깅

                setOrders(data.orders || []); // 주문 목록 상태 업데이트
                setPageInfo(data.pageInfo); // 페이지 정보 상태 업데이트
            } catch (err) {
                console.error("❌ 주문 목록 가져오기 실패:", err); // 에러 로깅
                setError(err); // 에러 상태 설정
                setOrders([]); // 에러 발생 시 주문 목록 초기화
                setPageInfo({ currentPage: 0, totalPages: 1, totalElements: 0 }); // 페이지 정보 초기화
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };

        fetchOrders(); // 함수 실행
    }, [pageInfo.currentPage]); // pageInfo.currentPage가 변경될 때마다 다시 호출

    // 로딩 상태에 따른 UI
    if (isLoading) {
        return (
            <div className="p-4 text-center text-blue-600 font-semibold">
                로딩 중…
            </div>
        );
    }

    // 에러 상태에 따른 UI
    if (error) {
        return (
            <p className="p-6 text-red-500 font-semibold">
                주문 목록을 불러오는 중 오류가 발생했습니다: {error.message || '알 수 없는 오류'}
            </p>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">주문 내역</h2>

            {/* 주문 목록이 비어있을 때 */}
            {orders.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                    주문 내역이 없습니다.
                </p>
            ) : (
                <div className="space-y-4 max-w-2xl mx-auto"> {/* max-w-2xl: 최대 너비 제한, mx-auto: 중앙 정렬 */}
                    {orders.map(order => (
                        <OrderListItem key={order.orderId} order={order} />
                    ))}
                </div>
            )}

            {/* 페이징 컨트롤러 (주석 해제 시 활성화) */}
            {/* pageInfo에 총 페이지 수가 1보다 클 때만 표시 */}
            {pageInfo.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    {/* 이전 페이지 버튼 */}
                    <button
                        onClick={() => setPageInfo(prev => ({...prev, currentPage: prev.currentPage - 1}))}
                        disabled={pageInfo.currentPage === 0} // 현재 페이지가 첫 페이지면 비활성화
                        className="px-3 py-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        이전
                    </button>
                    {/* 페이지 번호들 */}
                    {[...Array(pageInfo.totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPageInfo(prev => ({...prev, currentPage: i}))}
                            className={`px-3 py-1 border rounded-md ${pageInfo.currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    {/* 다음 페이지 버튼 */}
                    <button
                        onClick={() => setPageInfo(prev => ({...prev, currentPage: prev.currentPage + 1}))}
                        disabled={pageInfo.currentPage >= pageInfo.totalPages - 1} // 현재 페이지가 마지막 페이지면 비활성화
                        className="px-3 py-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}