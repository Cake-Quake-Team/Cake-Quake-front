import { Link, useParams, useLocation } from 'react-router';
import { useEffect, useRef, useState } from 'react';

export default function SellerHeader() {
    const { shopId } = useParams();
    const location = useLocation();
    const currentPath = location.pathname;

    const menus = [
        { label: '매장 관리', path: `/shops/${shopId}`, sub: 'Store Management' },
        { label: '총 판매량', path: `/shops/${shopId}/sales`, sub: 'Total Sales'},
        { label: '가게 리뷰 수', path: `/shops/${shopId}/reviews`, sub: 'Store Reviews' },
        { label: '거래 내역', path: `/shops/${shopId}/orders` , sub: 'Order History' },
    ];

    const containerRef = useRef(null);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const links = container.querySelectorAll('[data-path]');
        links.forEach((link) => {
            if (link.dataset.path === currentPath) {
                const rect = link.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                setUnderlineStyle({
                    left: rect.left - containerRect.left + (rect.width * 0.35),
                    width: rect.width * 0.3,
                });
            }
        });
    }, [currentPath]);

    return (
        <header className="w-full border-b shadow-sm bg-white">
            <nav>
                <ul
                    ref={containerRef}
                    className="relative flex justify-between text-sm text-gray-600 py-4"
                >
                    {/* 밑줄 */}
                    <span
                        className="absolute bottom-2 h-[1.5px] bg-black transition-all duration-300 ease-in-out"
                        style={{ left: underlineStyle.left, width: underlineStyle.width }}
                    />

                    {menus.map((menu, index) => (
                        <li
                            key={menu.path}
                            data-path={menu.path}
                            className={`flex-1 text-center relative cursor-pointer px-2 ${
                                currentPath === menu.path
                                    ? 'text-black font-semibold'
                                    : 'hover:text-black'
                            }`}
                        >
                            <Link to={menu.path}>
                                <div>{menu.label}</div>
                                <div className="text-xs text-gray-400">{menu.sub}</div>
                            </Link>

                            {/* 세로선: 마지막은 제외 */}
                            {index < menus.length - 1 && (
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 h-6 w-px bg-gray-300" />
                            )}
                        </li>

                    ))}

                </ul>
            </nav>
        </header>
    );
}
