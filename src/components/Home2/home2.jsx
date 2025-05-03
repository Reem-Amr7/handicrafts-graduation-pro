import React from 'react';
import borderPattern from '../../assets/pattern.png';
import man from '../../assets/img1.webp';
import man2 from '../../assets/p1.jpg';
import AboutSection from './about';
import video from '../../assets/hero.mp4'
import style from './home2.module.css'
import video2 from '../../assets/carve.mp4'


const HandicraftsHomePage = () => {
  return (
    <div className="min-h-screen  text-[#5C4033] font-serif ">

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

      {/* النصوص فوق الفيديو */}
      <div className="relative z-10 text-center text-white">
        <h1 className="text-6xl font-bold mb-4">المركزة</h1>
        <p className="text-4xl">التكنولوجيا</p>
      </div>
    </div>
    
{/*  */}
<section className="bg-[#f8f6e8] py-20  relative">

  {/* النص العربي عنّا */}
  <div className="max-w-6xl mx-auto text-center px-4  mt-24 mb-32  !font-cairo">
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

  {/* زر الرجوع للأعلى */}
  <button
    className="fixed bottom-6 w-14 h-14 left-6 bg-[#9e4f1b] text-white p-3 rounded-full shadow-md hover:bg-[#c2601e] transition"
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  >
    ↑
  </button>
</section>





      {/* Welcome */}
      <section className="text-center mt-10">
        <h2 className="text-3xl md:text-4xl font-semibold">Welcome to the Handicrafts Community</h2>
      </section>

      {/* Action Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
        <div className="bg-[#D6C6B9] shadow-xl rounded-2xl overflow-hidden transition hover:scale-105 duration-300 w-full">
          <img
            src={man}
            alt="Artisan at work"
            className="w-full h-96 object-cover"
          />
          <div className="bg-[#7C2A2A] hover:bg-[#9b2c2c] text-white py-3 text-center text-lg font-semibold cursor-pointer">
            Explore artisans
          </div>
        </div>

        <div className="bg-[#D6C6B9] shadow-xl rounded-2xl overflow-hidden transition hover:scale-105 duration-300">
          <img
            src={man2}
            alt="Handicrafts shop"
            className="w-full h-96 object-cover"
          />
          <div className="bg-[#7C2A2A] hover:bg-[#9b2c2c] text-white py-3 text-center text-lg font-semibold cursor-pointer">
            Visit the shop
          </div>
        </div>
      </section>

      {/* Decorative Border */}
      {/* <div className="mt-16 w-full">
        <img
          src={borderPattern}
          alt="Decorative border"
          className="w-full h-64 "
        />
      </div> */}
      <AboutSection/>

      <section className="bg-gray-100 py-20 px-5 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-sans text-gray-800 mb-8 leading-tight">
          impactful narratives from legacies of the past.
        </h2>
        <a
          href="#"
          className="inline-block bg-black text-white px-8 py-3 rounded-full font-sans text-lg hover:bg-gray-800 transition-colors duration-300"
        >
          learn more about us
        </a>
      </div>
    </section>

    </div>
  );
};

export default HandicraftsHomePage;
