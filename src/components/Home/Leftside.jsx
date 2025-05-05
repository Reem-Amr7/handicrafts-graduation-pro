import React, { useState, useEffect,useContext } from 'react';

import { FaFilter, FaStar, FaCalendarAlt } from 'react-icons/fa';
import { FaPaintBrush, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import { TokenContext } from "../../Context/TokenContext";

const LeftSidebar = () => {
  const [activeCraftFilter, setActiveCraftFilter] = useState('الكل');
  const [activePostFilter, setActivePostFilter] = useState('الكل');
  const [followedCraftsmen, setFollowedCraftsmen] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const { token } = useContext(TokenContext);

  // بيانات ورش العمل (يمكنك استبدالها بالبيانات الحقيقية أو جلبها من API)
  const workshops = [
    { title: 'فن الخزف التقليدي', date: '15 يونيو | 8 مساءً' },
    { title: 'نقش النحاس للمبتدئين', date: '22 يونيو | 7 مساءً' }
  ];

  const craftFilters = ['الكل', 'الخزف', 'السجاد', 'النحاس', 'النسيج', 'الخشب'];
  const postFilters = ['الكل', 'أعمال نهائية', 'أسئلة', 'تصنيع', 'نصائح'];

  // جلب الأصدقاء المقترحين من API
  useEffect(() => {
    const fetchSuggestedFriends = async () => {
      try {
  
        const res = await axios.get('https://ourheritage.runasp.net/api/Users/suggested-friends', {
          headers: {
            accept: '*/*',
            Authorization: `Bearer ${token}`
          },
        });
        setSuggestedFriends(res.data);
        console.log("البيانات:", res.data);
        
        setSuggestedFriends(res.data);
      } catch (error) {
        console.error("خطأ في جلب الأصدقاء المقترحين:", error);
      }
    };
  
    fetchSuggestedFriends();
  }, []);
  

  const toggleFollow = (id) => {
    if (followedCraftsmen.includes(id)) {
      setFollowedCraftsmen(followedCraftsmen.filter(item => item !== id));
    } else {
      setFollowedCraftsmen([...followedCraftsmen, id]);
    }
  };

  return (
    <div className="community-sidebar left-sidebar w-[270px] order-2 lg:order-1 flex flex-col gap-4">
      {/* Filter Card */}
      <div className="sidebar-card bg-white rounded shadow-md p-3 border-t-4 border-[#A0522D]">
        <h3 className="sidebar-title text-base mb-3 text-[#8B4513] relative pb-2 flex items-center">
          <FaFilter className="mr-2 text-[#D2B48C]" />
          تصفية المحتوى
        </h3>
        
        <div className="filter-options">
          <div className="filter-group mb-3">
            <h4 className="mb-2 text-[#5C4033] text-sm flex items-center">
              <FaPaintBrush className="mr-1 text-sm text-[#A0522D]" />
              فئات الحرف
            </h4>
            <div className="filter-tags flex flex-wrap gap-2 mt-2">
              {craftFilters.map(filter => (
                <span 
                  key={filter}
                  className={`filter-tag bg-[#fcfcfb] px-3 py-1 rounded-full text-xs cursor-pointer transition border hover:bg-[#8B4513] hover:text-white hover:border-[#8B4513] ${activeCraftFilter === filter ? 'bg-[#8B4513] text-white border-[#8B4513]' : ''}`}
                  onClick={() => setActiveCraftFilter(filter)}
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>
          
          <div className="filter-group mb-3">
            <h4 className="mb-2 text-[#5C4033] text-sm flex items-center">
              <FaFileAlt className="mr-1 text-sm text-[#A0522D]" />
              نوع المنشور
            </h4>
            <div className="filter-tags flex flex-wrap gap-2 mt-2">
              {postFilters.map(filter => (
                <span 
                  key={filter}
                  className={`filter-tag bg-[#fcfcfb] px-3 py-1 rounded-full text-xs cursor-pointer transition border hover:bg-[#8B4513] hover:text-white hover:border-[#8B4513] ${activePostFilter === filter ? 'bg-[#8B4513] text-white border-[#8B4513]' : ''}`}
                  onClick={() => setActivePostFilter(filter)}
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Suggested Friends Card */}
      <div className="sidebar-card bg-white rounded shadow-md p-3 border-t-4 border-[#A0522D]">
        <h3 className="sidebar-title text-base mb-3 text-[#8B4513] relative pb-2 flex items-center">
          <FaStar className="mr-2 text-[#D2B48C]" />
          أصدقاء مقترحون
        </h3>
        
        <div className="trending-craftsmen flex flex-col gap-2">
          {suggestedFriends.length === 0 ? (
            <p className="text-xs text-center text-gray-500">لا توجد أصدقاء مقترحون حالياً</p>
          ) : (
            suggestedFriends.map(friend => (
              <div key={friend.id} className="craftsman-card flex items-center p-2 rounded transition border hover:bg-[#f0f0e0] hover:-translate-y-[2px]">
              <img
  src={friend.profilePicture ? friend.profilePicture : '/default-avatar.png'}
  alt={`${friend.firstName} ${friend.lastName}`}
  className="w-8 h-8 rounded-full object-cover mr-2 border-2 border-[#D2B48C]"
  loading="lazy"
/>

<div className="flex-1  ">
<h4 className="text-black font-semibold text-sm">
        {friend.fullName || `${friend.firstName} ${friend.lastName}`}
      </h4>

  <p className="text-xs text-red-500">
    {friend.skills && friend.skills.length > 0 ? friend.skills[0] : 'حرفة غير محددة'}
  </p>
</div>


                <button 
                  className={`follow-btn px-3 py-1 rounded-full text-xs cursor-pointer transition border ${followedCraftsmen.includes(friend.id) ? 'bg-[#8B4513] text-white' : 'bg-transparent text-[#8B4513] border-[#8B4513]'}`}
                  onClick={() => toggleFollow(friend.id)}
                >
                  {followedCraftsmen.includes(friend.id) ? 'متابع' : 'تابع'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Workshops Card */}
      <div className="sidebar-card bg-white rounded shadow-md p-3 border-t-4 border-[#A0522D]">
        <h3 className="sidebar-title text-base mb-3 text-[#8B4513] relative pb-2 flex items-center">
          <FaCalendarAlt className="mr-2 text-[#D2B48C]" />
          ورش قادمة
        </h3>
        
        {workshops.map((workshop, index) => (
          <div key={index} className="workshop-item bg-[#f9f9f1] p-3 rounded mb-2 border-r-4 border-[#B22222]">
            <h4 className="text-xs mb-1 text-[#5C4033]">{workshop.title}</h4>
            <p className="workshop-date text-xs text-[#8B4513] mb-1">{workshop.date}</p>
            <button className="btn btn-outline bg-transparent border-2 border-[#CD7F32] text-[#CD7F32] px-2 py-1 rounded text-xs font-semibold shadow-md transition hover:bg-[#CD7F32] hover:text-[#F5F5DC]">
              سجل الآن
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
