import React from 'react';
import styles from "./Home.module.css";
import Navbar from '../Navbar/Navbar';
import Layout from '../Layout/Layout';
import LeftSidebar from './Leftside';
import Maincontent from './Maincontent';
import RightSidebar from './Rightside';

export default function Home() {
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
