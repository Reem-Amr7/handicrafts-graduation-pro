import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-16 bg-[#f8f4e8]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* النص والاحصائيات */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-[#5D4037] mb-6 relative">
              <span className="relative z-10 px-4 bg-[#f8f4e8]">من نحن؟</span>
              <span className="absolute top-1/2 right-0 left-0 h-0.5 bg-[#8B4513] bg-opacity-20 transform -translate-y-1/2"></span>
            </h2>
            
            <p className="text-[#3D2B1F] mb-4 leading-relaxed  ">
              تراثنا منصة رقمية تهدف إلى الحفاظ على الموروث الحرفي العربي وإتاحته للعالم. نحن نربط الحرفيين بجمهورهم مباشرة، ونقدم مساحة لعرض وبيع المنتجات اليدوية الأصلية، بالإضافة إلى بناء مجتمع يعتز بهذه الحرف ويناقش سبل تطويرها.
            </p>
            
            <p className="text-[#3D2B1F] mb-8 leading-relaxed">
              نؤمن بأن الحرف اليدوية ليست مجرد منتجات، بل هي قصص وذكريات وتراث يحمل هوية الأجداد ويوصلها للأحفاد.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-[#8B4513]">3,450+</div>
                <div className="text-[#5D4037] mt-2">حرفي مسجل</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-[#8B4513]">12,800+</div>
                <div className="text-[#5D4037] mt-2">منتج حرفي</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-[#8B4513]">98%</div>
                <div className="text-[#5D4037] mt-2">رضا العملاء</div>
              </div>
            </div>
          </div>
          
          {/* الفيديو */}
          <div className="lg:w-1/2 rounded-lg overflow-hidden shadow-lg">
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                width="100%" 
                height="400"
                src="https://www.youtube.com/embed/17x_pLYBx2w?si=AJZoaUkhnblALH1J" 
                title="فيديو عن الحرف اليدوية"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;