import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaSearch } from 'react-icons/fa'; // استيراد أيقونة البحث
import axios from 'axios';

function MessagingDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // لحفظ المستخدم المختار
  const [showSearch, setShowSearch] = useState(false); // إضافة حالة لعرض أو إخفاء أيقونة البحث

  useEffect(() => {
    axios.get('https://ourheritage.runasp.net/api/Users?PageIndex=1&PageSize=10')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.trim()); // استخدام trim لإزالة المسافات الزائدة
  };

  const handleSendMessage = () => {
    alert('ارسال رسالة');
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user); // تحديث المستخدم المختار
    setIsOpen(false); // غلق القائمة بعد اختيار المستخدم
  };

  const handleShowSearch = () => {
    setShowSearch(!showSearch); // تغيير حالة إظهار البحث
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-gray-800 text-white rounded-full flex items-center"
      >
        <FaEnvelope className="text-lg" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded z-50">
          <div className="p-2 font-bold border-b">الرسائل</div>
          <button
            onClick={handleSendMessage}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            إرسال رسالة
          </button>

          {/* مربع البحث */}
          <div className="p-2 relative">
            <input
              type="text"
              placeholder="ابحث عن الحرفيين..."
              className={`transition-all duration-300 w-52 h-10 px-1 py-5 rounded-full border-2 border-[#E6D5B8] bg-white text-black outline-none`}
              value={searchQuery}
              onChange={handleSearch}
              style={{ paddingLeft: '2.5rem' }}
            />
            {!showSearch && (
              <FaSearch
                className="absolute left-4 top-4 text-black cursor-pointer"
                onClick={handleShowSearch}
              />
            )}
            <ul className="max-h-60 overflow-y-auto">
              {users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                <li
                  key={user.id}
                  className="border-b hover:bg-gray-100 px-4 py-2 cursor-pointer"
                  onClick={() => handleSelectUser(user)} // فتح الشات مع المستخدم
                >
                  {user.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* عرض المحادثة مع المستخدم المحدد */}
      {selectedUser && (
        <div className="mt-4 p-4 bg-white shadow-lg rounded-lg w-64">
          <h3 className="font-bold mb-2">{selectedUser.name}</h3>
          <div className="border-t pt-2">
            <p>هنا يمكنك بدء محادثة مع {selectedUser.name}.</p>
            {/* مكان إرسال الرسائل */}
            <textarea placeholder="اكتب رسالتك هنا..." className="w-full p-2 border rounded mt-2"></textarea>
            <button className="w-full bg-blue-500 text-white p-2 rounded mt-2">إرسال</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagingDropdown;
