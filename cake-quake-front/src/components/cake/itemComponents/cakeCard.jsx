import React from 'react';

const DEFAULT_IMAGE = '/cakeImage/default-cake.png';
const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;


function CakeCard({ cake,onClick }) {

    const {cname, price, thumbnailImageUrl, isOnsale} = cake;
    const imgSrc = thumbnailImageUrl
        ? `${S3_BASE_URL}${thumbnailImageUrl}`
        : DEFAULT_IMAGE;

    if (!cake) return null;



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