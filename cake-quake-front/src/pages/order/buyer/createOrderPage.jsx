import CreateOrder from '../../../components/order/buyer/createOrder';
import  useCart  from '../../../hooks/useCart';
import { useAuth } from '../../../store/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CreateOrderPage() {
    const { user } = useAuth();
    const { items: cartItems } = useCart();
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/buyer/orders'); // 주문 완료 후 이동
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
            <h2 className="text-2xl font-semibold mb-6">주문 정보 입력</h2>
            <CreateOrder userId={user.userId} cartItems={cartItems} onSuccess={handleSuccess} />
        </div>
    );
}
