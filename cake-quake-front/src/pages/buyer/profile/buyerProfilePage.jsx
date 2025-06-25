import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import BuyerProfile from '../../../components/member/buyer/buyerProfile.jsx'; // 새로 만든 컴포넌트 임포트


function MyPage() {
    // 실제 사용자 UID를 가져오는 로직 (예: 로그인 컨텍스트, API 등)
    const currentUserUid = 16;

    // 마이페이지의 다른 상태들...
    const [couponCount, setCouponCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);


    // 마이페이지 초기 로딩 시 다른 정보들을 가져오는 useEffect (예시)
    useEffect(() => {
        // 실제 API 호출로 대체하세요.
        // const fetchMyPageData = async () => {
        //     const coupons = await getCoupons(currentUserUid);
        //     setCouponCount(coupons.length);
        //     // ... 다른 데이터 로드
        // };
        // if (currentUserUid) {
        //     fetchMyPageData();
        // }

        // 임시 데이터
        setCouponCount(5);
        setReviewCount(7);
        setOrderCount(7);
    }, [currentUserUid]);



    return (
        <div className="container mx-auto p-4 sm:px-6 lg:px-8 max-w-4xl min-h-screen">

            {/* 1. 온도 표시 컴포넌트 사용 */}
            <BuyerProfile currentUserUid={currentUserUid} />

            {/* 2. 요약 정보 (쿠폰, 나의 리뷰, 전체 주문 내역) */}
            <section className="bg-white rounded-lg p-6 mb-6 border border-gray-300">
                <div className="flex justify-around text-center divide-x divide-gray-200">
                    <div className="flex-1 px-4">
                        <p className="text-lg font-semibold text-gray-700">쿠폰</p>
                        <p className="text-gray-400 ">{couponCount} <span className="text-gray-400">장</span></p>
                    </div>
                    <div className="flex-1 px-4">
                        <p className="text-lg font-semibold text-gray-700">나의 리뷰</p>
                        <p className="text-gray-400">{reviewCount}</p>
                    </div>
                    <div className="flex-1 px-4">
                        <Link to="/buyer/orders" className="block">
                            <p className="text-lg font-semibold text-gray-700">전체 주문 내역</p>
                            <p className="text-gray-400">{orderCount}</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. 기타 마이페이지 섹션 (예: 주문 내역 리스트 등) */}
            {/* 이 부분은 TemperaturePage의 HistoryList와 유사한 컴포넌트가 될 수 있습니다. */}
            <section className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">주문 내역</h3>
                <p className="text-gray-500 mb-6 text-sm">주문한 케이크들을 확인하세요.</p>
                {/* 여기에 실제 주문 내역을 렌더링하는 컴포넌트나 로직이 들어갑니다. */}
                <div className="text-center text-gray-500">주문 내역이 여기에 표시됩니다.</div>
            </section>
        </div>
    );
}
export default MyPage;