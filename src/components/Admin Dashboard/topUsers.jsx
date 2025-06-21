import { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../../Context/TokenContext';
import { Link } from 'react-router-dom';
import {
  FaArrowLeft, FaCrown, FaHeart, FaNewspaper, FaUsers,
  FaUserFriends, FaChartLine, FaSpinner
} from "react-icons/fa";
import axios from 'axios';

export default function TopUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { token } = useContext(TokenContext);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError('الرجاء تسجيل الدخول لعرض المستخدمين.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`https://ourheritage.runasp.net/api/Statistics/top-users?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.isSucceeded) {
          setUsers(res.data.model.items);
          setTotalPages(res.data.model.totalPages);
          setTotalItems(res.data.model.totalItems);
        } else {
          setError('فشل في جلب المستخدمين');
        }
      } catch (err) {
        console.error('خطأ أثناء جلب المستخدمين:', err);
        setError('حدث خطأ أثناء جلب المستخدمين.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pageIndex, pageSize, token]);

  const getActivityLevel = (score) => {
    if (score >= 80) return { level: 'عالي جداً', color: 'text-[#52796f] bg-[#52796f]/10' };
    if (score >= 60) return { level: 'عالي', color: 'text-[#b08968] bg-[#b08968]/10' };
    if (score >= 40) return { level: 'متوسط', color: 'text-[#9c6644] bg-[#9c6644]/10' };
    return { level: 'منخفض', color: 'text-[#a44a3f] bg-[#a44a3f]/10' };
  };

  const getRankIcon = (index) => {
    if (index === 0) return <FaCrown className="text-[#b08968] text-lg" />;
    if (index === 1) return <FaCrown className="text-[#6e4c2f] text-lg" />;
    if (index === 2) return <FaCrown className="text-[#9c6644] text-lg" />;
    return <span className="text-[#5e3c23] font-bold">#{index + 1}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-[#fefaf4] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#b08968]">
          <FaSpinner className="animate-spin text-2xl" />
          <span className="text-lg">جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-[#fefaf4]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#a44a3f]/10 border border-[#a44a3f] rounded-xl p-6 text-center">
            <div className="text-[#a44a3f] text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-[#5e3c23] mb-2">حدث خطأ</h2>
            <p className="text-[#a44a3f]">{error}</p>
            <Link to="/" className="mt-4 inline-flex items-center gap-2 bg-[#b08968] text-white px-4 py-2 rounded-lg hover:bg-[#a7724e]">
              <FaArrowLeft /> العودة للداشبورد
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  mt-24 p-8 bg-[#fefaf4]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="bg-[#f5eee6] p-3 rounded-xl shadow hover:shadow-md transition border border-[#e0c9b9]">
              <FaArrowLeft className="text-[#b08968]" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#5e3c23] flex items-center gap-3">
                <FaCrown className="text-[#b08968]" />
                أكثر المستخدمين نشاطاً
              </h1>
              <p className="text-[#6e4c2f] mt-1">
                إجمالي {totalItems} مستخدم نشط
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#f5eee6] rounded-xl shadow p-6 border border-[#e0c9b9]">
            <div className="flex items-center gap-4">
              <FaUsers className="text-[#52796f] text-3xl" />
              <div>
                <h3 className="text-[#6e4c2f] text-sm">إجمالي المستخدمين</h3>
                <p className="text-2xl font-bold text-[#5e3c23]">{totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#f5eee6] rounded-xl shadow p-6 border border-[#e0c9b9]">
            <div className="flex items-center gap-4">
              <FaNewspaper className="text-[#52796f] text-3xl" />
              <div>
                <h3 className="text-[#6e4c2f] text-sm">إجمالي المقالات</h3>
                <p className="text-2xl font-bold text-[#5e3c23]">
                  {users.reduce((sum, user) => sum + user.articleCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#f5eee6] rounded-xl shadow p-6 border border-[#e0c9b9]">
            <div className="flex items-center gap-4">
              <FaHeart className="text-[#a44a3f] text-3xl" />
              <div>
                <h3 className="text-[#6e4c2f] text-sm">إجمالي الإعجابات</h3>
                <p className="text-2xl font-bold text-[#5e3c23]">
                  {users.reduce((sum, user) => sum + user.totalLikes, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#f5eee6] rounded-xl shadow p-6 border border-[#e0c9b9]">
            <div className="flex items-center gap-4">
              <FaUserFriends className="text-[#9c6644] text-3xl" />
              <div>
                <h3 className="text-[#6e4c2f] text-sm">إجمالي المتابعين</h3>
                <p className="text-2xl font-bold text-[#5e3c23]">
                  {users.reduce((sum, user) => sum + user.followersCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#f5eee6] rounded-xl shadow overflow-hidden border border-[#e0c9b9]">
          <div className="p-6 border-b bg-[#e0c9b9]">
            <h2 className="text-xl font-bold text-[#5e3c23]">قائمة أكثر المستخدمين نشاطاً</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#e0c9b9] border-b border-[#e0c9b9]">
                <tr>
                  <th className="p-4 text-right text-sm font-semibold text-[#5e3c23]">الترتيب</th>
                  <th className="p-4 text-right text-sm font-semibold text-[#5e3c23]">المستخدم</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">المقالات</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">الحرف</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">الإعجابات</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">المتابعين</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">درجة النشاط</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">مستوى النشاط</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const activity = getActivityLevel(user.activityScore);
                  const globalRank = (pageIndex - 1) * pageSize + index;
                  
                  return (
                    <tr key={user.userId} className="border-b border-[#e0c9b9] hover:bg-[#e0c9b9] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          {getRankIcon(globalRank)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profilePicture.startsWith("http") ? 
                              user.profilePicture : 
                              "http://ourheritage.runasp.net/File/ProfilePicture/default.jpg"
                            }
                            alt={user.userName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#e0c9b9]"
                          />
                          <div>
                            <h4 className="font-semibold text-[#5e3c23]">{user.userName}</h4>
                            <p className="text-sm text-[#6e4c2f]">ID: {user.userId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-[#52796f]/10 text-[#52796f] px-3 py-1 rounded-full text-sm font-medium">
                          {user.articleCount}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-[#b08968]/10 text-[#b08968] px-3 py-1 rounded-full text-sm font-medium">
                          {user.handiCraftCount}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaHeart className="text-[#a44a3f] text-sm" />
                          <span className="font-medium text-[#5e3c23]">{user.totalLikes}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaUserFriends className="text-[#9c6644] text-sm" />
                          <span className="font-medium text-[#5e3c23]">{user.followersCount}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaChartLine className="text-[#6e4c2f] text-sm" />
                          <span className="font-bold text-lg text-[#5e3c23]">
                            {user.activityScore}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${activity.color}`}>
                          {activity.level}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 bg-[#e0c9b9] border-t border-[#e0c9b9]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#5e3c23]">
                عرض {((pageIndex - 1) * pageSize) + 1} إلى {Math.min(pageIndex * pageSize, totalItems)} من {totalItems} مستخدم
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageIndex(prev => Math.max(prev - 1, 1))}
                  disabled={pageIndex === 1}
                  className="bg-[#f5eee6] border border-[#e0c9b9] text-[#5e3c23] px-4 py-2 rounded-lg hover:bg-[#e0c9b9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  السابق
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setPageIndex(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          pageIndex === page
                            ? 'bg-[#b08968] text-white'
                            : 'bg-[#f5eee6] border border-[#e0c9b9] text-[#5e3c23] hover:bg-[#e0c9b9]'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setPageIndex(prev => Math.min(prev + 1, totalPages))}
                  disabled={pageIndex === totalPages}
                  className="bg-[#f5eee6] border border-[#e0c9b9] text-[#5e3c23] px-4 py-2 rounded-lg hover:bg-[#e0c9b9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}