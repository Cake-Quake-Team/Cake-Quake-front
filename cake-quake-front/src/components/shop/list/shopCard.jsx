import React from 'react';

const DEFAULT_IMAGE='/shop_default_image.jpeg';



const ShopCard = ({ shop }) => {

    const {shopName, address,thumbnailUrl,rating} =shop;
    console.log("받아온 thumbnailImageUrl:", thumbnailUrl);


    const imgSrc = thumbnailUrl ? thumbnailUrl : DEFAULT_IMAGE;

    const numericRating = parseFloat(rating);

    // 별을 렌더링하는 함수
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating); // 정수 부분 (꽉 찬 별)
        const halfStar = rating % 1 !== 0 && rating %1>=0.5; // 소수점이 있으면 반 별
        const emptyStars = 5 - Math.ceil(rating); // 빈 별 (총 5개에서 채워진 별 뺀 나머지)

        let stars = [];

        // 꽉 찬 별 추가
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={`full-${i}`} style={{ color: 'gold' }}>★</span>); // 꽉 찬 별 이모지
        }

        // 반 별 추가 (소수점이 있는 경우)
        if (halfStar) {
            stars.push(<span key="half" style={{ color: 'gold' }}>★</span>); // 반 별 또는 다른 이모지 사용 가능
        }

        // 빈 별 추가
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`}>☆</span>); // 빈 별 이모지 (혹은 원하는 다른 이모지)
        }

        return stars;
    };

    return (
        <div className="bg-white p-6 rounded-3xl interactive-card">
        <div className="relative w-full h-48 overflow-hidden">
                <img
                    src={`http://localhost/${imgSrc}`}
                    alt={shopName}
                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMAGE;
                    }}
                />
            </div>

            <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1 leading-tight">
                        {shopName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 truncate" title={address}>
                        {address}
                    </p>
                </div>

                <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
                    {renderStars(numericRating)}{' '}
                    <span className="text-sm text-gray-700 ml-2 font-medium">
                        ({numericRating.toFixed(1)})
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ShopCard;

//가게 1개 출력