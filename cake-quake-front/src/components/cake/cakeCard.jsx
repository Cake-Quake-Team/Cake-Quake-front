import React from 'react';

const DEFAULT_IMAGE = '/cakeImage/default-cake.png';

function CakeCard({ cake }) {

    const { cname, price, thumbnailImageUrl, isOnsale } = cake;
    const imgSrc = thumbnailImageUrl ? thumbnailImageUrl : DEFAULT_IMAGE;

    if (!cake) return null;

    return (
        <div className="border rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden relative">
            <img
                src={imgSrc}
                alt={cname || '케이크 이미지'}
                className="w-full h-48 object-cover"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE;
                }}
            />
            {isOnsale && ( // isOnsale이 true일 때만 표시
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold rounded-sm px-2 py-1 z-10">
                    SOLD OUT
                </div>
            )}

            <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{cname}</h3>
                <p className="text-gray-700 font-medium">{price.toLocaleString()}원</p>
            </div>
        </div>
    );
}

export default CakeCard;