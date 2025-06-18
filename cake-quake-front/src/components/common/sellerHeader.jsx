import { Link } from 'react-router';

export default function SellerHeader() {
    return (
        <header className="w-full border-b shadow-sm bg-white">

            {/* Submenu */}
            <nav>
                <ul className="flex justify-around text-sm text-gray-600 py-2">
                    <Link to="/cakes/list" className="hover:text-black cursor-pointer">
                        <li>
                            매장 관리<br /><span className="text-xs text-gray-400">Subheading</span>
                        </li>
                    </Link>
                    <div className="relative after:content-[''] after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-gray-400">
                    </div>
                    <li className="hover:text-black cursor-pointer">총 판매량<br /><span className="text-xs text-gray-400">Subheading</span></li>
                    <div className="relative after:content-[''] after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-gray-400">
                    </div>
                    <li className="hover:text-black cursor-pointer">가게 리뷰 수<br /><span className="text-xs text-gray-400">Subheading</span></li>
                    <div className="relative after:content-[''] after:absolute after:left-1/2 after:top-0 after:h-full after:w-px after:bg-gray-400">
                    </div>
                    <li className="hover:text-black cursor-pointer">거래 내역<br /><span className="text-xs text-gray-400">Subheading</span></li>
                </ul>
            </nav>
        </header>
    );
}