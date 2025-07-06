import React from 'react';
import { Phone, Mail } from 'lucide-react'; // lucide 아이콘 가져오기

const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-600 text-sm mt-10">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                {/* 고객센터 */}
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>고객센터: 02-1234-5678 (평일 10:00~18:00)</span>
                </div>

                {/* 공지사항 / 약관 */}
                <div className="text-center text-sm">
                    <span className="text-gray-600">공지사항</span>
                    <span className="mx-2 text-gray-400">|</span>
                    <span className=" text-gray-600">이용약관</span>
                    <span className="mx-2 text-gray-400">|</span>
                    <span className=" text-gray-600">개인정보처리방침</span>
                </div>

                {/* 이메일 */}
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>이메일 : cakequake@cakequake.com</span>
                </div>
            </div>

            {/* 하단 카피라이트 */}
            <div className="text-center py-4 text-xs text-gray-400">
                &copy; 2025 Cake Quake. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
