import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  FaHandsHelping,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaSearch
} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import photo from "../../assets/Screenshot 2025-02-13 210809.png";
import styles from './Navbar.module.css';
import { TokenContext } from "../../Context/TokenContext";
import UserMenu from './UserMenu';
import NotificationBell from './notifications';
import ConversationListDropdown from './ConversationsList';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const { token } = useContext(TokenContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const searchRef = useRef(null);

  // تحديث بيانات المستخدم عند تغيير الـ token
  useEffect(() => {
    if (token) {
      const storedId = localStorage.getItem("userId");
      const storedName = localStorage.getItem("userName");
      setUserId(storedId);
      setUserName(storedName);
    } else {
      setUserId(null);
      setUserName(null);
    }
  }, [token]);

  useEffect(() => {
    if (!token || searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    const fetchArtisans = async () => {
      try {
        const res = await axios.get('https://ourheritage.runasp.net/api/Users', {
          params: { PageIndex: 1, PageSize: 10, Search: searchQuery },
          headers: { Authorization: `Bearer ${token}` }
        });
        setSearchResults(res.data.items || []);
      } catch (err) {
        console.error('خطأ في جلب نتائج البحث:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('userToken');
          navigate('/login');
        }
      }
    };
    fetchArtisans();
  }, [searchQuery, token, navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShowSearch = () => setShowSearch(true);

  const handleLogout = async () => {
    try {
      await axios.post(
        'https://ourheritage.runasp.net/api/Auth/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      setUserId(null);
      setUserName(null);
      navigate('/home2');
    } catch (error) {
      console.error('فشل تسجيل الخروج:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#8B4513] to-[#5D4037] text-white shadow-md h-24 fixed top-0 w-full z-30 ">
      <div className={styles.topBar}>
        <div className="flex items-center ml-6"><span>عربى</span></div>
        <div className="flex items-center"><span>تتبع شحنتك</span></div>
      </div>

      <div className="container mx-auto flex justify-between items-center py-3 px-8 relative ">
        <div className="logo flex items-center text-3xl font-bold">
          <FaHandsHelping className="mr-2 text-[#E6D5B8]" />
          <span>تراثنا</span>
        </div>

        {userId && (
          <nav className="hidden md:block">
            <ul className="flex text-lg flex-row-reverse gap-6">
              <li><Link to="/admin" className={`${styles.navLink} ${location.pathname === '/admin' ? styles.activeLink : ''}`}>المنصة</Link></li>
               <li><Link to="/foryou" className={`${styles.navLink} ${location.pathname === '/foryou' ? styles.activeLink : ''}`}>مقترح لك</Link></li>

              <li><Link to="/home2" className={`${styles.navLink} ${location.pathname === '/home2' ? styles.activeLink : ''}`}>الحرفيين</Link></li>
              <li><Link to="/shop" className={`${styles.navLink} ${location.pathname === '/shop' ? styles.activeLink : ''}`}>المتجر</Link></li>
              <li><Link to="/home" className={`${styles.navLink} ${location.pathname === '/home' ? styles.activeLink : ''}`}>المجتمع</Link></li>
              {/* <li><Link to="/" className={`${styles.navLink} ${location.pathname === '/' ? styles.activeLink : ''}`}>الرئيسية</Link></li> */}
            </ul>
          </nav>
        )}

        <div className="flex items-center gap-3 flex-row-reverse">

  {/* المستخدم */}
  {userId ? (
    <UserMenu userName={userName} photo={photo} onLogout={handleLogout} />
  ) : (
    <div className="flex gap-3">
      <Link to="/login" className="bg-[#2E230D] text-white px-4 py-2 rounded-lg hover:bg-[#A68B55]">Login</Link>
      <Link to="/register" className="bg-[#A68B55] text-white px-4 py-2 rounded-lg hover:bg-[#2E230D]">Sign Up</Link>
    </div>
  )}

  {/* السلة */}
  <div
    onClick={() => navigate('/cart')}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-xl text-white cursor-pointer"
  >
    <FaShoppingCart className="text-lg" />
  </div>

  {/* الإشعارات */}
  <NotificationBell />

  {/* الرسائل */}
  <ConversationListDropdown />

  {/* البحث */}
  <div className="relative" ref={searchRef}>
    <div className="flex items-center">
      <input
        type="text"
        placeholder="ابحث عن الحرفيين..."
        className={`transition-all duration-300 ${showSearch ? 'w-64' : 'w-12'} h-10 px-1 py-5 rounded-full border-2 border-[#E6D5B8] bg-white text-black outline-none`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ paddingLeft: '2.5rem' }}
      />
      {!showSearch && (
        <FaSearch
          className="absolute left-4 top-4 text-black cursor-pointer"
          onClick={handleShowSearch}
        />
      )}
    </div>
    {searchResults.length > 0 && (
      <div className="absolute mt-1 w-full bg-white rounded shadow-lg z-50 text-black">
        <ul className="max-h-48 overflow-y-auto">
          {searchResults.map((user) => (
            <li key={user.id} className="px-3 py-2 hover:bg-gray-100">
              <Link to={`/profile/${user.id}`} className="flex items-center gap-2">
                <img
                  src={user.profilePicture || 'https://via.placeholder.com/32'}
                  alt={user.fullName}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span>{user.fullName}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>

</div>


        <FaBars
          className="md:hidden text-2xl cursor-pointer"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && userId && (
        <nav className="absolute top-24 right-0 w-full bg-[#5D4037] md:hidden z-40">
          <ul className="flex flex-col text-xl items-end p-4 gap-3">
            <li><Link to="/admin" onClick={() => setIsMenuOpen(false)} className={`${styles.navLink} ${location.pathname === '/admin' ? styles.activeLink : ''}`}>المنصة</Link></li>
            <li><Link to="/home2" onClick={() => setIsMenuOpen(false)} className={`${styles.navLink} ${location.pathname === '/home2' ? styles.activeLink : ''}`}>الحرفيين</Link></li>
            <li><Link to="/shop" onClick={() => setIsMenuOpen(false)} className={`${styles.navLink} ${location.pathname === '/shop' ? styles.activeLink : ''}`}>المتجر</Link></li>
            <li><Link to="/home" onClick={() => setIsMenuOpen(false)} className={`${styles.navLink} ${location.pathname === '/home' ? styles.activeLink : ''}`}>المجتمع</Link></li>
            <li><Link to="/" onClick={() => setIsMenuOpen(false)} className={`${styles.navLink} ${location.pathname === '/' ? styles.activeLink : ''}`}>الرئيسية</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}