// src/components/cake/RecommendedCakes.jsx (예시)
import React from 'react';
import { Link } from 'react-router'; // Link 임포트
import CakeCard from '../cake//itemComponents/cakeCard.jsx'; // 수정된 CakeCard 임포트

function RecommendedCakes({ recommendedCakes }) { // recommendedCakes는 케이크 목록이라고 가정
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedCakes.map(cake => (
                // 각 CakeCard를 Link 컴포넌트로 감쌉니다.
                // 이제 CakeCard의 어떤 부분을 클릭해도 이 Link가 작동하여 상세 페이지로 이동합니다.
                <Link key={cake.cakeId} to={`/cakes/${cake.cakeId}`} className="block">
                    <CakeCard cake={cake} />
                </Link>
            ))}
        </div>
    );
}

export default RecommendedCakes;