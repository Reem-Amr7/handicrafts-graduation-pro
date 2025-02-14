import React from 'react';
import styles from './Navbar.module.css'; 
import { Link } from 'react-router-dom';
import photo from "./../../assets/Screenshot 2025-02-13 210809.png"

export default function Navbar() {
  return (
    <header className={styles.header}>
     
      <div className={styles.topBar}>
        <span className='mr-16'>تتبع شحنتك</span>
      </div>

      <nav className={styles.nav}>
       
        <h1 className={styles.logo}>تراثنا</h1>

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
          <span className={styles.profileName}>الاسم</span>
          <img src={photo} alt="الصورة الشخصية" className={styles.profileImage} />
        </div>

        <div className={styles.socialIcons}>
          <button className={styles.socialButton}>
            <i className="fas fa-th-large"></i> 
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
            <i className="fas fa-tv"></i> 
          </button>
        </div>
      </nav>

      {/* <div className={styles.menu}>
        <Link to="/collections" className={styles.menuLink}>مجموعاتك</Link>
        <Link to="/blog" className={styles.menuLink}>مدونة</Link>
        <Link to="/shop" className={styles.menuLink}>تسوق</Link>
        <Link to="/" className={styles.menuLink}>الرئيسية</Link>
      </div> */}
    </header>
  );
}