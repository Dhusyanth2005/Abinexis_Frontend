import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#52B69A] to-[#34A0A4] bg-clip-text text-transparent mb-4">
                Abinexis
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Smart, fast, global dropshipping. Making modern shopping effortless through AI-powered innovation.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#52B69A]" />
                  <span className="text-gray-300">abinexisr@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#52B69A]" />
                  <span className="text-gray-300">+91 8248038528</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-[#52B69A]" />
                  <span className="text-gray-300">Thiruvarur, Tamil Nadu, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links & Customer Service */}
          <div>
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="/about" className="text-gray-400 hover:text-[#52B69A] transition-colors duration-300">About Us</a></li>
                <li><a href="/#categories" onClick={(e) => {
                  // Check if we're already on the home page
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    const element = document.getElementById('categories');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                  // If on another page, let the default href behavior work
                }} className="text-gray-400 hover:text-[#52B69A] transition-colors duration-300">Categories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Customer Service</h4>
              <ul className="space-y-3">
                <li><a href="/faq" className="text-gray-400 hover:text-[#52B69A] transition-colors duration-300">FAQs</a></li>
                <li><a href="/shipping" className="text-gray-400 hover:text-[#52B69A] transition-colors duration-300">Shipping Info</a></li>
                <li><a href="/returns" className="text-gray-400 hover:text-[#52B69A] transition-colors duration-300">Return & Refund Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Stay Connected</h4>
            <p className="text-gray-400 mb-4">
              Stay Connected to get updates on new products and exclusive offers.
            </p>
            
            <div className="flex space-x-2 mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#52B69A] text-white placeholder-gray-400"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-[#52B69A] to-[#34A0A4] rounded-lg hover:scale-105 transition-transform duration-300">
                <Mail className="w-5 h-5" />
              </button>
            </div>

            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1GJbSSf413/" className="p-2 bg-gray-800 rounded-lg hover:bg-[#52B69A] transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://x.com/Abinexis?t=qtQcfMwSTtgV4UNHhUMbbg&s=08" className="p-2 bg-gray-800 rounded-lg hover:bg-[#52B69A] transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/abinexis?igsh=MTBnbXdicXozaWRucw==" className="p-2 bg-gray-800 rounded-lg hover:bg-[#52B69A] transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-[#52B69A] transition-colors duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 Abinexis. All rights reserved. Founded by Abinash Ramakrishnan.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-[#52B69A] transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-[#52B69A] transition-colors duration-300">
                Terms and Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;