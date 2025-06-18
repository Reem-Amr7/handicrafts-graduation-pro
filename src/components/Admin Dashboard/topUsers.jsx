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
    if (score >= 80) return { level: 'عالي جداً', color: 'text-green-600 bg-green-100' };
    if (score >= 60) return { level: 'عالي', color: 'text-blue-600 bg-blue-100' };
    if (score >= 40) return { level: 'متوسط', color: 'text-yellow-600 bg-yellow-100' };
    return { level: 'منخفض', color: 'text-red-600 bg-red-100' };
  };

  const getRankIcon = (index) => {
    if (index === 0) return <FaCrown className="text-yellow-500 text-lg" />;
    if (index === 1) return <FaCrown className="text-gray-400 text-lg" />;
    if (index === 2) return <FaCrown className="text-yellow-600 text-lg" />;
    return <span className="text-gray-500 font-bold">#{index + 1}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-600">
          <FaSpinner className="animate-spin text-2xl" />
          <span className="text-lg">جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-800 mb-2">حدث خطأ</h2>
            <p className="text-red-600">{error}</p>
            <Link to="/" className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <FaArrowLeft /> العودة للداشبورد
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="bg-white p-3 rounded-xl shadow hover:shadow-md transition">
              <FaArrowLeft className="text-blue-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaCrown className="text-yellow-500" />
                أكثر المستخدمين نشاطاً
              </h1>
              <p className="text-gray-600 mt-1">
                إجمالي {totalItems} مستخدم نشط
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <FaUsers className="text-blue-600 text-3xl" />
              <div>
                <h3 className="text-gray-500 text-sm">إجمالي المستخدمين</h3>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <FaNewspaper className="text-green-600 text-3xl" />
              <div>
                <h3 className="text-gray-500 text-sm">إجمالي المقالات</h3>
                <p className="text-2xl font-bold">
                  {users.reduce((sum, user) => sum + user.articleCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <FaHeart className="text-red-600 text-3xl" />
              <div>
                <h3 className="text-gray-500 text-sm">إجمالي الإعجابات</h3>
                <p className="text-2xl font-bold">
                  {users.reduce((sum, user) => sum + user.totalLikes, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <FaUserFriends className="text-purple-600 text-3xl" />
              <div>
                <h3 className="text-gray-500 text-sm">إجمالي المتابعين</h3>
                <p className="text-2xl font-bold">
                  {users.reduce((sum, user) => sum + user.followersCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">قائمة أكثر المستخدمين نشاطاً</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-right text-sm font-semibold text-gray-700">الترتيب</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-700">المستخدم</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">المقالات</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">الحرف</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">الإعجابات</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">المتابعين</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">درجة النشاط</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">مستوى النشاط</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const activity = getActivityLevel(user.activityScore);
                  const globalRank = (pageIndex - 1) * pageSize + index;
                  
                  return (
                    <tr key={user.userId} className="border-b hover:bg-gray-50 transition-colors">
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
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-800">{user.userName}</h4>
                            <p className="text-sm text-gray-500">ID: {user.userId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {user.articleCount}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {user.handiCraftCount}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaHeart className="text-red-500 text-sm" />
                          <span className="font-medium">{user.totalLikes}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaUserFriends className="text-blue-500 text-sm" />
                          <span className="font-medium">{user.followersCount}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaChartLine className="text-purple-500 text-sm" />
                          <span className="font-bold text-lg text-purple-700">
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
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                عرض {((pageIndex - 1) * pageSize) + 1} إلى {Math.min(pageIndex * pageSize, totalItems)} من {totalItems} مستخدم
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageIndex(prev => Math.max(prev - 1, 1))}
                  disabled={pageIndex === 1}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
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
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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