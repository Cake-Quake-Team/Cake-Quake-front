import React from 'react';
import { Link } from "react-router";
import { useAuth } from "../../../store/AuthContext.jsx";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const DEFAULT_IMAGE = '/cakeImage/default-cake.png';
const DEFAULT_SHOP_THUMBNAIL = '/shop_default_image.jpeg';

const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} before:text-[3rem] before:content-['>']`}
            style={{ ...style, display: "block", right: "25px", zIndex: 1 }}
            onClick={onClick}
        />
    );
};

const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} before:text-[3rem] before:content-['<']`}
            style={{ ...style, display: "block", left: "25px", zIndex: 1 }}
            onClick={onClick}
        />
    );
};

function CakeDetailComponent({
                                 cake,
                                 shop,
                                 optionTypes,
                                 selectedOptions,
                                 setSelectedOptions,
                                 OptionComponent,
                                 actionButtons,
                             }) {
    const { user } = useAuth();

    if (!cake || !cake.cakeDetailDTO) {
        return <div className="text-center py-8 text-gray-500">상품 정보가 없습니다.</div>;
    }

    const {
        shopId,
        cname,
        price,
        thumbnailImageUrl,
        description,
        imageUrls
    } = cake.cakeDetailDTO;

    const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;

    const thumbnailImgSrc = thumbnailImageUrl
        ? `${S3_BASE_URL}${thumbnailImageUrl}`
        : DEFAULT_IMAGE;

    const allImages = [
        { imageUrl: thumbnailImgSrc, isThumbnail: true },
        ...imageUrls
            .filter(imgObj => !imgObj.isThumbnail)
            .map(imgObj => ({
                ...imgObj,
                imageUrl: `${S3_BASE_URL}${imgObj.imageUrl}`
            }))
    ];

    const sliderSettings = {
        dots: allImages.length > 1,
        infinite: allImages.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: allImages.length > 1 ? <SampleNextArrow /> : null,
        prevArrow: allImages.length > 1 ? <SamplePrevArrow /> : null,
    };

    const currentShopName = shop?.shopName || '매장 정보 없음';
    const shopAddress = shop?.address || '주소 정보 없음';
    const shopThumbnail = shop?.responseDTO?.thumbnailUrl
        ? `${S3_BASE_URL}${shop.responseDTO.thumbnailUrl}`
        : DEFAULT_SHOP_THUMBNAIL;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* 왼쪽: 이미지 슬라이더 */}
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

                {/* 오른쪽: 정보 및 옵션 */}
                <div className="md:w-1/2 flex flex-col justify-between w-full max-w-lg">
                    <div>
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
                    {actionButtons}
                </div>
            </div>
            <hr className="mt-15" />

            {/* 매장 정보 */}
            <div>
                {user?.role === 'BUYER' && shop && (
                    <div className="p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <img
                                src={shopThumbnail}
                                alt={currentShopName}
                                className="w-12 h-12 rounded-full object-cover mr-4 border border-gray-300"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = DEFAULT_SHOP_THUMBNAIL;
                                }}
                            />
                            <div>
                                <Link to={`/buyer/shops/${shopId}`} className="text-lg font-semibold text-gray-900 hover:underline">
                                    {currentShopName}
                                </Link>
                                <p className="text-sm text-gray-600">{shopAddress}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Link
                                to={`/buyer/shops/${shopId}`}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                스토어 둘러보기
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            <hr />

            {/* 상품 설명 */}
            {description && (
                <div className="mb-6 text-gray-700 leading-relaxed mt-15 text-center">
                    <h3 className="text-xl font-semibold mb-2 mt-15">{cname}</h3>
                    <hr className="mt-6" />
                    <div className="mb-6 text-gray-700 leading-relaxed mt-15 text-center min-h-[100px] p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <p className="whitespace-pre-wrap mt-6">
                            {description ? description : <span className="text-gray-500">상품 설명이 없습니다 😅</span>}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CakeDetailComponent;
