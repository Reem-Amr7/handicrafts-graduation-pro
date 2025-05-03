import React from 'react';
import styles from "./Profile.module.css";
import { Plus } from "lucide-react";
import post1 from '../../assets/p1.jpg';

export default function ProfileLeftside() {
  return (
    <div className={`${styles.leftsideContainer} sticky top-4 h-screen overflow-y-auto`}>
      {/* معلومات الحرفي */}
      <div className={`p-6 mb-6 ${styles.sidebarSection}`}>
        <h2 className="font-bold text-lg mb-4">معلومات الحرفي</h2>

        {/* Map Box */}
        <div className="border-b pb-4 mb-4">
          <h3 className="font-semibold text-lg mb-2">موقع الحرفي</h3>
          <div className="w-full h-32 bg-gray-200 rounded-md mb-2">
            <p className="text-center pt-12">الخريطة هنا</p>
          </div>
          <p className="text-sm text-gray-600">العنوان: شارع الحرفيين، المدينة</p>
          <p className="text-sm text-gray-600">البلد: مصر</p>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm text-gray-600">فيسبوك</span>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">رابط الفيسبوك</a>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm text-gray-600">انستغرام</span>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">رابط انستغرام</a>
          </div>
        </div>
      </div>

      {/* اشخاص مقترحه لك */}
      <div className={`p-6 mb-6 ${styles.sidebarSection}`}>
        <h2 className="font-bold text-lg mb-4">اشخاص مقترحه لك</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={`person-${item}`} className="flex items-center border-b pb-2 hover:bg-gray-50 p-2 rounded">
              <img src={post1} className="w-12 h-12 object-cover rounded-full ml-3" alt={`شخص ${item}`} />
              <span className="text-right flex-grow">الاسم {item === 1 ? 'الأول' : item === 2 ? 'الثاني' : item === 3 ? 'الثالث' : item === 4 ? 'الرابع' : 'الخامس'}</span>
              <button className="text-blue-500 hover:text-blue-700 p-1">
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* احدث المدونات */}
      <div className={`p-6 ${styles.sidebarSection}`}>
        <h2 className="font-bold text-lg mb-4">احدث المدونات</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={`blog-${item}`} className="flex items-center border-b pb-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
              <img src={post1} className="w-12 h-12 object-cover rounded ml-3" alt={`مدونة ${item}`} />
              <span className="text-right flex-grow">عنوان المدونة {item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}