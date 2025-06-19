import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TokenContext } from '../../Context/TokenContext';
import {
  FaArrowLeft, FaSpinner, FaNewspaper, FaHammer, FaChartBar,
  FaHeart, FaComment, FaStar, FaUserFriends, FaUserPlus, FaCalendarAlt
} from "react-icons/fa";

export default function UserActivityDetails() {
  const { userId } = useParams();
  const { token } = useContext(TokenContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [userName, setUserName] = useState('');
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const fetchUserActivity = async () => {
      if (!token) {
        setError('الرجاء تسجيل الدخول لعرض نشاط المستخدم.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `https://ourheritage.runasp.net/api/Statistics/user-activity/${userId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: '*/*',
            },
          }
        );

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (data.isSucceeded) {
          setActivities(data.model.items);
          setTotalPages(data.model.totalPages);
          setTotalItems(data.model.totalItems);
          setPageIndex(data.model.pageIndex);
        } else {
          setError('فشل في جلب نشاط المستخدم');
        }
      } catch (err) {
        console.error('خطأ أثناء جلب نشاط المستخدم:', err);
        setError('خطأ أثناء جلب نشاط المستخدم');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserStats = async () => {
      try {
        const res = await fetch(`https://ourheritage.runasp.net/api/Statistics/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: '*/*',
          },
        });
        const data = await res.json();
        if (data?.isSucceeded) {
          setUserStats(data.model);
          setUserName(data.model.userName);
        }
      } catch (e) {
        console.error('فشل في جلب إحصائيات المستخدم', e);
      }
    };

    fetchUserActivity();
    fetchUserStats();
  }, [userId, pageIndex, pageSize, token]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-600">
          <FaSpinner className="animate-spin text-2xl" />
          <span className="text-lg">جاري تحميل نشاط المستخدم...</span>
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
            <Link
              to="/users"
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FaArrowLeft /> العودة إلى إدارة المستخدمين
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/users"
              className="bg-white p-3 rounded-xl shadow hover:shadow-md transition"
            >
              <FaArrowLeft className="text-blue-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaChartBar className="text-blue-600" />
                تفاصيل نشاط المستخدم: {userName || `ID: ${userId}`}
              </h1>
              <p className="text-gray-600 mt-1">
                عرض جميع الأنشطة - إجمالي {totalItems} نشاط
              </p>
            </div>
          </div>
        </div>

        {userStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={<FaNewspaper />} label="المقالات" value={userStats.totalArticles} />
            <StatCard icon={<FaHammer />} label="الحرف" value={userStats.totalHandiCrafts} />
            <StatCard icon={<FaHeart />} label="الإعجابات المستلمة" value={userStats.totalLikesReceived} />
            <StatCard icon={<FaComment />} label="التعليقات المستلمة" value={userStats.totalCommentsReceived} />
            <StatCard icon={<FaStar />} label="المفضلات المستلمة" value={userStats.totalFavoritesReceived} />
            <StatCard icon={<FaUserFriends />} label="المتابِعون" value={userStats.followersCount} />
            <StatCard icon={<FaUserPlus />} label="يتابع" value={userStats.followingCount} />
            <StatCard icon={<FaCalendarAlt />} label="عضو منذ" value={new Date(userStats.memberSince).toLocaleDateString('ar-EG')} />
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">سجل النشاط</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">معرف النشاط</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">العنوان</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">النوع</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">التاريخ</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">التفاعل</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-center text-sm text-gray-600">{activity.id}</td>
                    <td className="p-4 text-center text-sm text-gray-800">{activity.title}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {activity.type === 'Article' ? (
                          <FaNewspaper className="text-green-500 text-sm" />
                        ) : (
                          <FaHammer className="text-orange-500 text-sm" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.type === 'Article' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {activity.type === 'Article' ? 'مقال' : 'حرفة يدوية'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-sm text-gray-600">
                      {new Date(activity.date).toLocaleString('ar-EG')}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {activity.engagement}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                عرض {((pageIndex - 1) * pageSize) + 1} إلى {Math.min(pageIndex * pageSize, totalItems)} من {totalItems} نشاط
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

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <div className="text-blue-600 text-2xl mb-2 flex justify-center">{icon}</div>
      <div className="text-lg font-semibold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}
