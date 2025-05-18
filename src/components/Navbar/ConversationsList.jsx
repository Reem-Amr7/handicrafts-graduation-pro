// components/ConversationListDropdown.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../../Context/TokenContext';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
export default function ConversationListDropdown() {
  const { token } = useContext(TokenContext);
  const [conversations, setConversations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (token) {
      axios.get('https://ourheritage.runasp.net/api/Chat/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setConversations(res.data.items);

      }).catch(err => {
        console.error('خطأ في جلب المحادثات:', err);
      });
    }
  }, [token]);

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer text-white"
      >
<FaEnvelope className="text-lg" />      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded z-50">
          <div className="p-2 font-bold border-b">محادثاتك</div>
          {conversations.length === 0 ? (
            <div className="p-2 text-sm">لا توجد محادثات</div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {conversations.map(conv => (
                <li key={conv.id} className="border-b hover:bg-gray-100">
                  <Link
                    to={`/messages/${conv.id}`}
                    className="block px-3 py-2"
                  >
                    {conv.participantName || 'مستخدم'}
                  </Link>
                </li>
              ))}
              
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
