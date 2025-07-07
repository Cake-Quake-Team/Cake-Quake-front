// src/components/common/BannerCarousel.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

export default function BannerCarousel({ banners, interval = 5000 }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const tid = setInterval(
            () => setCurrent(prev => (prev + 1) % banners.length),
            interval
        );
        return () => clearInterval(tid);
    }, [banners.length, interval]);

    const prevSlide = () =>
        setCurrent(prev => (prev - 1 + banners.length) % banners.length);
    const nextSlide = () =>
        setCurrent(prev => (prev + 1) % banners.length);

    return (
        <div className="relative w-full overflow-hidden mb-8">
            {/* 반응형 높이 지정 */}
            <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 relative">
                {banners.map((b, idx) => (
                    <a
                        key={idx}
                        href={b.link || '#'}
                        className={`
              absolute inset-0 transition-opacity duration-700
              ${idx === current ? 'opacity-100' : 'opacity-0'}
            `}
                    >
                        <img
                            src={b.imageUrl}
                            alt={b.alt || `banner-${idx}`}
                            className="w-full h-full object-cover"
                        />
                    </a>
                ))}

                {/* 좌/우 화살표 */}
                <div
                    onClick={prevSlide}
                    className="absolute inset-y-0 left-0 w-1/2 cursor-pointer flex items-center pl-4"
                >
                    <ChevronLeftIcon className="h-12 w-12 text-gray-200" />
                </div>
                <div
                    onClick={nextSlide}
                    className="absolute inset-y-0 right-0 w-1/2 cursor-pointer flex items-center justify-end pr-4"
                >
                    <ChevronRightIcon className="h-12 w-12 text-gray-200" />
                </div>
            </div>

            {/* 하단 네비게이션 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`
              h-1 w-8 transition-colors duration-300
              ${idx === current ? 'bg-white' : 'bg-white/50'}
            `}
                    />
                ))}
            </div>
        </div>
    );
}

BannerCarousel.propTypes = {
    banners: PropTypes.arrayOf(
        PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
            link:     PropTypes.string,
            alt:      PropTypes.string,
        })
    ).isRequired,
    interval: PropTypes.number,
};
