import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import BuyerProfile from '../../../components/member/buyer/buyerProfile.jsx';
import {getMyReviewList} from "../../../api/reviewApi.jsx";
import {useNavigate} from "react-router";
import {getPointBalance} from "../../../api/pointApi.jsx"; // 새로 만든 컴포넌트 임포트



function MyPage() {
    // 실제 사용자 UID를 가져오는 로직 (예: 로그인 컨텍스트, API 등)
    const currentUserUid = 11;

    const navigate = useNavigate();

    // 마이페이지의 다른 상태들...
    const [couponCount, setCouponCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [pointBalance, setPointBalance] = useState(0);


    // (1) 쿠폰·주문 개수 더미 초기화
    useEffect(() => {
        setCouponCount(5);
        setOrderCount(7);
    }, [currentUserUid]);

    // 리뷰 개수 조회
    useEffect(() => {
        async function fetchReviewCount() {
            try {
                // size:1 로 요청해도 totalCount에 전체 개수가 담겨옵니다.
                const payload = await getMyReviewList({ page: 1, size: 1 });
                setReviewCount(payload.totalCount ?? 0);
            } catch (e) {
                console.error('리뷰 수 조회 실패', e);
            }
        }
        fetchReviewCount();
    }, []);


    // 포인트 잔액 조회
    useEffect(() => {
        async function fetchPoint() {
            try {
                const bal = await getPointBalance();
                setPointBalance(bal);
            } catch (e) {
                console.error('포인트 잔액 조회 실패', e);
            }
        }
        fetchPoint();
    }, []);

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
                    <div
                        className="flex-1 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => navigate('/buyer/reviews')}
                    >
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

            {/* 3. 포인트 별도 섹션 */}
            <section
                className="bg-white rounded-lg p-6 mb-6 border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate('/buyer/profile/points')}
            >
                <p className="text-lg font-semibold text-gray-700 text-center mb-2">포인트</p>
                <p className="text-2xl font-bold text-orange-500 text-center">{pointBalance}P</p>
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