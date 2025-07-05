import React, { useState, useEffect } from 'react';
import {Link} from 'react-router';

// 이 컴포넌트에서 사용할 이미지 URL을 미리 정의합니다.
// 실제 이미지 파일로 교체해주세요.
const CAKE_IMAGE_1 = '/welcomeImages/1.png';
const CAKE_IMAGE_2 = '/welcomeImages/2.jpg';
const CAKE_IMAGE_3 = '/welcomeImages/3.jpg';
const CAKE_IMAGE_4 = '/welcomeImages/4.jpg';
const CAKE_IMAGE_5 = '/welcomeImages/5.jpg';

// 갤러리 이미지들을 배열로 묶어서 관리하면 편리합니다.
const galleryImages = [
    { src: CAKE_IMAGE_1, alt: '감성 케이크 1' },
    { src: CAKE_IMAGE_2, alt: '감성 케이크 2' },
    { src: CAKE_IMAGE_3, alt: '감성 케이크 3' },
    { src: CAKE_IMAGE_4, alt: '감성 케이크 4' },
    { src: CAKE_IMAGE_5, alt: '감성 케이크 5' }
];

function WelcomePage() {
    // 현재 표시할 이미지의 인덱스를 관리하는 state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 일정 시간마다 이미지 인덱스를 변경하는 useEffect
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
        }, 5000); // 5초마다 이미지 변경

        return () => clearInterval(intervalId);
    }, [galleryImages.length]);

    return (
        // [디자인 개선] 섹션 간 간격을 좁혀서 더 밀도 있고 세련된 레이아웃으로 변경
        <div className="welcome-container flex flex-col gap-16 md:gap-20 pt-8 pb-16 md:pt-4 md:pb-24 animate-fadeIn">
            <header className="w-full">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
                {/* Logo */}
                <div className="flex items-center gap-2 relative -mt-9">
                    <img src="/logo.png" alt="Cake Quake Logo" className="w-15 h-15"/>
                    <h1 className="text-2xl font-bold">Cake Quake</h1>
                </div>
                <div className="top-0 right-0 p-6 flex justify-end items-center space-x-4 z-30 relative -mt-9">
                    {/* 로그인 버튼 */}
                    <Link
                        to="/auth/signin"
                        className=" text-sm text-center px-3 py-2 hover:underline transition"
                    >
                        로그인
                    </Link>

                    {/* 회원가입 - 데스크탑 */}
                    <Link
                        to="/auth/signup"
                        className="text-sm text-center hover:underline transition hidden md:inline"
                    >
                        회원가입
                    </Link>
                </div>
            </div>
            </header>
            {/* 1. 브랜드 한 줄 슬로건 (Tagline) + 감성 이미지 */}
            <header className="flex flex-col items-center justify-center text-center gap-6 md:gap-8 w-full px-4 -mt-24">
                <div className="relative w-full h-[80vh] overflow-hidden shadow-soft mb-8">
                    {/* 모든 이미지를 absolute로 겹쳐서 배치 */}
                    {galleryImages.map((image, index) => (
                        <img
                            key={index}
                            src={image.src}
                            alt={image.alt}
                            className={`
                                absolute inset-0 w-full h-full object-cover
                                transition-opacity duration-1500 ease-in-out
                                ${index === currentImageIndex ? 'z-10 opacity-70' : 'z-0 opacity-0'}
                            `}
                            style={{ filter: 'blur(0.8px)' }}
                        />
                    ))}

                    {/* 이미지 위에 텍스트 오버레이는 그대로 유지 */}
                    <div className="absolute inset-0 flex items-center justify-center p-8 z-20">
                        <h1 className="text-4xl md:text-6xl font-heading text-white leading-tight drop-shadow-lg">
                            {'당신의 '.split(' ').map((word, index) => (
                                <span key={`p1-${index}`} className="inline-block animate-char-reveal"
                                      style={{
                                          animationDelay: `${index * 150}ms`,
                                          textShadow: '0 0 5px rgba(255,255,255,0.7), 0 0 15px rgba(0,0,0,0.7)'
                                      }}>
                                    {word}
                                    &nbsp;
                            </span>
                            ))}
                            <span className="font-bold">
                             {'특별한 날,'.split(' ').map((word, index) => (
                             <span key={`p2-${index}`} className="inline-block animate-char-reveal"
                                   style={{
                                       animationDelay: `${(3 + index) * 150}ms`,
                                       textShadow: '0 0 5px rgba(255,255,255,0.7), 0 0 15px rgba(0,0,0,0.7)'
                                   }}>
                                 {word}
                               &nbsp;
                            </span>
                            ))}
                            </span>
                            {'맞춤형 '.split(' ').map((word, index) => (
                                <span key={`p3-${index}`} className="inline-block animate-char-reveal"
                                      style={{
                                          animationDelay: `${(6 + index) * 150}ms`,
                                          textShadow: '0 0 5px rgba(255,255,255,0.7), 0 0 15px rgba(0,0,0,0.7)'
                                      }}>
                                    {word}
                                    &nbsp;
                                </span>
                            ))}
                            <span className="font-bold ">
                            {'케이크로'.split(' ').map((word, index) => (
                                <span key={`p4-${index}`} className="inline-block animate-char-reveal"
                                      style={{
                                          animationDelay: `${(9 + index) * 150}ms`,
                                          textShadow: '0 0 5px rgba(255,255,255,0.7), 0 0 15px rgba(0,0,0,0.7)'
                                      }}>
                                    {word}
                                    &nbsp;
                                    </span>
                             ))}
                            </span>
                            {'더 특별하게'.split(' ').map((word, index) => (
                                <span key={`p5-${index}`} className="inline-block animate-char-reveal"
                                      style={{
                                          animationDelay: `${(12 + index) * 150}ms`,
                                          textShadow: '0 0 5px rgba(255,255,255,0.7), 0 0 15px rgba(0,0,0,0.7)'
                                      }}>
                                    {word}
                                    &nbsp;
                                </span>
                            ))}
                        </h1>
                    </div>
                </div>
                <p className="text-xl md:text-2xl text-gray-700 font-semibold max-w-3xl">
                    CAKE QUAKE 는 감성 가득한 케이크로 소중한 순간을 빛나게 합니다.
                </p>
            </header>

            {/* 2. 서비스 핵심 가치 4가지 */}
            <section className="text-center px-4">
                <h2 className="text-3xl md:text-4xl font-heading mb-12 text-primary-color">
                    우리의 약속
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 max-w-7xl mx-auto"> {/* [디자인 개선] 간격을 미세 조정 */}
                    {/* 가치 1 */}
                    <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white transition-transform duration-300 hover:scale-105"> {/* [디자인 개선] card 대신 클래스를 직접 지정 */}
                        <span className="text-6xl mb-2">🎂</span>
                        <h3 className="text-2xl font-bold text-text-dark">세상에 단 하나뿐인 커스텀 케이크</h3>
                        <p className="text-gray-600">
                            당신이 원하는 디자인과 맛으로, 전문가가 직접 만든 맞춤형 케이크를 만나보세요.
                        </p>
                    </div>
                    {/* 가치 2 */}
                    <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white transition-transform duration-300 hover:scale-105">
                        <span className="text-6xl mb-2">🚚</span>
                        <h3 className="text-2xl font-bold text-text-dark">편리한 발주 시스템</h3>
                        <p className="text-gray-600 text-center">
                            직관적인 발주 인터페이스로 손쉽게 주문하고, 한눈에 관리하세요.
                        </p>
                    </div>

                    {/* 가치 3 */}
                    <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white transition-transform duration-300 hover:scale-105">
                        <span className="text-6xl mb-2">⭐</span>
                        <h3 className="text-2xl font-bold text-text-dark">실시간 리뷰 기반 신뢰도</h3>
                        <p className="text-gray-600">
                            실제 후기와 평점을 통해 검증된 판매자를 쉽게 찾고, 믿고 선택할 수 있습니다.
                        </p>
                    </div>
                    {/* 가치 4 */}
                    <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white transition-transform duration-300 hover:scale-105">
                        <span className="text-6xl mb-2">🧠</span>
                        <h3 className="text-2xl font-bold text-text-dark">AI로 추천하는 나만의 스타일</h3>
                        <p className="text-gray-600">
                            나만의 취향을 분석하여, 딱 맞는 케이크 스타일을 AI가 추천해 드립니다.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. 주요 기능 간단 소개 */}
            <section className="bg-surface py-20 px-8">
                <h2 className="text-3xl md:text-4xl font-heading text-center mb-16 text-primary-color">
                    CAKE QUAKE, 이렇게 이용하세요
                </h2>
                <div className="flex flex-col md:flex-row gap-16 max-w-7xl mx-auto">
                    {/* 구매자 기능 */}
                    <div className="flex-1">
                        <h3 className="text-3xl font-heading text-secondary-color mb-8 border-b border-gray-700  pb-4">
                            🛒 구매자에게
                        </h3>
                        <ul className="space-y-6 text-lg text-gray-700">
                            <li className="flex items-center gap-3">
                                <span className="text-secondary-color text-2xl font-bold">✓</span>
                                <span>나만의 커스텀 케이크를 간편하게 주문</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-secondary-color text-2xl font-bold">✓</span>
                                <span>AI 추천으로 취향 저격 케이크 발견</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-secondary-color text-2xl font-bold">✓</span>
                                <span>수많은 후기 기반으로 신뢰할 수 있는 선택</span>
                            </li>
                        </ul>
                    </div>
                    {/* 판매자 기능 */}
                    <div className="flex-1">
                        <h3 className="text-3xl font-heading text-primary-color mb-8 border-b border-gray-700 pb-4">
                            👩‍🍳 판매자에게
                        </h3>
                        <ul className="space-y-6 text-lg text-gray-700">
                            <li className="flex items-center gap-3">
                                <span className="text-primary-color text-2xl font-bold">✓</span>
                                <span>나만의 판매자 페이지로 작품 홍보</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-primary-color text-2xl font-bold">✓</span>
                                <span>통합 고객 관리 및 주문 지원 시스템</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-primary-color text-2xl font-bold">✓</span>
                                <span>새로운 고객에게 노출될 기회 확대</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 6. 시작 유도 CTA */}
            <section className="text-center px-4">
                {/* [수정] 제목과 버튼 그룹이 항상 세로로 나열되도록 `md:flex-row` 클래스 제거 */}
                <div className="flex flex-col items-center gap-10 bg-accent rounded-3xl p-12 md:p-20 shadow-bouncy max-w-5xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-dark leading-snug">
                        나만의 특별한 케이크를 <br className="md:hidden"/> 지금 바로 만나보세요!
                    </h2>
                    {/* [수정] 버튼들의 가로 정렬은 유지하되, 전체 너비를 조절 */}
                    <div className="flex flex-row flex-wrap justify-center gap-6">
                        <Link to="auth/signin"
                         className="btn-primary w-full sm:w-auto text-lg md:text-xl px-12 py-5 animate-button-grow">
                            케이크 보러가기 →
                        </Link>
                    </div>
                </div>
            </section>

            {/* 7. 브랜드 네이밍의 의미 (선택적) */}
            <section className="text-center px-4 max-w-3xl mx-auto text-gray-500 mt-12">
                <p className="text-sm">
                    ✨ **Cake Quake**는 '감동이 전해지는 순간의 진동'을 의미합니다.
                </p>
            </section>
        </div>
    );
}

export default WelcomePage;