import React from 'react';
import borderPattern from '../../assets/pattern.png';
import man from '../../assets/img1.webp';
import man2 from '../../assets/p1.jpg';
import AboutSection from './about';
import video from '../../assets/hero.mp4';
import style from './home2.module.css';
import video2 from '../../assets/carve.mp4';
import MessagingDropdown from '../Navbar/MessagingDropdown.jsx';
import background from '../../assets/background.jpg';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from "../Footer/Footer";
import Features from '../Landing/Feature.jsx';

const HandicraftsHomePage = () => {
  return (
    <div className="min-h-screen text-[#5C4033] font-serif">
      {/* Navbar */}
      <div className="relative h-screen flex items-center justify-center">
        {/* الفيديو */}
        <video
          autoPlay
          loop
          muted
          className="absolute w-full h-full object-cover"
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* طبقة شفافة تغطي الفيديو */}
        <div className="absolute w-full h-full bg-[rgba(62,34,15,0.3)] z-10"></div>

        {/* النصوص فوق الفيديو */}
        <section className="hero bg-cover bg-center h-[60vh] flex items-center justify-center text-center relative z-20">
          <div className=" p-8 rounded-lg max-w-4xl mx-4">
            <h1 className="text-5xl md:text-5xl font-bold mb-4 text-white">
              منصة تراثنا للصناعات والحرف العربية اليدوية
            </h1>
            <p className="text-lg md:text-2xl text-white mb-8">
              اكتشف تراثنا الغني عبر متجر إلكتروني يعرض أجمل الحرف اليدوية، وورش تعليمية مباشرة مع الحرفيين، ومجتمع متكامل لعشاق التراث العربي
            </p>
            <Link
              to="/register"
              className="btn bg-[#8B4513] text-white py-3 px-6 rounded font-semibold hover:bg-[#5D4037] transition transform hover:-translate-y-1 inline-flex items-center"
            >
              استكشف الآن
              <FaArrowLeft className="mr-2" />
            </Link>
          </div>
        </section>
      </div>

      <section className="bg-[#f8f6e8] py-20 relative">
        {/* النص العربي عنّا */}
        <div className="max-w-6xl mx-auto text-center px-4 mt-24 mb-32 !font-cairo">
          <h2 className="text-4xl md:text-5xl font-bold text-[#3b312a] mb-6">
            بأيدٍ عربيه ماهرة، ننسج حكاية المستقبل من خيوط الماضي.
          </h2>
          <p className="text-[#3b312a] text-3xl leading-relaxed">
            نؤمن بأن الحِرفة ليست مجرّد منتج، بل قصة تُروى بروح الأصالة. <br />
            نعمل مع الحرفيين لصناعة قطع تعبّر عن تراثنا… بهويةٍ معاصرة.
          </p>
        </div>

        <div className="flex flex-col md:flex-row mt-10">
          {/* فيديو يسار (لاصق بالحافة) */}
          <div className="w-64 md:w-1/3">
            <video
              autoPlay
              loop
              muted
              src={video}
              playsInline
              className="w-64 h-[700px] object-cover shadow-md"
            />
          </div>

          {/* الصور في المنتصف */}
          <div className="flex-grow flex flex-wrap gap-4 w-full justify-start items-start px-2">
            <img
              src={man}
              alt="clay1"
              className="w-[400px] h-72 object-cover shadow"
            />
            <img
              src={man2}
              alt="heritage wall"
              className="w-[300px] h-65 mr-28 mt-36 object-cover shadow"
            />
            <img
              src={man2}
              alt="palms"
              className="w-[350px] h-64 object-cover shadow"
            />
            <img
              src={man}
              alt="clay2"
              className="w-[300px] h-[150px] mr-[160px] object-cover shadow"
            />
          </div>

          {/* فيديو يمين (لاصق بالحافة) */}
          <div className="w-96 md:w-[40%]">
            <video
              autoPlay
              loop
              muted
              src={video2}
              playsInline
              className="w-full h-[750px] object-cover shadow-md"
            />
          </div>
        </div>
<Features/>
        {/* زر الرجوع للأعلى */}
        <button
          className="fixed bottom-6 w-14 h-14 left-6 bg-[#9e4f1b] text-white p-3 rounded-full shadow-md hover:bg-[#c2601e] transition"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      </section>

     
 
      {/* <AboutSection /> */}

<Footer/>

    </div>
  );
};

export default HandicraftsHomePage;