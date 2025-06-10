import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';

export default function ConversationListDropdown() {
  return (
    <div className="relative">
      <Link to="/chat">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer text-white">
          <FaEnvelope className="text-lg" />
        </div>
      </Link>
    </div>
  );
}
