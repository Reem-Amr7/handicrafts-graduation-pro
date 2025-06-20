import React from 'react';
import styles from "./Home.module.css";
import Navbar from '../Navbar/Navbar';
import Layout from '../Layout/Layout';
import LeftSidebar from './Leftside';
import Maincontent from './Maincontent';
import RightSidebar from './Rightside';

import { useNavigate } from "react-router-dom";

export default function Home() {
  return (
    <div className="overflow-x-hidden">                {/* ← هنا */}
      <div className="community-container max-w-[1400px] mx-auto my-6 px-4 flex flex-col lg:flex-row gap-4">
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

        <Maincontent className="flex-1 w-full overflow-x-hidden" />  {/* ← خليها w-full و flex-1 */}

        <div className="hidden lg:block  ">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}

