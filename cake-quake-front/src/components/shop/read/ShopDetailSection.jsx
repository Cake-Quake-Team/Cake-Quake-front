import React, {useState} from 'react';
import { MapPin, Clock, Phone, Star, Heart, Share2 ,ArrowLeft,Pencil} from 'lucide-react';
import {Navigate, useNavigate} from "react-router";
import MapModal from "./mapModal.jsx";
import {useAuth} from "../../../store/AuthContext.jsx";

import ShopLikeButton from '../../../components/shop/ShopLikeButton.jsx';

//평점 별 채우기
const renderStars=(rating)=> {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 !== 0 && rating % 1 >= 0.5;

    const emptyStars = 5 - Math.ceil(rating);
    let stars = [];
    for (let i = 0; i < fullStars; i++) {
        stars.push(<Star key={`full-${i}`} className="text-yellow-300 fill-current w-5 h-5"/>)
    }
    if (halfStars) {
        stars.push(<Star key="half" className="text-yellow-300 opacity-75 fill-current w-5 h-5"/>);
    }
    for (let i =0;i<emptyStars;i++){
        stars.push(<Star key={`empty-${i}`} className="text-gray-300 w-5 h-5"/>)
    }
    return stars;

};

const ShopDetailSection = ({ shop }) => {
    const numericRating = parseFloat(shop.rating);
    const navigate = useNavigate();
    const { user } = useAuth();

    const [showMap, setShowMap] = useState(false);

    //매장 수정
    const handleEditShop = () => {
        navigate(`/shops/update/${shop.shopId}`);
    };

    return(

        <div className="relative text-center mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            {/* 프로필 이미지 (원형) */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mx-auto mb-5 border-4 border-blue-200 shadow-xl">
                <img
                    src={shop.thumbnailUrl ? `http://localhost/${shop.thumbnailUrl}` : '/shop_default_image.jpeg'}
                    alt={shop.shopName}
                    className="w-full h-full object-cover"
                />
            </div>
            {/*매장이름*/}
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{shop.shopName}</h2>
            {/*별점*/}
            <div className="mb-4 text-xl flex justify-center items-center">
                <div className="flex mr-2">
                    {renderStars(numericRating)}
                </div>
                <span className="font-semibold text-gray-800">({numericRating.toFixed(1)})</span>
                {/*리뷰 합계*/}
                {/*<span className="ml-2 text-gray-600 text-base">리뷰 {shop.reviewCount}개</span>*/}
            </div>
            {/*기본 정보*/}
            <p
                className="text-lg text-gray-700 mb-1 flex items-center justify-center cursor-pointer hover:text-blue-500"
                onClick={() =>{
                    setShowMap(true);} }
            >
                <MapPin className="mr-2 text-gray-500 w-5 h-5" />
                <span>{shop.address}</span>
            </p>

            {showMap && (
                <MapModal
                    address={shop.address}
                    onClose={() => setShowMap(false)}
                />
            )}
            <p className="text-lg text-gray-700 mb-1 flex items-center justify-center">
                <Clock className="mr-2 text-gray-500 w-5 h-5" />
                <span>{shop.openTime} ~ {shop.closeTime} {shop.closeDays ? `(${shop.closeDays} 휴무)` : '(연중무휴)'}</span>
            </p>
            <p className="text-lg text-gray-700 mb-4 flex items-center justify-center">
                <Phone className="mr-2 text-gray-500 w-5 h-5" />
                <span>{shop.phone}</span>
            </p>

            <div className="flex justify-center gap-6 mt-6 border-t pt-6 border-gray-100">
                {shop?.shopId && <ShopLikeButton shopId={shop.shopId} />}

                <button className="flex items-center text-gray-700 hover:text-blue-500 transition-colors duration-200 text-lg font-medium px-4 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50">
                    <Share2 className="mr-2 w-6 h-6" /> 공유하기
                </button>

                {user?.role === "SELLER" && user.uid === shop.uid && (
                        <button
                            onClick={handleEditShop}
                            className="flex items-center text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 text-lg font-medium px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                        >
                            <Pencil className="mr-2 w-6 h-6" /> 매장 수정
                        </button>
                )}



            </div>

            {/*추가 URL 정보*/}
            {(shop.websiteUrl || shop.instagramUrl) && (
                <div className="mt-4 text-sm text-gray-600">
                    {shop.websiteUrl && (
                        <p className="mb-1">
                            <a href={shop.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline hover:text-blue-700 transition-colors">
                                웹사이트 바로가기
                            </a>
                        </p>
                    )}
                    {shop.instagramUrl && (
                        <p>
                            <a href={shop.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline hover:text-purple-700 transition-colors">
                                인스타그램 바로가기
                            </a>
                        </p>
                    )}

                </div>
            )}

        </div>
    );
};

export default ShopDetailSection;