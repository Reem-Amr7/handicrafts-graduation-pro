import React, { useEffect, useState, useContext, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import { TokenContext } from "../../Context/TokenContext";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { token } = useContext(TokenContext);
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          'https://ourheritage.runasp.net/api/Notification?page=1&pageSize=10',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: 'text/plain'
            }
          }
        );
        if (res.data.success && res.data.data) {
          const items = res.data.data.items || [];
          setNotifications(items);
          const unread = items.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("فشل جلب الإشعارات:", error);
      }
    };

    if (token) fetchNotifications();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0); // عند الفتح صفر العداد
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={handleToggle}
        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer text-gray-800 cursor-pointer transition duration-150"
      >
        <FaBell className="text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-md">
            {unreadCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-xl z-50">
          <div className="p-4 border-b font-semibold text-gray-800">الإشعارات</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-center text-gray-500">لا توجد إشعارات</div>
          ) : (
            <ul>
              {notifications.map((notif, idx) => (
                <li
                  key={idx}
                  className={`flex flex-col px-4 py-3 text-sm border-b hover:bg-gray-50 transition-all duration-150 ${
                    notif.isRead ? 'text-gray-500' : 'font-semibold text-black'
                  }`}
                >
                  <span>{notif.message}</span>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="p-3 text-center text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition">
            عرض كل الإشعارات
          </div>
        </div>
      )}
    </div>
  );
}
