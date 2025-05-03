import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  FaHandsHelping,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaSearch
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import photo from "../../assets/Screenshot 2025-02-13 210809.png";
import styles from './Navbar.module.css';
import { TokenContext } from "../../Context/TokenContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const { token } = useContext(TokenContext);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const searchRef = useRef(null);

  // جلب نتائج البحث
  useEffect(() => {
    if (!token || searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    const fetchArtisans = async () => {
      try {
        const res = await axios.get('https://ourheritage.runasp.net/api/Users', {
          params: {
            PageIndex: 1,
            PageSize: 10,
            Search: searchQuery
          },
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

  // إغلاق النتائج عند الضغط خارج مربع البحث
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // عرض مربع البحث عند الضغط على الأيقونة
  const handleShowSearch = () => {
    setShowSearch(true);
  };

  // بناء الـ class الخاص بمربع البحث بناءً على showSearch
  const inputWidth = showSearch ? 'w-64' : 'w-12';

  return (
    <header className="bg-gradient-to-r from-[#8B4513] to-[#5D4037] text-white shadow-md h-24">
      <div className={styles.topBar}>
        <div className="flex items-center ml-6"><span>عربى</span></div>
        <div className="flex items-center"><span>تتبع شحنتك</span></div>
      </div>

      <div className="container mx-auto flex justify-between items-center py-3 px-8 relative">
        <div className="logo flex items-center text-2xl font-bold">
          <FaHandsHelping className="mr-2 text-[#E6D5B8]" />
          <span>تراثنا</span>
        </div>

        {/* مربع البحث */}
        <div className="relative" ref={searchRef}>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="ابحث عن الحرفيين..."
              className={`${inputWidth} transition-all duration-300 p-2 rounded-full border-2 border-[#E6D5B8] bg-white text-black outline-none pl-10`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            {!showSearch && (
              <FaSearch
                className="absolute left-3 text-black cursor-pointer"
                onClick={handleShowSearch}
              />
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="absolute mt-1 w-full bg-white rounded shadow-lg z-50 text-black">
              <ul className="max-h-48 overflow-y-auto">
                {searchResults.map((user) => (
                  <li key={user.id} className="px-3 py-2 hover:bg-gray-100">
                    <Link
                      to={`/profile/${user.id}`}  // التعديل هنا: استخدام user.id بدلاً من userId
                      className="flex items-center gap-2"
                    >
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

        {/* روابط التنقل الرئيسية */}
        <nav
          className={`header-nav ${
            isMenuOpen ? 'block' : 'hidden'
          } md:block absolute md:static w-full md:w-auto top-full left-0 bg-[#5D4037] md:bg-transparent p-4 md:p-0`}
        >
          <ul className="flex flex-col md:flex-row gap-2 md:gap-6">
            <li>
              <Link to="/" className="hover:bg-white/20 py-1 px-2 rounded">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link to="/home" className="hover:bg-white/20 py-1 px-2 rounded">
                المجتمع
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:bg-white/20 py-1 px-2 rounded">
                المتجر
              </Link>
            </li>
            <li>
              <Link to="/LiveStream" className="hover:bg-white/20 py-1 px-2 rounded">
                الورش
              </Link>
            </li>
            <li>
              <Link to="/home2" className="hover:bg-white/20 py-1 px-2 rounded">
                الحرفيين
              </Link>
            </li>
            <li>
              <Link to="/recommend" className="hover:bg-white/20 py-1 px-2 rounded">
                عن المنصة
              </Link>
            </li>
          </ul>
        </nav>

        {/* أيقونات المستخدم */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-xl hover:text-[#E6D5B8]">
            <FaUser />
          </Link>
          <span
            onClick={() => navigate('/cart')}
            className="text-xl hover:text-[#E6D5B8] cursor-pointer"
          >
            <FaShoppingCart />
          </span>
          <div
            onClick={() => userId && navigate(`/profile/${userId}`)}
            className="flex items-center bg-[#E6D5B8] text-[#5D4037] px-3 py-1 rounded-full cursor-pointer"
          >
            <img
              src={photo}
              alt="الصورة الشخصية"
              className="w-8 h-8 rounded-full ml-2"
            />
            <span>{userName || 'الاسم'}</span>
          </div>
        </div>

        {/* أيقونة القائمة للجوال */}
        <FaBars
          className="md:hidden text-2xl cursor-pointer"
          onClick={() => setIsMenuOpen((o) => !o)}
        />
      </div>
    </header>
  );
}