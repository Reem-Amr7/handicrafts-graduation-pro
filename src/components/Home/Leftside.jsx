import React, { useState, useEffect, useContext } from 'react';
import { FaFilter, FaStar, FaCalendarAlt, FaPaintBrush } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TokenContext } from '../../Context/TokenContext';
import { CategoryContext } from '../../Context/CategoryContext';

const LeftSidebar = () => {
  const [followedCraftsmen, setFollowedCraftsmen] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [categories, setCategories] = useState(['الكل']);
  const [error, setError] = useState(null);
  const [followMessage, setFollowMessage] = useState({});
  const { token } = useContext(TokenContext);
  const { selectedCategory, setSelectedCategory } = useContext(CategoryContext);
  const currentUserId = localStorage.getItem('userId');

  const workshops = [
    { title: 'فن الخزف التقليدي', date: '15 يونيو | 8 مساءً' },
    { title: 'نقش النحاس للمبتدئين', date: '22 يونيو | 7 مساءً' },
  ];

  useEffect(() => {
    const fetchSuggestedFriends = async () => {
      try {
        const res = await axios.get('https://ourheritage.runasp.net/api/Users/suggested-friends', {
          headers: {
            accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        });
        setSuggestedFriends(res.data);
      } catch (error) {
        console.error('خطأ في جلب الأصدقاء المقترحين:', error);
        setError('خطأ في جلب الأصدقاء المقترحين. حاول مرة أخرى لاحقًا.');
      }
    };

    if (token) {
      fetchSuggestedFriends();
    }
  }, [token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://ourheritage.runasp.net/api/Categories', {
          params: { PageIndex: 1, PageSize: 100 },
          headers: { accept: 'text/plain', Authorization: `Bearer ${token}` },
        });
        const fetchedCategories = res.data.items.map((category) => category.name);
        setCategories(['الكل', ...fetchedCategories]);
      } catch (error) {
        console.error('خطأ في جلب الفئات:', error);
        setError('خطأ في جلب الفئات. حاول مرة أخرى لاحقًا.');
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token]);

  const handleToggleFollow = async (friendId) => {
    if (!friendId || !token || !currentUserId) {
      setError('معرف المستخدم أو التوكن غير صالح.');
      return;
    }

    const isFollowing = followedCraftsmen.includes(friendId);
    const previousFollowedCraftsmen = [...followedCraftsmen];

    setFollowedCraftsmen(
      isFollowing
        ? followedCraftsmen.filter((id) => id !== friendId)
        : [...followedCraftsmen, friendId]
    );

    try {
      const endpoint = isFollowing
        ? `https://ourheritage.runasp.net/api/Follow/unfollow/${parseInt(currentUserId)}/${parseInt(friendId)}`
        : `https://ourheritage.runasp.net/api/Follow/follow`;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const body = { followerId: parseInt(currentUserId), followingId: parseInt(friendId) };

      const response = isFollowing
        ? await axios.delete(endpoint, { ...config, data: body })
        : await axios.post(endpoint, body, config);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Unexpected response status');
      }

      if (!isFollowing) {
        setFollowMessage((prev) => ({ ...prev, [friendId]: 'تمت المتابعة' }));
        setTimeout(() => {
          setFollowMessage((prev) => ({ ...prev, [friendId]: undefined }));
        }, 2000);
      }

      setError(null);
    } catch (err) {
      console.error('Follow/Unfollow error:', err);
      setFollowedCraftsmen(previousFollowedCraftsmen);

      if (err.response?.status === 400 && err.response?.data?.message === 'You are already following this user.') {
        setFollowedCraftsmen([...followedCraftsmen, friendId]);
      } else if (err.response?.status === 400 && err.response?.data?.message === 'Follower or following user not found.') {
        setError('المستخدم المتابع أو المستخدم الذي يتم متابعته غير موجود.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'طلب غير صالح. تحقق من المعرف.');
      } else if (err.response?.status === 401) {
        setError('غير مصرح. تأكد من تسجيل الدخول.');
      } else {
        setError('حدث خطأ أثناء تحديث حالة المتابعة. حاول مرة أخرى لاحقًا.');
      }
    }
  };

  return (
    <div className="community-sidebar left-sidebar w-[270px] order-2 lg:order-1 flex flex-col gap-4">
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

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
              {categories.map((category) => (
                <span
                  key={category}
                  className={`filter-tag bg-[#fcfcfb] px-3 py-1 rounded-full text-xs cursor-pointer transition border hover:bg-[#8B4513] hover:text-white hover:border-[#8B4513] ${
                    selectedCategory === category ? 'bg-[#8B4513] border-[#8B4513]' : ''
                  }`}
                  onClick={() => setSelectedCategory(category)} // يتم التغيير هنا فقط
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Friends */}
      <div className="sidebar-card bg-white rounded shadow-md p-3 border-t-4 border-[#A0522D] mt-4">
        <h3 className="sidebar-title text-base mb-3 text-[#8B4513] relative pb-2 flex items-center">
          <FaStar className="mr-2 text-[#D2B48C]" />
          أصدقاء مقترحون
        </h3>
        <div className="trending-craftsmen flex flex-col gap-2">
          {suggestedFriends.length === 0 ? (
            <p className="text-xs text-center text-gray-500">لا توجد أصدقاء مقترحون حالياً</p>
          ) : (
            suggestedFriends.map((friend) => (
              <div
                key={friend.id}
                className="craftsman-card flex items-center p-2 rounded transition border hover:bg-[#f0f0e0] hover:-translate-y-[2px]"
              >
                <img
                  src={friend.profilePicture || '/default-avatar.png'}
                  alt={`${friend.fullName || `${friend.firstName} ${friend.lastName}`}`}
                  className="w-8 h-8 rounded-full object-cover mr-2 border-2 border-[#D2B48C]"
                  loading="lazy"
                />
                <div className="flex-1">
                  <Link to={`/profile/${friend.id}`}>
                    <h4 className="text-black font-semibold text-sm hover:text-[#8B4513] transition-colors">
                      {friend.fullName || `${friend.firstName} ${friend.lastName}`}
                    </h4>
                  </Link>
                  <p className="text-xs text-red-500">
                    {friend.skills && friend.skills.length > 0 ? friend.skills[0] : 'حرفة غير محددة'}
                  </p>
                </div>
                <button
                  className={`follow-btn px-3 py-1 rounded-full text-xs cursor-pointer transition border ${
                    followMessage[friend.id]
                      ? 'bg-green-600 text-white border-green-600'
                      : followedCraftsmen.includes(friend.id)
                      ? 'bg-[#8B4513] text-white border-[#8B4513]'
                      : 'bg-transparent text-[#8B4513] border-[#8B4513]'
                  }`}
                  onClick={() => handleToggleFollow(friend.id)}
                >
                  {followMessage[friend.id] || (followedCraftsmen.includes(friend.id) ? 'متابع' : 'تابع')}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

     
    </div>
  );
};

export default LeftSidebar;
