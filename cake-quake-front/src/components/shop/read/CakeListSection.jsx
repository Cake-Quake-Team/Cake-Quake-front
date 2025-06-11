import CakeItemCard from "./CakeItemCard.jsx";

const CakeListSection = ({ cakes }) => {
    if (!cakes || cakes.length === 0) {
        return <div className="text-center text-gray-500 py-10 text-lg">등록된 케이크가 없습니다.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cakes.map((cake) => (
                <CakeItemCard key={cake.cakeId} cake={cake} />
            ))}
        </div>
    );
};

export default CakeListSection;