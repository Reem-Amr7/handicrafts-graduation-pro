<<<<<<< HEAD
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./Home.module.css";
import Navbar from '../Navbar/Navbar';
import Layout from '../Layout/Layout';

=======
import React from 'react'
import styles from "./Home.module.css"
import Navbar from '../Navbar/Navbar'
import Layout from '../Layout/Layout'
import Leftside from './Leftside'
import Maincontent from './Maincontent'
import Rightside from './Rightside'
>>>>>>> 02e6595784f72aaac0558b601d11f73ee4aac93c
export default function Home() {
  const navigate = useNavigate(); // استدعاء useNavigate

  return (
    <div>
<<<<<<< HEAD
      <button onClick={() => navigate('/product-details')}>details</button>
=======
<div className="grid grid-cols-12 gap-4 p-4">
      <Leftside/>
     <Maincontent/>
     <Rightside/>
    </div>
>>>>>>> 02e6595784f72aaac0558b601d11f73ee4aac93c
    </div>
  );
}

