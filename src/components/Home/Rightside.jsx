// src/components/RightSidebar.jsx
import {
  FaHashtag,
  FaTrophy,
  FaQuestionCircle,
  FaTag,
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPen
} from 'react-icons/fa';

const RightSidebar = () => {
  // استبدلي بالقيم الحقيقية جايه من اليوزر
  const userProfile = {
    name: 'إريك جونسون',
    username: 'erik_johnson',
    profilePicture: 'https://via.placeholder.com/100',
    email: 'erik.johnson@example.com',
    location: 'الرياض، السعودية'
  };

  const popularTopics = [
    'أدوات الحرف',
    'ورش للمبتدئين',
    'تلميع النحاس',
    'التسويق',
    'معارض الحرف',
    'إصلاح الأدوات'
  ];

  const currentContests = [
    { title: 'مسابقة أفضل قطعة خزفية', date: 'ينتهي في 30 يونيو' },
    { title: 'تحدي السجاد التقليدي', date: 'ينتهي في 15 يوليو' }
  ];

  return (
    <div className="community-sidebar left-sidebar w-[270px] order-2 lg:order-1 flex flex-col gap-4">
      
      {/* ——— Profile Card ——— */}
      <div className="sidebar-card bg-white rounded-lg shadow-md p-4 mb-4 border-t-4 border-[#B22222] h-80">
        <h3 className="text-sm mb-3 text-[#8B4513] flex items-center">
          <FaUser className="mr-2 text-[#D2B48C]" /> الملف الشخصي
        </h3>
        <div className="flex items-center mb-4">
          <img
            src={userProfile.profilePicture}
            alt="الصورة الشخصية"
            className="w-16 h-16 rounded-full border-2 border-[#B22222] object-cover"
          />
          <div className="mr-3">
            <h4 className="text-[#5C4033] font-semibold">{userProfile.name}</h4>
            <p className="text-xs text-gray-500">@{userProfile.username}</p>
          </div>
        </div>
        <div className="space-y-1 text-xs text-[#8B4513] mb-4">
          <p className="flex items-center">
            <FaEnvelope className="ml-1" /> {userProfile.email}
          </p>
          <p className="flex items-center">
            <FaMapMarkerAlt className="ml-1" /> {userProfile.location}
          </p>
        </div>
        <button className="flex items-center justify-center w-full py-2 border-2 border-[#8B4513] text-[#8B4513] rounded-md text-xs font-semibold transition hover:bg-[#8B4513] hover:text-white">
          <FaPen className="ml-2" /> تعديل الملف الشخصي
        </button>
      </div>

      {/* ——— Popular Topics ——— */}
      <div className="sidebar-card bg-white rounded-lg shadow-md p-4 mb-4 border-t-4 border-[#B22222] h-72">
        <h3 className="text-sm mb-3 text-[#8B4513] flex items-center">
          <FaHashtag className="mr-2 text-[#D2B48C]" /> مواضيع شائعة
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularTopics.map((topic, i) => (
            <span
              key={i}
              className="flex items-center bg-[#fcfcfb] text-[#5C4033] px-3 py-1 rounded-full text-xs border"
            >
              <FaTag className="ml-1 text-[#A0522D]" /> {topic}
            </span>
          ))}
        </div>
      </div>

      {/* ——— Current Contests ——— */}
      <div className="sidebar-card bg-white rounded-lg shadow-md p-4 mb-4 border-t-4 border-[#B22222] h-80">
        <h3 className="text-sm mb-3 text-[#8B4513] flex items-center">
          <FaTrophy className="mr-2 text-[#D2B48C]" /> المسابقات الحالية
        </h3>
        <div className="space-y-3">
          {currentContests.map((c, i) => (
            <div key={i} className="bg-[#f9f9f1] p-2 rounded-md border-r-4 border-[#B22222]">
              <h4 className="text-xs text-[#5C4033] mb-1">{c.title}</h4>
              <p className="text-xs text-[#8B4513] mb-2">{c.date}</p>
              <button className="w-full text-xs font-semibold py-1 border-2 border-[#CD7F32] rounded-md transition hover:bg-[#CD7F32] hover:text-white">
                شارك الآن
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ——— Community Help ——— */}
      <div className="sidebar-card bg-white rounded-lg shadow-md p-4 mb-4 border-t-4 border-[#B22222] h-80">
        <h3 className="text-sm mb-3 text-[#8B4513] flex items-center">
          <FaQuestionCircle className="mr-2 text-[#D2B48C]" /> مساعدة المجتمع
        </h3>
        <p className="text-xs text-gray-600 mb-3">
          لديك سؤال أو تحتاج مساعدة؟ فريقنا جاهز لدعمك في أي استفسار.
        </p>
        <button className="w-full py-2 text-xs font-semibold bg-[#8B4513] text-white rounded-md transition hover:bg-[#9E5739]">
          تواصل مع الدعم
        </button>
      </div>

    </div>
  );
};

export default RightSidebar;
