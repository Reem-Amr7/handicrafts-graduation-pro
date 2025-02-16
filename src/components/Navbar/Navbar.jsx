import React from 'react';
import styles from './Navbar.module.css'; 
import { Link } from 'react-router-dom';
import photo from "./../../assets/Screenshot 2025-02-13 210809.png"

export default function Navbar() {
  return (
    <>
<header className={styles.header}>
     
     <div className={styles.topBar}>
     <div className='mr-16 '><i className="fas fa-globe "></i>
     <span className='mr-2 '> عربى</span></div>
    <div className='mr-16 '>
    <i class="fas fa-truck"></i>

<span className='mr-4 '>تتبع شحنتك</span>
    </div>
     </div>

     <nav className={styles.nav}>
      
       <h1 className={styles.logo} >تراثنا</h1>

       <div className={styles.searchContainer}>
         <input
           type="text"
           placeholder="بحث في المنشورات"
           className={styles.searchInput}
           dir="rtl" 
         />
         <button className={styles.searchButton}>بحث</button>
       </div>

    
       <div className={styles.profile}>
       <img src={photo} alt="الصورة الشخصية" className={styles.profileImage} />
         <span className={styles.profileName}>الاسم</span>
       </div>

       <div className={styles.socialIcons}>
       <button className={styles.socialButton}>
           <i className="fas fa-tv"></i> 
         </button>
         <button className={styles.socialButton}>
           <i className="fas fa-shopping-cart"></i> 
         </button>
         <button className={styles.socialButton}>
           <i className="fas fa-bell"></i> 
         </button>
         <button className={styles.socialButton}>
           <i className="fas fa-comment-alt"></i> 
         </button>
         <button className={styles.socialButton}>
           <i className="fas fa-th-large"></i> 
         </button>
       </div>
     </nav>

   
   </header>
   <div className={styles.menu}>
   <Link to="/" className={styles.menuLink}>الرئيسية</Link>

       <Link to="/collections" className={styles.menuLink}>مجموعاتك</Link>
       <Link to="/shop" className={styles.menuLink}>تسوق</Link>

       <Link to="/blog" className={styles.menuLink}>مدونة</Link>
     </div>
   </>
  );
}