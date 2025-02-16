import React from 'react'
import styles from "./Profile.module.css"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Plus } from "lucide-react";
import post1 from '../../assets/p1.jpg';
export default function ProfileLeftside() {
  return (

  <>
    <div>
    {/* <div className={`p-6 mt-8 ${styles.leftside} w-72 h-96`}>
      <h2 className=" font-bold text-lg mb-4">أكمل معلومات ملفك الشخصي</h2>

      <div className="w-24 mx-auto mb-6">
        <CircularProgressbar
          value={animatValue}
          text={`${Math.round(animatValue)}%`}
          styles={buildStyles({
            pathColor: "#9E2828",
            textColor: "#000",
            trailColor: "#D9D9D9",
            textSize: "16px",
          })}
        />
      </div>

      <div className="text-right space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <span>أضف صورة الملف الشخصي</span>
          <Plus className="text-gray-600 cursor-pointer" />
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <span>تخصصك</span>
          <Plus className="text-gray-600 cursor-pointer" />
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <span>طرق الدفع</span>
          <Plus className="text-gray-600 cursor-pointer" />
        </div>
      </div>
     
    </div> */}
<div className="container flex flex-row-reverse justify-start gap-6 w-72 mr-8 ">
  <div className={`p-6 mt-8 ${styles.leftside} w-72 h-96 sticky top-10 ml-auto`}>
    <h2 className="font-bold text-lg mb-4">اشخاص مقترحه لك</h2>
    <div className="text-right space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <img src={post1} className="w-16 h-18 ml-2 " />
        <span className='ml-auto'>الاسم الاول</span>
      </div>
      <div className="flex justify-between items-center border-b pb-2">
        <img src={post1} className="w-16 h-18 ml-2" />
        <span className='ml-auto'>الاسم الثاني</span>
      </div>
      <div className="flex justify-between items-center border-b pb-2">
        <img src={post1} className="w-16 h-18 ml-2" />
        <span className='ml-auto'>الاسم الثالث</span>
      </div>
      <div className="flex justify-between items-center border-b pb-2">
        <img src={post1} className="w-16 h-18 ml-2" />
        <span className='ml-auto'>الاسم الرابع</span>
      </div>
      <div className="flex justify-between items-center border-b pb-2">
        <img src={post1} className="w-16 h-18 ml-2" />
        <span className='ml-auto'>الاسم الخامس</span>
      </div>
    </div>
  </div>
</div>
<div className="container flex  gap-6 w-72 mr-8 ">
  <div className={`p-6 mt-8 ${styles.leftside} w-72 h-96 sticky top-10 ml-auto`}>
    <h2 className="font-bold text-lg mb-4">احدث المدونات</h2>
    <div className="text-right space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <img src={post1} className="w-16 h-18 ml-2" />
        <span>عنوان</span>
      </div>
      <div className="flex justify-between items-center border-b pb-2">
        <img src={post1} className="w-16 h-18 ml-2" />
        <span>عنوان</span>
      </div>
      <div className="flex justify-between items-center border-b pb-2">
        <img src={post1} className="w-16 h-18 ml-2" />
        <span>عنوان</span>
      </div>
    </div>
  </div>
</div>
    </div>

  </>
  );
}
