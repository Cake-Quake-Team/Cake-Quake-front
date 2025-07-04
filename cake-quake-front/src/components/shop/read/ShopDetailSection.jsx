import React, {useState} from 'react';
import { MapPin, Clock, Phone, Star, Heart, Share2 ,ArrowLeft,Pencil} from 'lucide-react';
import {Navigate, useNavigate} from "react-router";
import MapModal from "./mapModal.jsx";
import LikeButton from '../../../components/common/LikeButton';
import {useAuth} from "../../../store/AuthContext.jsx";
import jwtAxios from "../../../utils/jwtUtil.js";



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

    // ✨ 채팅하기 버튼 클릭 핸들러
    const handleChatWithShop = async () => {
        console.log("[ShopDetailSection] '채팅하기' 버튼 클릭됨");

        // 1. 로그인 여부 확인
        if (!user || !user.uid || !accessToken) {
            console.warn("[ShopDetailSection] 로그인 필요: 사용자 정보 또는 토큰 없음");
            alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
            navigate('/auth/signin');
            return;
        }
        console.log("[ShopDetailSection] 사용자 로그인 확인됨. UID:", user.uid);


        // 2. 자신과 채팅하는 것을 방지
        // shop.uid는 ShopDetailResponseDTO에서 판매자(가게 주인)의 UID라고 가정합니다.
        if (user.uid === shop.uid) {
            console.warn("[ShopDetailSection] 자신과 채팅 시도: user.uid", user.uid, "shop.uid", shop.uid);
            alert('자신의 가게와 채팅할 수 없습니다. (판매자 본인)');
            return;
        }
        console.log("[ShopDetailSection] 판매자 UID:", shop.uid, "구매자 UID:", user.uid);


        // 3. 백엔드에 채팅방 생성/조회 요청
        const requestBody = {
            sellerUid: shop.uid,   // 가게 주인의 UID
            buyerUid: user.uid,    // 현재 로그인된 사용자(구매자)의 UID
        };
        console.log("[ShopDetailSection] 채팅방 생성 요청 본문:", requestBody);


        try {
            console.log("[ShopDetailSection] POST /api/v1/chatting/rooms 요청 시작...");
            // ✨ 수정: API 엔드포인트와 응답 데이터 추출 방식 변경
            const response = await jwtAxios.post('/api/v1/chatting/rooms', requestBody);

            console.log("[ShopDetailSection] API 응답 수신:", response);
            console.log("[ShopDetailSection] 응답 데이터:", response.data);

            const roomId = response.data.data; // ApiResponseDTO<Long>의 data 필드에서 roomId 추출
            console.log("[ShopDetailSection] 추출된 Room ID:", roomId);

            // 4. 채팅 페이지로 이동
            if (roomId) {
                console.log(`[ShopDetailSection] 채팅 페이지로 이동: /shops/chatting/${roomId}`);
                navigate(`/shops/chatting/${roomId}`);
            } else {
                console.error("[ShopDetailSection] Room ID가 응답에 없습니다. 응답:", response.data);
                alert("채팅방 ID를 가져오지 못했습니다. 다시 시도해주세요.");
            }

        } catch (err) {
            console.error('[ShopDetailSection] 채팅방 생성/조회 중 오류 발생:', err);

            // 서버 응답 오류가 있는 경우
            if (err.response) {
                console.error("[ShopDetailSection] 서버 응답 오류 상태:", err.response.status);
                console.error("[ShopDetailSection] 서버 응답 데이터 (err.response.data):", err.response.data);
                console.error("[ShopDetailSection] 서버 응답 헤더:", err.response.headers);
                alert(`채팅방을 시작할 수 없습니다: ${err.response?.data?.message || `서버 오류 (${err.response.status})`}`);
            }
            // 요청이 전송되었으나 응답을 받지 못한 경우
            else if (err.request) {
                console.error("[ShopDetailSection] 요청 전송 후 응답 없음 (err.request):", err.request);
                alert("채팅방을 시작할 수 없습니다: 서버로부터 응답이 없습니다.");
            }
            // 그 외 오류
            else {
                console.error("[ShopDetailSection] 요청 설정 중 오류 (err.message):", err.message);
                alert(`채팅방을 시작할 수 없습니다: ${err.message}`);
            }
        }
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
            {/*액션 버튼*/}
            <div className="flex justify-center gap-6 mt-6 border-t pt-6 border-gray-100">
                <LikeButton type="shop" itemId={shop.shopId} />
                <button className="flex items-center text-gray-700 hover:text-blue-500 transition-colors duration-200 text-lg font-medium px-4 py-2 rounded-lg bg-gray-50 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50">
                    <Share2 className="mr-2 w-6 h-6" /> 공유하기
                </button>
                {/* ✨ 채팅하기 버튼 추가 */}
                <button
                    onClick={handleChatWithShop}
                    className="flex items-center text-white bg-green-500 hover:bg-green-600 transition-colors duration-200 text-lg font-medium px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
                >채팅하기
                </button>
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