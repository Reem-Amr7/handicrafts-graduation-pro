import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#8B4513] to-[#5D4037] text-white py-12">
      <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="footer-col">
          <h3 className="text-xl font-bold mb-6 relative inline-block">
            عن إرث
            <span className="absolute bottom-[-8px] right-0 w-12 h-0.5 bg-[#E6D5B8]"></span>
          </h3>
          <p className="mb-4">منصة إرث هي أول سوق إلكتروني متكامل للصناعات والحرف اليدوية العربية تجمع بين التجارة الإلكترونية والتعليم التفاعلي عبر الإنترنت، مع بناء مجتمع متكامل لعشاق التراث العربي.</p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E6D5B8] hover:text-[#5D4037] transition">
              <FaFacebookF />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E6D5B8] hover:text-[#5D4037] transition">
              <FaTwitter />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E6D5B8] hover:text-[#5D4037] transition">
              <FaInstagram />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E6D5B8] hover:text-[#5D4037] transition">
              <FaYoutube />
            </a>
          </div>
        </div>
        
        <div className="footer-col">
          <h3 className="text-xl font-bold mb-6 relative inline-block">
            روابط سريعة
            <span className="absolute bottom-[-8px] right-0 w-12 h-0.5 bg-[#E6D5B8]"></span>
          </h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">الصفحة الرئيسية</a></li>
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">المتجر الإلكتروني</a></li>
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">الورش التعليمية</a></li>
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">المجتمع التفاعلي</a></li>
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">سياسة الخصوصية</a></li>
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">شروط الاستخدام</a></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3 className="text-xl font-bold mb-6 relative inline-block">
            الدول
            <span className="absolute bottom-[-8px] right-0 w-12 h-0.5 bg-[#E6D5B8]"></span>
          </h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">المملكة العربية السعودية</a></li>
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">الإمارات العربية المتحدة</a></li>
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">مصر</a></li>
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">المغرب</a></li>
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">العراق</a></li>
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">سوريا</a></li>
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">عُمان</a></li>
            <li><a href="#" className="text-gray-300 hover:text-[#E6D5B8] hover:pr-2 transition">اليمن</a></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h3 className="text-xl font-bold mb-6 relative inline-block">
            اتصل بنا
            <span className="absolute bottom-[-8px] right-0 w-12 h-0.5 bg-[#E6D5B8]"></span>
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <FaMapMarkerAlt className="ml-2" />
              الرياض، المملكة العربية السعودية
            </li>
            <li className="flex items-center">
              <FaPhone className="ml-2" />
              +966 12 345 6789
            </li>
            <li className="flex items-center">
              <FaEnvelope className="ml-2" />
              info@irath.com
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-8 pt-8 mt-8 border-t border-white/10 text-center text-gray-300 text-sm">
        <p>جميع الحقوق محفوظة &copy; 2023 منصة إرث</p>
      </div>
    </footer>
  );
};

export default Footer;