// src/components/review/BestReviewsCarousel.jsx
import React, { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ReviewCard from './ReviewCard';

export default function BestReviewsCarousel({ reviews, onCardClick }) {
    const containerRef = useRef(null);
    const VISIBLE = 3;

    const scroll = (dir = 1) => {
        const container = containerRef.current;
        if (!container) return;
        // 카드 하나의 너비 + gap
        const card = container.querySelector('.review-card');
        const gap = parseInt(getComputedStyle(container).columnGap, 10) || 16;
        const cardWidth = (card?.offsetWidth ?? 0) + gap;
        container.scrollBy({ left: cardWidth * VISIBLE * dir, behavior: 'smooth' });
    };

    return (
        <div className="relative">
            {/* 좌 화살표 */}
            <button
                onClick={() => scroll(-1)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
            </button>

            {/* 카드 컨테이너 */}
            <div
                ref={containerRef}
                className="flex overflow-hidden space-x-6 scroll-smooth scrollbar-hide"
                style={{ columnGap: '1.5rem' }}
            >
                {reviews.map(r => (
                    <div key={r.reviewId} className="flex-shrink-0 w-1/3 review-card">
                        <ReviewCard review={r} onClick={onCardClick} />
                    </div>
                ))}
            </div>

            {/* 우 화살표 */}
            <button
                onClick={() => scroll(1)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
                <ChevronRightIcon className="w-6 h-6 text-gray-600" />
            </button>
        </div>
    );
}
