import React from 'react';
import { Link } from "react-router";
import { Store } from "lucide-react";
import { useAuth } from "../../../store/AuthContext.jsx";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const DEFAULT_IMAGE = '/cakeImage/default-cake.png';

const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} before:text-[3rem] before:content-['>']`} // before:text-[3rem]로 크기 키움
            style={{ ...style, display: "block", right: "25px", zIndex: 1 }}
            onClick={onClick}
        />
    );
};

const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} before:text-[3rem] before:content-['<']`} // before:text-[3rem]로 크기 키움
            style={{ ...style, display: "block", left: "25px", zIndex: 1 }}
            onClick={onClick}
        />
    );
};


function CakeDetailComponent({ cake, optionTypes, selectedOptions, setSelectedOptions, OptionComponent }) {

    const { user } = useAuth();

    if (!cake || !cake.cakeDetailDTO) {
        return <div className="text-center py-8 text-gray-500">상품 정보가 없습니다.</div>;
    }

    const {
        shopId,
        shopName,
        cname,
        price,
        thumbnailImageUrl,
        description,
        imageUrls
    } = cake.cakeDetailDTO;

    const thumbnailImgSrc = thumbnailImageUrl ? thumbnailImageUrl : DEFAULT_IMAGE;

    // 모든 이미지 URL을 배열로 합칩니다.
    const allImages = [
        { imageUrl: thumbnailImgSrc, isThumbnail: true },
        ...imageUrls.filter(imgObj => !imgObj.isThumbnail)
    ];

    // 슬라이더 설정
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
        // customPaging 속성을 제거했습니다.
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* 왼쪽: 상품 이미지 슬라이더 영역 */}
                <div className="md:w-1/2 flex flex-col items-center flex-shrink-0">
                    <div className="w-full max-w-lg">
                        <Slider {...sliderSettings}>
                            {allImages.map((imageObject, index) => (
                                <div key={index}>
                                    <img
                                        src={imageObject.imageUrl}
                                        alt={`${cname || '상품 이미지'} ${index + 1}`}
                                        className="w-full h-[500px] object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = DEFAULT_IMAGE;
                                        }}
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                {/* 오른쪽: 상품 정보 및 옵션 영역 */}
                <div className="md:w-1/2 flex flex-col justify-between">
                    <div>
                        {user?.role === 'BUYER' && (
                            <Link className="text-sm font-bold flex items-center text-gray-900 mb-2 underline hover:text-gray-400"
                                  to={`/buyer/shops/${shopId}`}>
                                <Store className="mt-0.6 w-4 h-4 cursor-pointer mr-2" />{shopName}
                            </Link>
                        )}
                        <h2 className="mt-3 text-2xl font-bold text-gray-900 mb-2">{cname}</h2>
                        <p className="text-2xl text-gray-900 mb-6">{price.toLocaleString()}원</p>

                        {OptionComponent && (
                            <OptionComponent
                                optionTypes={optionTypes}
                                selectedOptions={selectedOptions}
                                setSelectedOptions={setSelectedOptions}
                            />
                        )}
                    </div>
                </div>
            </div>
            <hr className="mt-15"/>

            {/* 상품 설명 */}
            {description && (
                <div className="mb-6 text-gray-700 leading-relaxed mt-15 text-center">
                    <h3 className="text-xl font-semibold mb-2 mt-15">{cname}</h3>
                    <hr className="mt-6"/>
                    <p className="whitespace-pre-wrap mt-15">{description}</p>
                </div>
            )}
        </div>
    );
}

export default CakeDetailComponent;