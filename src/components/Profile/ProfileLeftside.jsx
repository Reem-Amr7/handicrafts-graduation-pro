import React from 'react';
import styles from "./Profile.module.css";
import { Plus } from "lucide-react";
import post1 from '../../assets/p1.jpg';
import user1 from '../../assets/user1.jpg';

export default function ProfileLeftside() {
  return (
    <>
    {/* الشريط الجانبي الأيسر */}
    <aside className="col-span-3 mr-10 w-full p-8">

    <div className={`p-5  w-65 ${styles.leftside}`}>
        <h2 className="text-lg font-semibold mb-2" >
مجموعاتك            </h2>
        <ul className="space-y-2">
          <li className="bg-white-50 p-2 rounded shadow"> 
            <div className='flex mr-3'>
                <img src='' className="w-10 h-10 rounded-full"  />
                <span className='mr-3'>مجموعة 1</span>
            </div>
            <div className="flex items-center gap-2 mr-16">
  <h3 >اشعارات</h3>
  <div className="w-9 h-9 border-2 border-red-800  text-center mr-4"><span className="">1</span></div>
</div>
          </li>
          <li className="bg-white-50 p-2 rounded shadow"> 
            <div className='flex mr-3'>
                <img src='' className="w-8 h-8 rounded-full" />
                <span className='mr-3'>مجموعة 1</span>
            </div>
            <div className="flex items-center gap-2 mr-16">
  <h3 >اشعارات</h3>
  <div className="w-9 h-9 border-2 border-red-800  text-center mr-4"><span className="">1</span></div>
</div>
          </li>
          <li className="bg-white-50 p-2 rounded shadow"> 
            <div className='flex mr-3'>
                <img src='' className="w-10 h-10 rounded-full" />
                <span className='mr-3'>مجموعة 1</span>
            </div>
            <div className="flex items-center gap-2 mr-16">
  <h3 >اشعارات</h3>
  <div className="w-9 h-9 border-2 border-red-800   text-center mr-4"><span className="">1</span></div>
</div>
          </li>
        
        </ul>
      </div>
{/* ........................................................................... */}

<div className={`p-5 mt-8 ${styles.leftside} `}>
        <h2 className="text-lg font-semibold mb-2">  المجموعات المقترحة
        </h2>
        <ul className="space-y-2">
          <li className="bg-white p-2 rounded shadow">مجموعة التصميم</li>
          <li className="bg-white p-2 rounded shadow">مجموعة البرمجة</li>
        </ul>
      </div>


{/* ........................................................................... */}

      <div className={`p-5 mt-8 ${styles.leftside} sticky top-10`}>
        <h2 className="text-lg font-semibold mb-2">الأصدقاء</h2>
        <ul className="space-y-2">
          <li className="bg-white-50 p-2 rounded shadow flex items-center space-x-2">
            <img src={user1} className="w-10 h-10 rounded-full" alt="صورة الصديق" />
            <span>user name</span>
          </li>
          <li className="bg-white-50 p-2 rounded shadow flex items-center space-x-2">
            <img src={user1} className="w-10 h-10 rounded-full" alt="صورة الصديق" />
            <span>user name</span>
          </li>
        </ul>
      </div>


    


      </aside>
    </>
  );
}