import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./Home.module.css";
import Navbar from '../Navbar/Navbar';
import Layout from '../Layout/Layout';
import Leftside from './Leftside';
import Maincontent from './Maincontent';
import Rightside from './Rightside';

export default function Home() {
  const navigate = useNavigate(); // استدعاء useNavigate

  return (
    <div>
      {/* <button onClick={() => navigate('/product-details')}>details</button> */}

      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-3"><Leftside /></div>
        <div className="col-span-6"><Maincontent /></div>
        <div className="col-span-3"><Rightside /></div>
      </div>
    </div>
  );
}
