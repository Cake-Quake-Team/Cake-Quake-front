// components/common/Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-50 text-gray-600 text-sm mt-10"> {/* <-- Tailwind 클래스 사용 */}
            <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <h4 className="font-semibold mb-2">Use cases</h4>
                    <ul className="space-y-1">
                        <li>UI design</li>
                        <li>UX design</li>
                        <li>Prototyping</li>
                        <li>Collaboration</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Explore</h4>
                    <ul className="space-y-1">
                        <li>Design</li>
                        <li>Mockups</li>
                        <li>Illustrations</li>
                        <li>Icons</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Resources</h4>
                    <ul className="space-y-1">
                        <li>Blog</li>
                        <li>Help Center</li>
                        <li>Community</li>
                        <li>Resource library</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Company</h4>
                    <ul className="space-y-1">
                        <li>About us</li>
                        <li>Careers</li>
                        <li>Contact</li>
                        <li>Legal</li>
                    </ul>
                </div>
            </div>
            <div className="text-center py-4 text-xs text-gray-400">
                &copy; 2025 Cake Quake. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;