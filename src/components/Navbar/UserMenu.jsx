// src/components/UserMenu.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserMenu({ userName, photo, onLogout }) {
    const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

 

  return (
    <div className="relative">
      {/* الصورة فقط */}
      <div
        onClick={() => setShowMenu((prev) => !prev)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#E6D5B8] cursor-pointer"
      >
        <img src={photo} alt="الصورة الشخصية" className="w-full h-full object-cover" />
      </div>

      {/* المنيو المنسدلة */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 text-right">
          <div className="px-4 py-2 text-[#5D4037] border-b">{userName || "الاسم"}</div>
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
}
