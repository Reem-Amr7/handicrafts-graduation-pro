// Navbar.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  FaHandsHelping,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaSearch,
  FaBell,
  FaEnvelope
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import photo from "../../assets/Screenshot 2025-02-13 210809.png";
import styles from './Navbar.module.css';
import { TokenContext } from "../../Context/TokenContext";
import UserMenu from './UserMenu';
import NotificationBell  from './notifications'
import ConversationListDropdown from './ConversationsList'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const { token } = useContext(TokenContext);
  const navigate = useNavigate();

  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const searchRef = useRef(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    setUserId(storedId);
    setUserName(storedName);
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const inputWidth = showSearch ? 'w-64' : 'w-12';
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

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");

    if (storedId !== userId) setUserId(storedId);
    if (storedName !== userName) setUserName(storedName);
  }, [token]);

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

        {userId && (
          <nav className="hidden md:block">
            <ul className="flex flex-row-reverse gap-6">
              <li><Link to="/recommend" className="hover:bg-white/20 py-1 px-2 rounded">عن المنصة</Link></li>
              <li><Link to="/home2" className="hover:bg-white/20 py-1 px-2 rounded">الحرفيين</Link></li>
              <li><Link to="/shop" className="hover:bg-white/20 py-1 px-2 rounded">المتجر</Link></li>
              <li><Link to="/home" className="hover:bg-white/20 py-1 px-2 rounded">المجتمع</Link></li>
              <li><Link to="/" className="hover:bg-white/20 py-1 px-2 rounded">الرئيسية</Link></li>
            </ul>

          </nav>
        )}

        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="flex items-center gap-3">
          <ConversationListDropdown />

            <NotificationBell />

            <div
              onClick={() => navigate('/cart')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-xl text-white cursor-pointer"
            >
              <FaShoppingCart className="text-lg" /> {/* تحديد حجم الأيقونة */}
            </div>

            {userId ? (
              <UserMenu
                userName={userName}
                photo={photo}
                onLogout={handleLogout}
              />
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="bg-[#2E230D] text-white px-4 py-2 rounded-lg hover:bg-[#A68B55] transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-[#A68B55] text-white px-4 py-2 rounded-lg hover:bg-[#2E230D] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* هنا إضافة نفس حجم البحث */}
          <div className="relative" ref={searchRef}>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="ابحث عن الحرفيين..."
                className={`${inputWidth} transition-all duration-300 w-10 h-10 px-1 py-5 rounded-full border-2 border-[#E6D5B8] bg-white text-black outline-none `}
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
          onClick={() => setIsMenuOpen((o) => !o)}
        />
      </div>
    </header>
  );
}
