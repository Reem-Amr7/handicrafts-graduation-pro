import React from 'react';
import { FaChessRook, FaMosque, FaRing } from 'react-icons/fa';

const CraftTypes = () => {
  return (
    // <section className="py-16 bg-cover bg-amber-900 bg-center arabic-pattern" style={{ backgroundImage: 'url(https://www.shutterstock.com/shutterstock/photos/2446777505/display_1500/stock-vector-islamic-pattern-vector-illustration-design-template-2446777505.jpg)'}}>
    <section className="py-16 bg-cover bg-[#f8f4e8]  bg-center arabic-pattern mb-8"> 

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">أنواع الحرف اليدوية</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اكتشف تنوع تراثنا الحرفي من مختلف أنحاء العالم العربي
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
            <div className="h-40 bg-amber-200 flex items-center justify-center">
              <FaChessRook className="text-5xl text-amber-600" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">النقش على الخشب</h3>
              <p className="text-gray-600 text-sm">زخارف إسلامية ونقوش هندسية</p>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
            <div className="h-40 bg-amber-200 flex items-center justify-center">
              <FaMosque className="text-5xl text-amber-600" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">الزجاج المعشق</h3>
              <p className="text-gray-600 text-sm">فن القمريات والنوافذ الملونة</p>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
            <div className="h-40 bg-amber-200 flex items-center justify-center">
              <FaRing className="text-5xl text-amber-600" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">صناعة السجاد</h3>
              <p className="text-gray-600 text-sm">سجاد يدوي بأنماط تقليدية</p>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
            <div className="h-40 bg-amber-200 flex items-center justify-center">
              <FaRing className="text-5xl text-amber-600" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">المجوهرات التقليدية</h3>
              <p className="text-gray-600 text-sm">تصاميم مستوحاة من التراث</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftTypes;
