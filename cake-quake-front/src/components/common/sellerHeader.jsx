import {Link, useParams, useLocation} from 'react-router';

export default function SellerHeader() {

    const { shopId } = useParams();
    const location = useLocation();

    const currentPath = location.pathname;

    return (
        <header className="w-full border-b shadow-sm bg-white">
            <nav>
                <ul className="flex justify-around text-sm text-gray-600 py-2">

                    {/* 매장 관리 */}
                    <Link to={`/shops/${shopId}`}>
                        <li className={`${currentPath === `/shops/${shopId}` ? 'text-black font-semibold' : 'hover:text-black'} cursor-pointer`}>
                            매장 관리<br /><span className="text-xs text-gray-400">Subheading</span>
                        </li>
                    </Link>
                    <div className="relative after:content-[''] after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-gray-400" />

                    {/* 총 판매량 */}
                    <Link to={`/shops/${shopId}/sales`}>
                        <li className={`${currentPath === `/shops/${shopId}/sales` ? 'text-black font-semibold' : 'hover:text-black'} cursor-pointer`}>
                            총 판매량<br /><span className="text-xs text-gray-400">Subheading</span>
                        </li>
                    </Link>
                    <div className="relative after:content-[''] after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-gray-400" />

                    {/* 가게 리뷰 수 */}
                    <Link to={`/shops/${shopId}/reviews`}>
                        <li className={`${currentPath === `/shops/${shopId}/reviews` ? 'text-black font-semibold' : 'hover:text-black'} cursor-pointer`}>
                            가게 리뷰 수<br /><span className="text-xs text-gray-400">Subheading</span>
                        </li>
                    </Link>
                    <div className="relative after:content-[''] after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-gray-400" />

                    {/* 거래 내역 */}
                    <Link to={`/shops/${shopId}/orders`}> {/* 이제 /shops/{shopId}/orders로 이동 */}
                        <li className={`${currentPath === `/shops/${shopId}/orders` ? 'text-black font-semibold' : 'hover:text-black'} cursor-pointer`}>
                            거래 내역<br /><span className="text-xs text-gray-400">Subheading</span>
                        </li>
                    </Link>

                </ul>
            </nav>
        </header>
    );
}