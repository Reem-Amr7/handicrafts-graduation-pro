import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaQuestionCircle } from 'react-icons/fa';
import { TokenContext } from '../../Context/TokenContext';

const RightSidebar = () => {
  const [crafts, setCrafts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const { token } = useContext(TokenContext);

  useEffect(() => {
    const fetchCrafts = async () => {
      try {
        const response = await axios.get(
          'https://ourheritage.runasp.net/api/HandiCrafts?PageIndex=1&PageSize=10',
          {
            headers: {
              Accept: 'text/plain',
              Authorization: `Bearer ${token}`
            }
          }
        );
        setCrafts(response.data.items);
      } catch (error) {
        console.error("فشل تحميل المنتجات:", error);
      }
    };

    fetchCrafts();
  }, [token]);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [crafts]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === crafts.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div className="community-sidebar right-sidebar w-[270px] order-3 lg:order-3 flex flex-col gap-4 ">

      {/* —— قسم مساعدة المجتمع —— */}
      <div className="sidebar-card bg-white rounded-xl shadow-lg p-5 mb-4 border-t-4 border-[#B22222]">
        <h3 className="text-base mb-3 text-[#8B4513] font-bold flex items-center">
          <FaQuestionCircle className="ml-2 text-[#D2B48C]" />
          مساعدة المجتمع
        </h3>
        <p className="text-sm text-gray-700 mb-6">
          عندك فكرة ومش لاقي مين ينفذها؟ إحنا هنرشحلك الحرفيين اللي يحققوها بإبداع!
        </p>
        <p className="text-sm text-gray-700 font-semibold mt-4 mb-3">
            "ابحث عن الحرفي المناسب بوصف بسيط!"
          </p>
        <Link to="/recommend">
          <button className="w-full py-2 mt-2 text-sm font-semibold bg-[#8B4513] text-white rounded-md transition hover:bg-[#9E5739] shadow">
            ابدأ الآن!
          </button>
        </Link>
      </div>

      {/* —— سلايدر منتجات —— */}
      {crafts.length > 0 && (
        <div className="sidebar-card bg-white rounded-xl shadow-lg p-4 border-t-4 border-[#2E8B57] flex flex-col items-center h-[460px]">
          <h3 className="text-base mb-3 text-[#2E8B57] font-bold">منتجات مقترحة</h3>

          <div
            className="relative w-full flex items-center justify-center"
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
          >
            <Link to={`/product-details/${crafts[currentIndex]?.id}`}>

              <img
                src={crafts[currentIndex]?.imageOrVideo[0]}
                alt={crafts[currentIndex]?.title}
                className="w-full h-[350px] object-cover rounded cursor-pointer"
              />
            </Link>
          </div>

          <p className="text-sm mt-3 text-center font-semibold text-[#444]">
            {crafts[currentIndex]?.title}
          </p>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
