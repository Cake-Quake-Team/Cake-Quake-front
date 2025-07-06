import React, {useState} from 'react';
import { MapPin, Clock, Phone, Star, Heart, Share2 ,ArrowLeft,Pencil} from 'lucide-react';
import {Navigate, useNavigate} from "react-router";
import MapModal from "./mapModal.jsx";
import LikeButton from '../../../components/common/LikeButton';
import {useAuth} from "../../../store/AuthContext.jsx";
import jwtAxios from "../../../utils/jwtUtil.js";
import useWebSocket from "../../../hooks/useWebSocket.jsx";
import * as user from "@babel/types";



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

const ShopDetailSection=({shop})=>{
    const numericRating =parseFloat(shop.rating);
    const {user,accessToken}=useAuth();
    const navigate =useNavigate();
    const [showMap, setShowMap] = useState(false);

    // ⭐ 현재 사용자 및 토큰 정보 로그
    console.log("[ShopDetailSection] Current user:", user);
    console.log("[ShopDetailSection] Access Token:", accessToken ? accessToken.substring(0, 10) + '...' : 'No Token'); // 토큰 전체 대신 일부만 출력

    const handleChatWithShop = async () => {
        console.log("[ShopDetailSection] '채팅하기' 버튼 클릭됨");

        // 1. 로그인 여부 확인
        if (!user || !user.uid || !accessToken) {
            console.warn("[ShopDetailSection] 로그인 필요: 사용자 정보 또는 토큰 없음");
            alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
            navigate('/auth/signin');
            return;
        }

        if (user.uid === shop.uid) {
            alert('자신의 가게와 채팅할 수 없습니다.');
            return;
        }

        try {
            const response = await jwtAxios.post('/api/v1/chatting/rooms', {
                sellerUid: shop.uid,
                buyerUid: user.uid,
                shopId: shop.shopId
            });
            const roomKey = response.data.roomKey;  // ✅ roomKey로 정확히 꺼내기
            navigate(`/shops/chatting/${roomKey}`);
        } catch (err) {
            console.error('채팅방 생성 실패:', err);
            alert('채팅방을 생성할 수 없습니다.');
        }
    };



    return (
        <div className="relative text-center mb-8 p-4 sm:p-6 bg-white rounded-lg border border-gray-200 max-w-xl mx-auto w-full">
            {/* Shop Profile Image */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden mx-auto mb-5 border-2 border-blue-200 transition-transform duration-300 hover:scale-105">
                <img
                    src={shop.thumbnailUrl ? `http://localhost/${shop.thumbnailUrl}` : '/shop_default_image.jpeg'}
                    alt={shop.shopName}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Shop Name */}
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 tracking-tight leading-tight">
                {shop.shopName}
            </h2>

            {/* Star Rating */}
            <div className="mb-4 flex justify-center items-center text-base sm:text-lg">
                <div className="flex mr-2">
                    {renderStars(numericRating)}
                </div>
                <span className="font-semibold text-gray-800">
                    ({numericRating.toFixed(1)})
                </span>
            </div>

            {/* Shop Information */}
            <div className="space-y-2 mb-5 text-gray-700 text-sm sm:text-base">
                <p
                    className="flex items-center justify-center cursor-pointer hover:text-blue-600 transition-colors duration-200 group"
                    onClick={() => setShowMap(true)}
                >
                    <MapPin className="mr-2 text-blue-500 w-4 h-4 sm:w-5 sm:h-5 group-hover:text-blue-600 transition-colors" />
                    <span>{shop.address}</span>
                </p>

                <p className="flex items-center justify-center">
                    <Clock className="mr-2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{shop.openTime} ~ {shop.closeTime} {shop.closeDays ? `(${shop.closeDays} 휴무)` : '(연중무휴)'}</span>
                </p>

                <p className="flex items-center justify-center">
                    <Phone className="mr-2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{shop.phone}</span>
                </p>
            </div>

            {showMap && (
                <MapModal
                    address={shop.address}
                    onClose={() => setShowMap(false)}
                />
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 pt-5 border-t border-gray-100">
                <LikeButton type="shop" itemId={shop.shopId} />

                <button
                    onClick={() => alert('공유하기 기능은 준비 중입니다!')}
                    className="flex items-center justify-center px-4 py-2 text-base font-medium rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full sm:w-auto"
                >
                    <Share2 className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> 공유하기
                </button>

                <button
                    onClick={handleChatWithShop}
                    className="flex items-center justify-center px-4 py-2 text-base font-medium rounded-md bg-green-500 hover:bg-green-600 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 w-full sm:w-auto"
                >
                    채팅하기
                </button>
            </div>

            {/* External Links */}
            {(shop.websiteUrl || shop.instagramUrl) && (
                <div className="mt-6 pt-4 border-t border-gray-100 text-xs sm:text-sm space-y-1">
                    {shop.websiteUrl && (
                        <p>
                            <a
                                href={shop.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200 flex items-center justify-center"
                            >
                                <span className="mr-1">🔗</span> 웹사이트 바로가기
                            </a>
                        </p>
                    )}
                    {shop.instagramUrl && (
                        <p>
                            <a
                                href={shop.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200 flex items-center justify-center"
                            >
                                <span className="mr-1">📸</span> 인스타그램 바로가기
                            </a>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};
export default ShopDetailSection;