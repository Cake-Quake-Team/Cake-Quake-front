// components/common/Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-600 text-sm mt-10"> {/* <-- Tailwind 클래스 사용 */}
            <div className="text-center py-4">
                문의사항
            </div>
            <div className="text-center py-4 text-xs text-gray-400">
                &copy; 2025 Cake Quake. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;