import {useNavigate} from "react-router";
import {useAuth} from "../../../../store/AuthContext.jsx";
import {getTopStoreRequests} from "../../../../api/procurementApi.jsx";
import {useEffect, useState} from "react";

const statusClasses = {
    REQUESTED:  'bg-yellow-100 text-yellow-800',
    SCHEDULED:  'bg-green-100  text-green-800',
    CANCELLED:  'bg-red-100    text-red-800'
};


const ProcurementSection = () =>{
    const navigate =useNavigate();
   const {user} = useAuth()
    const shopId = user?.shopId ?? user?.shopId.id;

    // 1) 최근 3건 상태
    const [recentOrders, setRecentOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // 2) shopId 준비되면 API 호출
    useEffect(() => {
        if (!shopId) return;
        setLoadingOrders(true);
        getTopStoreRequests(shopId)
            .then(data => {
                // 데이터 구조에 따라 content 사용
                setRecentOrders(data.content ?? data);
            })
            .catch(err => console.error('최근 발주 3건 조회 실패', err))
            .finally(() => setLoadingOrders(false));
    }, [shopId]);


    const handleViewPurchaseOrders = () => {
       if(!shopId) return;
        navigate(`/seller/${shopId}/procurements`); // 발주 목록 페이지로 이동
    };

    const handleNewPurchaseOrder = () => {
        if(!shopId) return
        navigate(`/seller/${shopId}/procurements/create`); // 새 발주 요청 페이지로 이동
    };

    const handleClickItem = (procurementId) => {
        if (!shopId) return;
        navigate(`/seller/${shopId}/procurements/${procurementId}`);
    };


    if (!user) {
        return (
            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">발주 관리</h2>
                <p>로그인 정보를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">

            {/* 헤더: 왼쪽 제목, 오른쪽 버튼 그룹 */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">발주 관리</h2>
                <div className="flex space-x-3">
                    <button
                        onClick={handleViewPurchaseOrders}
                        disabled={!shopId}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        발주 목록 보기
                    </button>
                    <button
                        onClick={handleNewPurchaseOrder}
                        disabled={!shopId}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        새 발주 요청
                    </button>
                </div>
            </div>

            {/* 본문: 최근 3건 */}
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-gray-600">
                <p className="mb-2 font-medium">최근 3건의 발주 요청</p>

                {loadingOrders ? (
                    <p>불러오는 중...</p>
                ) : recentOrders.length === 0 ? (
                    <p>아직 발주 요청이 없습니다.</p>
                ) : (
                    <ul className="space-y-2">
                        {recentOrders.map(order => {
                            const createdDate   = order.regDate
                                ? new Date(order.regDate).toLocaleDateString('ko-KR')
                                : '–';
                            const estimatedDate = order.estimatedArrivalDate
                                ? new Date(order.estimatedArrivalDate).toLocaleDateString('ko-KR')
                                : '미정';
                            const badgeClass = statusClasses[order.status] || 'bg-gray-100 text-gray-800';

                            return (
                                <li
                                    key={order.procurementId ?? order.id}
                                    className="p-4 bg-white rounded border hover:shadow cursor-pointer"
                                    onClick={() => handleClickItem(order.procurementId ?? order.id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                발주 #{order.procurementId ?? order.id}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                생성일: {createdDate}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                도착 예정일: {estimatedDate}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-sm font-medium ${badgeClass}`}
                                        >
                      {order.status}
                    </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );

};

export default ProcurementSection;