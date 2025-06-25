
import CakeCard from "../../cake/itemComponents/cakeCard.jsx";
import {useNavigate} from "react-router";

const CakeListSection = ({ cakes }) => {
    const navigate = useNavigate();


    const handleCardClick = (shopId, cakeId) => {
        navigate(`/buyer/shops/${shopId}/cakes/read/${cakeId}`); // 예: /cakes/123
    };

    if (!cakes || cakes.length === 0) {
        return <div className="text-center text-gray-500 py-10 text-lg">등록된 케이크가 없습니다.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cakes.map((cake) => (
                <CakeCard
                    key={`${cake.shopId}-${cake.cakeId}`}
                    cake={cake}
                    onClick={() => handleCardClick(cake.shopId, cake.cakeId)}
                />
            ))}
        </div>
    );
};

export default CakeListSection;