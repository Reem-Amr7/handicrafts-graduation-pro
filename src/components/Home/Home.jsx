import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./Home.module.css";
import Navbar from '../Navbar/Navbar';
import Layout from '../Layout/Layout';

export default function Home() {
  const navigate = useNavigate(); // استدعاء useNavigate

  return (
    <div>
      <button onClick={() => navigate('/product-details')}>details</button>
    </div>
  );
}

