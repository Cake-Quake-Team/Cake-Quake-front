import SellerProfileSummary from "../../components/member/seller/profile/sellerProfileSummary.jsx";
import NewOrdersSection from "../../components/member/seller/profile/newOrderSection.jsx";
import OrderManagementSection from "../../components/member/seller/profile/orderManagementSection.jsx";
import ProcurementSection from "../../components/member/seller/profile/procurementSection.jsx";
import {useNavigate} from "react-router";

const SellerProfilePage = () => {
    const navigate = useNavigate();

    const handleConfirmOrder = (orderId) => {
        alert(`주문 ID ${orderId} 확인 처리! (실제 API 호출 필요)`);
        // 여기에 주문 확인 API 호출 로직 추가
    };

    const handleViewOrderDetails = (orderId) => {
        navigate(`/seller/orders/${orderId}`); // 주문 상세 페이지로 이동
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl w-full mx-auto p-4 md:p-8">

                <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">내 정보</h2>
                    <SellerProfileSummary className="!p-0 !py-0 !px-0 !max-w-full !mx-0" />
                </div>

                {/* 새로운 주문 섹션 */}
                <NewOrdersSection onConfirmOrder={handleConfirmOrder} />

                {/* 주문 관리 섹션 */}
                <OrderManagementSection onViewOrderDetails={handleViewOrderDetails} />

                {/* 발주 관리 섹션 */}
                <ProcurementSection />
            </div>
        </div>
    );
};

export default SellerProfilePage;
