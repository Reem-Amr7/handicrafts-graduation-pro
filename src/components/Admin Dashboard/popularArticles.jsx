import { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../../Context/TokenContext';
import { Link } from 'react-router-dom';
import {
  FaArrowLeft, FaNewspaper, FaHeart, FaComment, FaStar,
  FaTrash, FaUser, FaCalendar, FaSpinner, FaEye, FaFire
} from "react-icons/fa";
import axios from 'axios';

export default function PopularArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const { token } = useContext(TokenContext);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!token) {
        setError('الرجاء تسجيل الدخول لعرض المقالات.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`https://ourheritage.runasp.net/api/Statistics/popular-articles?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (res.data.isSucceeded) {
          setArticles(res.data.model.items);
          setTotalPages(res.data.model.totalPages);
          setTotalItems(res.data.model.totalItems);
        } else {
          setError('فشل في جلب المقالات');
        }
      } catch (err) {
        console.error('خطأ أثناء جلب المقالات:', err);
        setError('خطأ أثناء جلب المقالات');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [pageIndex, pageSize, token]);

  const handleDelete = async (id) => {
    if (!token) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    if (window.confirm('هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        setDeleteLoading(id);
        const res = await axios.delete(`https://ourheritage.runasp.net/api/Articles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (res.status === 200) {
          setArticles(prev => prev.filter(article => article.id !== id));
          setTotalItems(prev => prev - 1);
          setError(null);
          
          // Show success message
          const successMsg = document.createElement('div');
          successMsg.className = 'fixed top-4 right-4 bg-[#52796f] text-white px-6 py-3 rounded-lg shadow-lg z-50';
          successMsg.textContent = 'تم حذف المقال بنجاح';
          document.body.appendChild(successMsg);
          setTimeout(() => document.body.removeChild(successMsg), 3000);
        } else {
          setError(`فشل الحذف. الكود: ${res.status}`);
        }
      } catch (err) {
        console.error('خطأ أثناء الحذف:', err);
        if (err.response) {
          setError(`خطأ: ${err.response.status} - ${err.response.data?.message || 'حدث خطأ أثناء الحذف.'}`);
        } else {
          setError("فشل الاتصال بالخادم أثناء محاولة الحذف.");
        }
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const getPopularityLevel = (likes, comments, favorites) => {
    const totalEngagement = likes + comments + favorites;
    if (totalEngagement >= 100) return { level: 'عالي جداً', color: 'text-[#52796f] bg-[#52796f]/10', icon: FaFire };
    if (totalEngagement >= 50) return { level: 'عالي', color: 'text-[#b08968] bg-[#b08968]/10', icon: FaEye };
    if (totalEngagement >= 20) return { level: 'متوسط', color: 'text-[#9c6644] bg-[#9c6644]/10', icon: FaStar };
    return { level: 'منخفض', color: 'text-[#6e4c2f] bg-[#6e4c2f]/10', icon: FaNewspaper };
  };

  const getRankIcon = (index) => {
    if (index === 0) return <FaFire className="text-[#a44a3f] text-lg" />;
    if (index === 1) return <FaStar className="text-[#b08968] text-lg" />;
    if (index === 2) return <FaEye className="text-[#52796f] text-lg" />;
    return <span className="text-[#5e3c23] font-bold">#{index + 1}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-[#fefaf4] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#b08968]">
          <FaSpinner className="animate-spin text-2xl" />
          <span className="text-lg">جاري تحميل المقالات...</span>
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
            <Link to="/admin" className="mt-4 inline-flex items-center gap-2 bg-[#b08968] text-white px-4 py-2 rounded-lg hover:bg-[#a7724e]">
              <FaArrowLeft /> العودة للداشبورد
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-24 p-8 bg-[#fefaf4]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="bg-[#f5eee6] p-3 rounded-xl shadow hover:shadow-md transition border border-[#e0c9b9]">
              <FaArrowLeft className="text-[#b08968]" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#5e3c23] flex items-center gap-3">
                <FaNewspaper className="text-[#52796f]" />
                المقالات الأكثر شعبية
              </h1>
              <p className="text-[#6e4c2f] mt-1">
                إدارة وعرض المقالات الأكثر تفاعلاً - إجمالي {totalItems} مقال
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#f5eee6] rounded-xl shadow p-6 border border-[#e0c9b9]">
            <div className="flex items-center gap-4">
              <FaNewspaper className="text-[#52796f] text-3xl" />
              <div>
                <h3 className="text-[#6e4c2f] text-sm">إجمالي المقالات</h3>
                <p className="text-2xl font-bold text-[#5e3c23]">{totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#f5eee6] rounded-xl shadow p-6 border border-[#e0c9b9]">
            <div className="flex items-center gap-4">
              <FaHeart className="text-[#a44a3f] text-3xl" />
              <div>
                <h3 className="text-[#6e4c2f] text-sm">إجمالي الإعجابات</h3>
                <p className="text-2xl font-bold text-[#5e3c23]">
                  {articles.reduce((sum, article) => sum + article.likeCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#f5eee6] rounded-xl shadow p-6 border border-[#e0c9b9]">
            <div className="flex items-center gap-4">
              <FaComment className="text-[#9c6644] text-3xl" />
              <div>
                <h3 className="text-[#6e4c2f] text-sm">إجمالي التعليقات</h3>
                <p className="text-2xl font-bold text-[#5e3c23]">
                  {articles.reduce((sum, article) => sum + article.commentCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#f5eee6] rounded-xl shadow p-6 border border-[#e0c9b9]">
            <div className="flex items-center gap-4">
              <FaStar className="text-[#b08968] text-3xl" />
              <div>
                <h3 className="text-[#6e4c2f] text-sm">إجمالي المفضلة</h3>
                <p className="text-2xl font-bold text-[#5e3c23]">
                  {articles.reduce((sum, article) => sum + article.favoriteCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-[#f5eee6] rounded-xl shadow overflow-hidden border border-[#e0c9b9]">
          <div className="p-6 border-b bg-[#e0c9b9]">
            <h2 className="text-xl font-bold text-[#5e3c23]">قائمة المقالات الأكثر شعبية</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#e0c9b9] border-b border-[#e0c9b9]">
                <tr>
                  <th className="p-4 text-right text-sm font-semibold text-[#5e3c23]">الترتيب</th>
                  <th className="p-4 text-right text-sm font-semibold text-[#5e3c23]">المقال</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">الكاتب</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">الإعجابات</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">التعليقات</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">المفضلة</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">تاريخ الإنشاء</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">مستوى الشعبية</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, index) => {
                  const popularity = getPopularityLevel(article.likeCount, article.commentCount, article.favoriteCount);
                  const globalRank = (pageIndex - 1) * pageSize + index;
                  const PopularityIcon = popularity.icon;
                  
                  return (
                    <tr key={article.id} className="border-b border-[#e0c9b9] hover:bg-[#e0c9b9] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          {getRankIcon(globalRank)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <h4 className="font-semibold text-[#5e3c23] mb-1">{article.title}</h4>
                          <p className="text-sm text-[#6e4c2f]">ID: {article.id}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <FaUser className="text-[#52796f] text-sm" />
                          <span className="font-medium text-[#5e3c23]">{article.creatorName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaHeart className="text-[#a44a3f] text-sm" />
                          <span className="bg-[#a44a3f]/10 text-[#a44a3f] px-2 py-1 rounded-full text-sm font-medium">
                            {article.likeCount}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaComment className="text-[#9c6644] text-sm" />
                          <span className="bg-[#9c6644]/10 text-[#9c6644] px-2 py-1 rounded-full text-sm font-medium">
                            {article.commentCount}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaStar className="text-[#b08968] text-sm" />
                          <span className="bg-[#b08968]/10 text-[#b08968] px-2 py-1 rounded-full text-sm font-medium">
                            {article.favoriteCount}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaCalendar className="text-[#6e4c2f] text-sm" />
                          <span className="text-sm text-[#6e4c2f]">
                            {new Date(article.dateCreated).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <PopularityIcon className="text-sm" />
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${popularity.color}`}>
                            {popularity.level}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={deleteLoading === article.id}
                          className="bg-[#a44a3f] hover:bg-[#8b352d] text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="حذف المقال"
                        >
                          {deleteLoading === article.id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
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
                عرض {((pageIndex - 1) * pageSize) + 1} إلى {Math.min(pageIndex * pageSize, totalItems)} من {totalItems} مقال
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