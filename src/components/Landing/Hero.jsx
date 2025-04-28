import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // ✅ جديد
import styles from "./Home.module.css";
import background from '../../assets/background.jpg';
function Hero ()  {
  return (

<section
  className="hero bg-cover bg-center h-[60vh] flex items-center justify-center text-center relative"
  style={{ backgroundImage: `url(${background})` }}
>      <div className="bg-[rgba(139,69,19,0.7)] p-8 rounded-lg max-w-4xl mx-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">منصة تراثنا للصناعات والحرف العربية اليدوية</h1>
        <p className="text-lg md:text-xl text-white mb-8">اكتشف تراثنا الغني عبر متجر إلكتروني يعرض أجمل الحرف اليدوية، وورش تعليمية مباشرة مع الحرفيين، ومجتمع متكامل لعشاق التراث العربي</p>
        
        <Link to="/register" className="btn bg-[#8B4513] text-white py-3 px-6 rounded font-semibold hover:bg-[#5D4037] transition transform hover:-translate-y-1 inline-flex items-center">
          استكشف الآن
          <FaArrowLeft className="mr-2" />
        </Link>

      </div>
    </section>
  );
};

export default Hero;
