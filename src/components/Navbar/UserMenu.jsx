import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/User Context"; // تأكد من المسار الصحيح

const UserMenu = ({ photo, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();
  const { fullName, isLoading } = useUser(); // استخدام fullName و isLoading
  const userId = localStorage.getItem("userId");

  // تحقق من بيانات الـ fullName و isLoading
  console.log("Full Name:", fullName); // تحقق من fullName
  console.log("Is Loading:", isLoading); // تحقق من isLoading

  // إغلاق القائمة عند النقر خارجها
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  // الذهاب إلى الصفحة الشخصية
  const goToProfile = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
      setShowMenu(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* صورة المستخدم */}
      <div
        onClick={() => setShowMenu((prev) => !prev)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#E6D5B8] cursor-pointer"
      >
        <img
          src={photo}
          alt="الصورة الشخصية"
          className="w-full h-full object-cover"
        />
      </div>

      {/* القائمة المنسدلة */}
      {showMenu && (
        <div
          className="fixed z-50 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg text-right"
          style={{
            left: "1rem",
            top: "4.5rem",
          }}
        >
          <button
            onClick={goToProfile}
            className="w-full text-right px-4 py-2 text-[#5D4037] font-semibold border-b hover:bg-gray-100"
          >
            {isLoading ? "جاري التحميل..." : fullName || "الملف الشخصي"}
          </button>
          <button
            onClick={onLogout}
            className="w-full text-right px-4 py-2 text-red-600 hover:bg-red-50"
          >
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
