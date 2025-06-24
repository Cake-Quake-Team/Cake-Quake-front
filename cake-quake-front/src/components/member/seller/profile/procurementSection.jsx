
import {useNavigate} from "react-router";

const ProcurementSection = () =>{
    const navigate =useNavigate();

    const handleViewPurchaseOrders = () => {
        navigate('/seller/purchase-orders'); // 발주 목록 페이지로 이동
    };

    const handleNewPurchaseOrder = () => {
        navigate('/seller/purchase-orders/new'); // 새 발주 요청 페이지로 이동
    };

    return (
<div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">발주 관리</h2>
    <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-gray-600">
        <p className="mb-2">여기에 발주 요청 목록 또는 발주 관련 정보가 표시될 예정입니다.</p>
        <p>예: 새로운 발주 요청, 진행 중인 발주, 완료된 발주 등</p>
        <button
            onClick={handleViewPurchaseOrders}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
            발주 목록 보기
        </button>
        <button
            onClick={handleNewPurchaseOrder}
            className="ml-3 mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
            새 발주 요청
        </button>
    </div>
    {/* 실제 발주 데이터를 받아와서 렌더링하는 컴포넌트들을 여기에 추가할 수 있습니다. */}
    {/* <PurchaseOrderList /> */}
    {/* <PurchaseOrderRequestForm /> */}
</div>
);




};

export default ProcurementSection;