import React from 'react';
import LikeButton from '../../common/LikeButton';

const DEFAULT_IMAGE = '/cakeImage/default-cake.png';

function CakeCard({ cake,onClick }) {

    const {cakeId, cname, price, thumbnailImageUrl, isOnsale} = cake;
    const imgSrc = thumbnailImageUrl ? thumbnailImageUrl : DEFAULT_IMAGE;

    if (!cake) return null;


    // ⭐ 좋아요 버튼 클릭 핸들러 (이벤트 버블링 방지) ⭐
    const handleLikeButtonClick = (e) => {
        e.stopPropagation(); // ⭐ 이벤트 버블링 중지 ⭐
    };

    return (
        <div
            onClick={onClick}
            className="bg-white p-6 rounded-3xl interactive-card relative"> {/* ⭐ relative 클래스 추가 확인 ⭐ */}
            <img
                src={imgSrc}
                alt={cname || '케이크 이미지'}
                className="w-full h-64 object-cover"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE;
                }}
            />
            {isOnsale && ( // isOnsale이 true일 때만 표시
                <div
                    className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold rounded-sm px-2 py-1 z-10">
                    SOLD OUT
                </div>
            )}

            {/* ⭐ 좋아요 버튼 배치 ⭐ */}
            {/* 이미지를 기준으로 absolute 포지셔닝하여 오른쪽 상단에 배치 */}
            <div className="absolute top-2 right-2 z-20" onClick={handleLikeButtonClick}> {/* ⭐ onClick={handleLikeButtonClick} 적용 ⭐ */}
                {/* cakeId가 유효할 때만 LikeButton 렌더링 */}
                {cakeId && <LikeButton type="cake" itemId={cakeId}/>}
            </div>

            <div className="text-center p-2">
                <h3 className="text-lg font-semibold mb-1">{cname}</h3>
                <hr className="text-gray-200 mt-1"/>
                <p className="text-sm mt-1">{price.toLocaleString()}원</p>
                {/* 여기에 조회수 or 주문수 or 리뷰수 가 나올 예정*/}
            </div>
        </div>
    );
}

export default CakeCard;