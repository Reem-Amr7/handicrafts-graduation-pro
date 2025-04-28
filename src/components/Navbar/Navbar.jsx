// import React from 'react';
// import styles from './Navbar.module.css'; 
// import { Link, useNavigate } from 'react-router-dom';
// import photo from "./../../assets/Screenshot 2025-02-13 210809.png";

// export default function Navbar() {
//   const navigate = useNavigate(); 

//   // جلب الاسم الكامل من localStorage
//   const userName = localStorage.getItem("userName");


//   return (
//     <>
//       <header className={styles.header}>
//         <div className={styles.topBar}>
//           <div className='mr-16'>
//             <i className="fas fa-globe"></i>
//             <span className='mr-2'>عربى</span>
//           </div>
//           <div className='mr-16'>
//             <i className="fas fa-truck"></i>
//             <span className='mr-4'>تتبع شحنتك</span>
//           </div>
//         </div>

//         <nav className={styles.nav}>
//           <h1 className={styles.logo}>تراثنا</h1>

//           <div className={styles.searchContainer}>
//             <input
//               type="text"
//               placeholder="بحث في المنشورات"
//               className={styles.searchInput}
//               dir="rtl"
//             />
//             <button className={styles.searchButton}>بحث</button>
//           </div>

//           <div className={styles.profile}>
//             <img onClick={() => navigate('/profile')} src={photo} alt="الصورة الشخصية" className={styles.profileImage} />
//             <span className={styles.profileName}>{userName || "الاسم"}</span> {/* عرض الاسم المخزن أو اسم افتراضي */}
//           </div>

//           <div className={styles.socialIcons}>
//             <Link to="/LiveStream" className={styles.socialButton}>
//               <i className="fas fa-tv"></i>
//             </Link>
//             <button className={styles.socialButton}>
//               <i className="fas fa-shopping-cart"></i>
//             </button>
//             <button className={styles.socialButton}>
//               <i className="fas fa-bell"></i>
//             </button>
//             <button className={styles.socialButton}>
//               <i className="fas fa-comment-alt"></i>
//             </button>
//             <button className={styles.socialButton}>
//               <i className="fas fa-th-large"></i>
//             </button>
//           </div>
//         </nav>
//       </header>

//       <div className={styles.menu}>
//         <Link to="/" className={styles.menuLink}>الرئيسية</Link>
//         <Link to="/collections" className={styles.menuLink}>مجموعاتك</Link>
//         <Link to="/shop" className={styles.menuLink}>تسوق</Link>
//         <Link to="/blog" className={styles.menuLink}>مدونة</Link>
//       </div>
//     </>
//   );
// }
import React, { useState } from 'react';
import { FaHandsHelping, FaSearch, FaUser, FaShoppingCart, FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import photo from "./../../assets/Screenshot 2025-02-13 210809.png";
import styles from './Navbar.module.css'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  return (
    <header className="bg-gradient-to-r from-[#8B4513] to-[#5D4037] text-white shadow-md h-24">
      {/* الشريط العلوي للغة وتتبع الشحنة */}
      <div className={styles.topBar}>
        <div className="flex items-center ml-6">
          <i className="fas fa-globe ml-2"></i>
          <span>عربى</span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-truck ml-2"></i>
          <span>تتبع شحنتك</span>
        </div>
      </div>

      {/* الشريط الرئيسي */}
      <div className="container mx-auto  flex justify-between items-center py-3 px-8">
        {/* الشعار */}
        <div className="logo flex items-center text-2xl font-bold">
        <FaHandsHelping className="mr-2 text-[#E6D5B8]" />

          <span>تراثنا</span>
        </div>

        {/* الروابط */}
        <nav className={`header-nav ${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:static top-full left-0 w-full md:w-auto bg-[#5D4037] md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none`}>
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
          <li><Link to="/" className="text-white hover:bg-white/20 py-1 px-2 rounded transition">الرئيسية</Link></li>
          <li><Link to="/home" className="text-white hover:bg-white/20 py-1 px-2 rounded transition">المجتمع</Link></li>
          <li><Link to="/shop" className="text-white hover:bg-white/20 py-1 px-2 rounded transition">المتجر</Link></li>
            <li><Link to="/LiveStream" className="text-white hover:bg-white/20 py-1 px-2 rounded transition">الورش التعليمية</Link></li>
            <li><Link to="/profile" className="text-white hover:bg-white/20 py-1 px-2 rounded transition">الحرفيين</Link></li>
            <li><Link to="/about" className="text-white hover:bg-white/20 py-1 px-2 rounded transition">عن المنصة</Link></li>
          </ul>
        </nav>

        {/* أيقونات المستخدم والبحث والسلة */}
        <div className="flex items-center space-x-4">
        <span className="text-xl text-white hover:text-[#E6D5B8] cursor-pointer"><FaSearch /></span>
<Link to="/login" className="text-xl text-white hover:text-[#E6D5B8]"><FaUser /></Link>
<span className="text-xl text-white hover:text-[#E6D5B8] cursor-pointer"><FaShoppingCart /></span>


          {/* صورة المستخدم و الاسم */}
          <div onClick={() => navigate('/profile')} className="flex items-center bg-[#E6D5B8] text-[#5D4037] px-3 py-1 rounded-full cursor-pointer">
            <img src={photo} alt="الصورة الشخصية" className="w-8 h-8 rounded-full ml-2" />
            <span>{userName || "الاسم"}</span>
          </div>
        </div>

        {/* زر القائمة للجوال */}
        <span className="md:hidden text-2xl text-white ml-4" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FaBars />
        </span>
      </div>
    </header>
  );
};

export default Header;
