import React from 'react';

const DEFAULT_IMAGE = '/cakeImage/default-cake.png'; // public 폴더에 있다고 가정

function CakeCard({ cake }) {
    if (!cake) return null;

    const { cname, price, thumbnailImageUrl } = cake;

    const imgSrc = `http://localhost${thumbnailImageUrl}`;

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