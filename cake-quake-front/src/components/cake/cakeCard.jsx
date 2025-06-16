import React from 'react';

const DEFAULT_IMAGE = '/cakeImage/default-cake.png';

function CakeCard({ cake }) {

    const { cname, price, thumbnailImageUrl } = cake;
    const imgSrc = thumbnailImageUrl ? thumbnailImageUrl : DEFAULT_IMAGE;

    if (!cake) return null;

    return (
        <div className="border rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden">
            <img
                src={imgSrc}
                alt={cname || '케이크 이미지'}
                className="w-full h-48 object-cover"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE;
                }}
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{cname}</h3>
                <p className="text-gray-700 font-medium">{price.toLocaleString()}원</p>
            </div>
        </div>
    );
}

export default CakeCard;