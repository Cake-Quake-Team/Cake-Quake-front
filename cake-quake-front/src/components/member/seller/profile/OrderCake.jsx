const OrderCard = ({ order, type, onActionClick }) => {
    const isNew = type === 'new';
    const bgColor = isNew ? 'bg-blue-50' : 'bg-gray-50';
    const borderColor = isNew ? 'border-blue-200' : 'border-gray-200';
    const buttonBgColor = isNew ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300';
    const buttonTextColor = isNew ? 'text-white' : 'text-gray-800';
    const buttonText = isNew ? '주문 확인' : '자세히 보기';

    if (!order) return null;

    return (
        <div className={`${bgColor} p-6 rounded-lg border ${borderColor} flex items-center shadow-sm`}>
            <img src={order.cakeImage} alt="케이크 이미지" className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover mr-4 border border-blue-100" />
            <div className="flex-grow">
                {isNew ? (
                    <>
                        <p className="text-gray-900 font-semibold text-lg mb-1">{order.customerName}</p>
                        <p className="text-gray-700 text-sm md:text-base line-clamp-2">{order.orderContent}</p>
                    </>
                ) : (
                    <>
                        <p className="text-gray-900 font-semibold text-lg mb-1">{order.orderName}</p>
                        <p className="text-gray-700 text-sm md:text-base">{order.details}</p>
                        <p className="text-gray-600 text-xs md:text-sm mt-1">{order.dueDate}</p>
                    </>
                )}
            </div>
            <button
                onClick={() => onActionClick(order.id)}
                className={`ml-4 px-5 py-2 ${buttonBgColor} ${buttonTextColor} rounded-md text-base font-medium transition-colors duration-200 whitespace-nowrap`}
            >
                {buttonText}
            </button>
        </div>
    );
};

export default OrderCard;

//주문 부분을 나타내는 컴포넌트 -> 이용해서 새로운 주문, 주문 관리 부분 나타냄