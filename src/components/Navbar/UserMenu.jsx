import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../Context/User Context"; // تأكدي من المسار

const UserMenu = ({ photo, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const { fullName, isLoading } = useUser();
  const userId = localStorage.getItem("userId");

  // إغلاق القائمة عند النقر خارجها
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  // تسجيل الاستماع للخارج
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          {userId ? (
            <Link
              to={`/profile/${userId}`}
              onClick={() => setShowMenu(false)}
              className="block w-full text-right bg-gray-100 px-4 py-2 text-[#5D4037] font-semibold border-b hover:bg-red-50"
            >
              {isLoading ? "جاري التحميل..." : fullName || "الملف الشخصي"}
            </Link>
          ) : (
            <div className="px-4 py-2 text-red-600 text-sm">خطأ في تحميل المستخدم</div>
          )}

          <button
            onClick={onLogout}
            className="w-full bg-gray-100 text-right px-4 py-2 text-red-600 hover:bg-red-50"
          >
            تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
