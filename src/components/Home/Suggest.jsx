import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import styles from './Home.module.css';
import user1 from '../../assets/user1.jpg';

export default function SuggestedPeople() {
  const people = [
    { id: 1, name: "إيمي واتسون", department: "حرف التطريز", image: user1 },
    { id: 2, name: "محمد خان", department: "صناعة الفخار", image: user1 },
    { id: 3, name: "سانيا جيل", department: "النجارة التقليدية", image: user1 },
    { id: 4, name: "أحمد نور", department: "الحدادة", image: user1 },
    { id: 5, name: "ليلى حسن", department: "الخياطة والتفصيل", image: user1 },
    { id: 6, name: "يوسف إبراهيم", department: "حياكة السجاد", image: user1 },
    { id: 7, name: "نوران سامي", department: "فن الزخرفة الإسلامية", image: user1 },
    { id: 8, name: "رامي علاء", department: "صناعة الزجاج اليدوي", image: user1 },
    { id: 9, name: "دينا مصطفى", department: "حرف الجلود", image: user1 },
];


  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3; 

  const nextSlide = () => {
    if (currentIndex + itemsPerPage < people.length) {
      setCurrentIndex((prev) => prev + itemsPerPage);
    }
  };

  const prevSlide = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex((prev) => prev - itemsPerPage);
    }
  };

  return (
    <div className={`p-5  mt-5 ${styles.leftside} relative`}>
      {/* العنوان */}
      <h2 className="text-xl font-bold text-right flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Star className="text-yellow-500" />
          <div>
          <h2>مقترح لك</h2>
          <h4>تابع هؤلاء الاشخاص</h4>
          
          </div>
        </span>
      </h2>

      {/* زر التنقل لليسار */}
      <button
        className="absolute left-[-15px] w-11 h-11 top-1/2 transform -translate-y-1/2 bg-red-800 p-2 rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50"
        onClick={prevSlide}
        disabled={currentIndex === 0} 
      >
        <ChevronLeft className="text-white text-center " />
      </button>

      <div className="grid grid-cols-3 gap-6 mt-4">
        {people.slice(currentIndex, currentIndex + itemsPerPage).map((person) => (
          <div key={person.id} className="flex flex-col items-center text-center  p-4">
            <img src={person.image} alt={person.name} className="w-20 h-20 rounded-full border-2 border-red-900" />
            <h2 className="mt-2 font-semibold">{person.name}</h2>
            <h3 className="">{person.department}</h3>
            <button className="mt-3 px-4 w-20 h-7 py-4 bg-[#543310] text-white text-center   rounded-xl flex items-center gap-2">
            <Star size={16} />   تابع 
            </button>
          </div>
        ))}
      </div>

      {/* زر التنقل لليمين */}
      <button
        className="absolute  w-11 h-11 right-[-15px] top-1/2 transform -translate-y-1/2 bg-red-800 p-2 rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50"
        onClick={nextSlide}
        disabled={currentIndex + itemsPerPage >= people.length} // تعطيل الزر عند الوصول للنهاية
      >
        <ChevronRight className="text-white text-center" />
      </button>
    </div>
  );
}
