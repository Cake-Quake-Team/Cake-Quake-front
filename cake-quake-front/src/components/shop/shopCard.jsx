import React from 'react';

const ShopCard = ({ shop }) => {
    const numericRating = parseFloat(shop.rating);

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
        <div style={{ border: '1px solid #ccc', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
            {shop.thumbnailUrl ? ( // thumbnailUrl이 있다면 실제 이미지 표시
                <img
                    src={shop.thumbnailUrl}
                    alt={shop.shopName}
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
                />
            ) : ( // 없다면 기본 이미지 표시
                <img
                    src="/shop_default_image.jpeg"
                    alt="기본 매장 이미지"
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }}
                />
            )}
            <h3>{shop.shopName}</h3>
            <p>{shop.address}</p>
            <p>
                {renderStars(numericRating)}{' '}
                ({numericRating.toFixed(1)})
            </p>

        </div>
    );
};

export default ShopCard;

//가게 1개 출력