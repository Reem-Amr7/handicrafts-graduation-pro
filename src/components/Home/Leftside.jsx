import { FaFilter, FaStar, FaCalendarAlt } from 'react-icons/fa';
import { FaPaintBrush, FaFileAlt } from 'react-icons/fa';
import { useState } from 'react';

const LeftSidebar = () => {
  const [activeCraftFilter, setActiveCraftFilter] = useState('الكل');
  const [activePostFilter, setActivePostFilter] = useState('الكل');
  const [followedCraftsmen, setFollowedCraftsmen] = useState([]);

  const craftsmen = [
    { id: 1, name: 'سعاد محمد', craft: 'حرفية سجاد يدوي', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 2, name: 'محمد العتيبي', craft: 'حرفي خزف', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 3, name: 'فاطمة الخليفة', craft: 'حرفية سعف النخيل', img: 'https://randomuser.me/api/portraits/women/22.jpg' }
  ];

  const workshops = [
    { title: 'فن الخزف التقليدي', date: '15 يونيو | 8 مساءً' },
    { title: 'نقش النحاس للمبتدئين', date: '22 يونيو | 7 مساءً' }
  ];

  const craftFilters = ['الكل', 'الخزف', 'السجاد', 'النحاس', 'النسيج', 'الخشب'];
  const postFilters = ['الكل', 'أعمال نهائية', 'أسئلة', 'تصنيع', 'نصائح'];

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
  
  {/* Craftsmen Card */}
  <div className="sidebar-card bg-white rounded shadow-md p-3 border-t-4 border-[#A0522D]">
    <h3 className="sidebar-title text-base mb-3 text-[#8B4513] relative pb-2 flex items-center">
      <FaStar className="mr-2 text-[#D2B48C]" />
      حرفيون مميزون
    </h3>
    
    <div className="trending-craftsmen flex flex-col gap-2">
      {craftsmen.map(craftsman => (
        <div key={craftsman.id} className="craftsman-card flex items-center p-2 rounded transition border hover:bg-[#f0f0e0] hover:-translate-y-[2px]">
          <img src={craftsman.img} alt={craftsman.name} className="craftsman-img w-8 h-8 rounded-full object-cover mr-2 border-2 border-[#D2B48C]" />
          <div className="craftsman-info flex-1 overflow-hidden">
            <h4 className="text-xs mb-0 truncate">{craftsman.name}</h4>
            <p className="text-xs text-gray-500">{craftsman.craft}</p>
          </div>
          <button 
            className={`follow-btn px-3 py-1 rounded-full text-xs cursor-pointer transition border ${followedCraftsmen.includes(craftsman.id) ? 'bg-[#8B4513] text-white' : 'bg-transparent text-[#8B4513] border-[#8B4513]'}`}
            onClick={() => toggleFollow(craftsman.id)}
          >
            {followedCraftsmen.includes(craftsman.id) ? 'متابع' : 'تابع'}
          </button>
        </div>
      ))}
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
