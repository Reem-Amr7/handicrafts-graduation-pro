import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const Workshops = () => {
  const workshops = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1597070246809-c81e11ec6a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      title: "فن الخزف التقليدي",
      date: "15 يونيو | 8 مساءً",
      instructor: {
        name: "محمد العتيبي - حرفي خزف منذ 15 سنة",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      description: "ورشة تعليمية تفاعلية تغطي أساسيات تشكيل الخزف باستخدام التقنيات التقليدية التي تتميز بها منطقتنا العربية. ستتعلم في هذه الورشة كيفية تحضار الطين وتشكيله وتزيينه بالزخارف العربية التقليدية."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      title: "حياكة السجاد اليدوي",
      date: "20 يونيو | 6 مساءً",
      instructor: {
        name: "سعاد محمد - خبيرة النسيج اليدوي",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      description: "تعلم فن حياكة السجاد اليدوي وأنواع العقد والتصاميم التي تشتهر بها منطقتنا العربية. في نهاية الورشة ستكون قادراً على صنع قطع خاصة بك باستخدام خامات صديقة للبيئة."
    }
  ];

  return (
    <section className="workshops mb-16">
    <h2 className="text-3xl text-center mb-12 mt-10 text-[#8B4513] relative">
      الورش التعليمية القادمة
      <span className="block w-24 h-1 bg-[#C19A6B] mx-auto mt-4"></span>
    </h2>
  
    {/* ✅ الغلاف الذي يحصر العرض ويضبط المحاذاة */}
    <div className="max-w-5xl mx-auto px-4 space-y-8">
      {workshops.map(workshop => (
        <div key={workshop.id} className="workshop-card bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 flex flex-col md:flex-row">
          <div 
            className="workshop-img h-48 md:h-auto md:w-1/3 bg-cover bg-center" 
            style={{ backgroundImage: `url(${workshop.image})` }}
          ></div>
          
          <div className="workshop-info p-6 md:w-2/3">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-[#5D4037]">{workshop.title}</h3>
              <span className="bg-[#C19A6B] text-white py-1 px-3 rounded text-sm">{workshop.date}</span>
            </div>
            
            <div className="flex items-center mb-4">
              <img src={workshop.instructor.image} alt={workshop.instructor.name} className="w-10 h-10 rounded-full ml-3" />
              <span>مع {workshop.instructor.name}</span>
            </div>
            
            <p className="mb-6">{workshop.description}</p>
            
            <a 
              href="#" 
              className="btn bg-[#8B4513] text-white py-2 px-6 rounded font-semibold hover:bg-[#5D4037] transition inline-flex items-center"
              onClick={(e) => {
                e.preventDefault();
                alert(`شكراً لتسجيلك في ورشة ${workshop.title}. سيتم إرسال رسالة تأكيد بالتفاصيل إلى بريدك الإلكتروني.`);
              }}
            >
              سجل الآن
              <FaArrowLeft className="mr-2" />
            </a>
          </div>
        </div>
      ))}
    </div>
  </section>
  
  );
};

export default Workshops;