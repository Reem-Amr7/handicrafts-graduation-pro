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
      <div className="min-h-screen p-8 bg-[#fefaf4] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#b08968]">
          <FaSpinner className="animate-spin text-2xl" />
          <span className="text-lg">جاري تحميل نشاط المستخدم...</span>
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
            <Link
              to="/users"
              className="mt-4 inline-flex items-center gap-2 bg-[#b08968] text-white px-4 py-2 rounded-lg hover:bg-[#a7724e]"
            >
              <FaArrowLeft /> العودة إلى إدارة المستخدمين
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-24 p-8 bg-[#fefaf4]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/users"
              className="bg-[#f5eee6] p-3 rounded-xl shadow hover:shadow-md transition border border-[#e0c9b9]"
            >
              <FaArrowLeft className="text-[#b08968]" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#5e3c23] flex items-center gap-3">
                <FaChartBar className="text-[#b08968]" />
                تفاصيل نشاط المستخدم: {userName || `ID: ${userId}`}
              </h1>
              <p className="text-[#6e4c2f] mt-1">
                عرض جميع الأنشطة - إجمالي {totalItems} نشاط
              </p>
            </div>
          </div>
        </div>

        {userStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard icon={<FaNewspaper className="text-[#52796f]" />} label="المقالات" value={userStats.totalArticles} />
            <StatCard icon={<FaHammer className="text-[#a44a3f]" />} label="الحرف" value={userStats.totalHandiCrafts} />
            <StatCard icon={<FaHeart className="text-[#b08968]" />} label="الإعجابات المستلمة" value={userStats.totalLikesReceived} />
            <StatCard icon={<FaComment className="text-[#9c6644]" />} label="التعليقات المستلمة" value={userStats.totalCommentsReceived} />
            <StatCard icon={<FaStar className="text-[#6e4c2f]" />} label="المفضلات المستلمة" value={userStats.totalFavoritesReceived} />
            <StatCard icon={<FaUserFriends className="text-[#52796f]" />} label="المتابِعون" value={userStats.followersCount} />
            <StatCard icon={<FaUserPlus className="text-[#a44a3f]" />} label="يتابع" value={userStats.followingCount} />
            <StatCard icon={<FaCalendarAlt className="text-[#b08968]" />} label="عضو منذ" value={new Date(userStats.memberSince).toLocaleDateString('ar-EG')} />
          </div>
        )}

        <div className="bg-[#f5eee6] rounded-xl shadow overflow-hidden border border-[#e0c9b9]">
          <div className="p-6 border-b bg-[#e0c9b9]">
            <h2 className="text-xl font-bold text-[#5e3c23]">سجل النشاط</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#e0c9b9] border-b border-[#e0c9b9]">
                <tr>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">معرف النشاط</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">العنوان</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">النوع</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">التاريخ</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">التفاعل</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id} className="border-b border-[#e0c9b9] hover:bg-[#e0c9b9] transition-colors">
                    <td className="p-4 text-center text-sm text-[#6e4c2f]">{activity.id}</td>
                    <td className="p-4 text-center text-sm text-[#5e3c23]">{activity.title}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {activity.type === 'Article' ? (
                          <FaNewspaper className="text-[#52796f] text-sm" />
                        ) : (
                          <FaHammer className="text-[#a44a3f] text-sm" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.type === 'Article' ? 'bg-[#52796f]/10 text-[#52796f]' : 'bg-[#a44a3f]/10 text-[#a44a3f]'
                        }`}>
                          {activity.type === 'Article' ? 'مقال' : 'حرفة يدوية'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-sm text-[#6e4c2f]">
                      {new Date(activity.date).toLocaleString('ar-EG')}
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-[#b08968]/10 text-[#b08968] px-2 py-1 rounded-full text-sm font-medium">
                        {activity.engagement}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-[#e0c9b9] border-t border-[#e0c9b9]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#5e3c23]">
                عرض {((pageIndex - 1) * pageSize) + 1} إلى {Math.min(pageIndex * pageSize, totalItems)} من {totalItems} نشاط
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

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-[#f5eee6] p-4 rounded-xl shadow text-center border border-[#e0c9b9]">
      <div className="text-2xl mb-2 flex justify-center">{icon}</div>
      <div className="text-lg font-semibold text-[#5e3c23]">{value}</div>
      <div className="text-sm text-[#6e4c2f] mt-1">{label}</div>
    </div>
  );
}