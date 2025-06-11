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
      if (!token) return;

      try {
        // Fetch general notifications
        const notifRes = await axios.get(
          'https://ourheritage.runasp.net/api/Notification?page=1&pageSize=10',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: 'text/plain'
            }
          }
        );
        let notifItems = [];
        if (notifRes.data.success && notifRes.data.data) {
          notifItems = (notifRes.data.data.items || []).map(n => ({
            id: n.id,
            message: n.message,
            createdAt: n.createdAt,
            isRead: n.isRead,
            type: 'general'
          }));
          console.log("General Notifications:", notifItems);
        }

        // Fetch unread chat messages
        const unreadRes = await axios.get(
          'https://ourheritage.runasp.net/api/Chat/unread?page=1&pageSize=10',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: 'application/json'
            }
          }
        );
        const messageNotifs = (unreadRes.data.unreadMessages?.items || []).map(msg => ({
          id: msg.id,
          message: `${msg.sender?.firstName || 'Unknown'}: ${msg.content.slice(0, 50)}${msg.content.length > 50 ? '...' : ''}`,
          createdAt: msg.sentAt || new Date().toISOString(),
          isRead: false,
          type: 'message',
          conversationId: msg.conversationId
        }));
        console.log("Message Notifications:", messageNotifs);

        // Merge and sort by createdAt (newest first)
        const allNotifs = [...messageNotifs, ...notifItems].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Filter out locally marked notifications
        const readIds = JSON.parse(localStorage.getItem('readNotificationIds') || '[]');
        const filteredNotifs = allNotifs.filter(n => !readIds.includes(n.id));
        setNotifications(filteredNotifs);

        // Calculate unread count
        const unread = filteredNotifs.filter(n => !n.isRead).length;
        setUnreadCount(unread);
        console.log("Filtered Notifications:", filteredNotifs, "Unread Count:", unread);
      } catch (error) {
        console.error("فشل جلب الإشعارات:", error.response?.data || error.message);
      }
    };

    fetchNotifications();
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

  const handleToggle = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Mark all notifications as read
      try {
        // Assume API to mark all notifications as read
        /*
        await axios.post(
          'https://ourheritage.runasp.net/api/Notification/mark-all-as-read',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: 'application/json'
            }
          }
        );
        */
        // Fallback: Store read IDs in localStorage
        const readIds = [...new Set([...notifications.map(n => n.id), ...JSON.parse(localStorage.getItem('readNotificationIds') || '[]')])];
        localStorage.setItem('readNotificationIds', JSON.stringify(readIds));
        setUnreadCount(0);
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        console.log("Marked notifications as read:", readIds);
      } catch (error) {
        console.error("فشل تحديد الإشعارات كمقروءة:", error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={handleToggle}
        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition duration-150"
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
          <div className="p-4 border-b font-semibold text-[#894414]" style={{ backgroundColor: '#F5F5DC' }}>
            الإشعارات
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-center text-gray-500">لا توجد إشعارات</div>
          ) : (
            <ul>
              {notifications.map((notif, idx) => (
                <li
                  key={notif.id || idx}
                  className={`flex flex-col px-4 py-3 text-sm border-b hover:bg-gray-50 transition-all duration-150 ${
                    notif.isRead ? 'text-gray-500' : 'font-semibold text-[#894414]'
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
          <div className="p-3 text-center text-[#894414] hover:text-[#6b3310] hover:underline cursor-pointer transition">
            عرض كل الإشعارات
          </div>
        </div>
      )}
    </div>
  );
}