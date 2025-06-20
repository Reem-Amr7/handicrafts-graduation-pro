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
    <div className="overflow-x-hidden mt-24">
      <div className="community-container max-w-[1400px] mx-auto my-6 px-4 flex flex-col lg:flex-row gap-4">
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

        <Maincontent className="flex-1 w-full overflow-x-hidden" />

        <div className="hidden lg:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}