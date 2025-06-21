import React, { useState, useEffect } from 'react';
import { ColorRing } from 'react-loader-spinner'; // إضافة الـ ColorRing
import styles from "./Home.module.css";
import Navbar from '../Navbar/Navbar';
import Layout from '../Layout/Layout';
import LeftSidebar from './Leftside';
import Maincontent from './Maincontent';
import RightSidebar from './Rightside';

import { useNavigate } from "react-router-dom";

export default function Home() {
    const [loading, setLoading] = useState(true); // إضافة متغير loading
// محاكاة تحميل الداتا
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 ثانية كمثال للتحميل

    return () => clearTimeout(timer); // تنظيف الـ timer
  }, []);

  // عرض الـ ColorRing loader لما الـ loading بـ true
    if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />
      </div>
    );
  }
  return (
    <div className="mt-24">
      <div className="community-container max-w-[1400px] mx-auto my-6 px-4 flex flex-col lg:flex-row gap-4">
        
        {/* Left Sidebar - Sticky + Scroll داخلي + إخفاء Scrollbar */}
        <div className="hidden lg:block sticky top-28 self-start z-20 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide pr-2">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <Maincontent className="flex-1 w-full overflow-x-hidden" />

        {/* Right Sidebar - Sticky + Scroll داخلي + إخفاء Scrollbar */}
        <div className="hidden lg:block sticky top-28 self-start z-20 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide pl-2">
          <RightSidebar />
        </div>

      </div>
    </div>
  );
}
