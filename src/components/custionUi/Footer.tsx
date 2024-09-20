"use client"
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#1a164b] text-white pt-10 m-0">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* SplitGo */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">SplitGo</h4>
                    <ul>
                        <li className="mb-2">
                            <a href="#" className="hover:text-gray-300">About us</a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="hover:text-gray-300">Help</a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="hover:text-gray-300">Blog</a>
                        </li>
                    </ul>
                </div>

                {/* Support Section */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Support</h4>
                    <ul>
                        <li className="mb-2">
                            <a href="#" className="hover:text-gray-300">Contact Us</a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="hover:text-gray-300">Help Center</a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
                        </li>
                    </ul>
                </div>

                {/* Follow Us Section */}
                <div>
                    <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-gray-300">🌐</a>
                        <a href="#" className="hover:text-gray-300">📘</a>
                        <a href="#" className="hover:text-gray-300">🐦</a>
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-4 pb-4 text-center">
                <p>© 2024 SplitGO. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
