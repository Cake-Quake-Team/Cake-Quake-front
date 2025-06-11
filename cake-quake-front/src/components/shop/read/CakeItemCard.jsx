const CakeItemCard=({cake})=>{
    return (
        <div className="border border-gray-200 p-4 rounded-lg flex items-center gap-4 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
            <img
                src={cake.cakeImageUrl || '/default_cake_image.jpg'}
                alt={cake.cakeName}
                className="w-24 h-24 object-cover rounded-md flex-shrink-0 border border-gray-200"
            />
            <div>
                <h4 className="text-lg font-semibold mb-1 text-gray-800">{cake.cakeName}</h4>
                <p className="text-gray-700 text-sm">
                    가격: {cake.price ? `${cake.price.toLocaleString()}원` : '가격 미정'}
                </p>
            </div>
        </div>
    );
};

export default CakeItemCard;