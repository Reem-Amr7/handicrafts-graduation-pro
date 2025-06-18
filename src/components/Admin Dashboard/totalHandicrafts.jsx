import { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../../Context/TokenContext';
import { Link } from 'react-router-dom';
import {
  FaArrowLeft, FaPalette, FaHeart, FaStar, FaTrash, FaUser, 
  FaCalendar, FaSpinner, FaEye, FaFire, FaHammer
} from "react-icons/fa";

export default function PopularHandicrafts() {
  const [handicrafts, setHandicrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const { token } = useContext(TokenContext);

  useEffect(() => {
    const fetchHandicrafts = async () => {
      if (!token) {
        setError('الرجاء تسجيل الدخول لعرض الحرف اليدوية.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`https://ourheritage.runasp.net/api/Statistics/popular-handicrafts?pageIndex=${pageIndex}&pageSize=${pageSize}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        const data = await res.json();

        if (data.isSucceeded) {
          setHandicrafts(data.model.items);
          setTotalPages(data.model.totalPages);
          setTotalItems(data.model.totalItems);
        } else {
          setError('فشل في جلب الحرف اليدوية');
        }
      } catch (err) {
        console.error('خطأ أثناء جلب الحرف اليدوية:', err);
        setError('خطأ أثناء جلب الحرف اليدوية');
      } finally {
        setLoading(false);
      }
    };

    fetchHandicrafts();
  }, [pageIndex, pageSize, token]);

  const handleDelete = async (id) => {
    if (!token) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    if (window.confirm('هل أنت متأكد من حذف هذه الحرفة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        setDeleteLoading(id);
        const res = await fetch(`https://ourheritage.runasp.net/api/HandiCrafts/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          }
        });

        if (res.ok) {
          setHandicrafts(prev => prev.filter(handicraft => handicraft.id !== id));
          setTotalItems(prev => prev - 1);
          setError(null);
          
          // Show success message
          const successMsg = document.createElement('div');
          successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          successMsg.textContent = 'تم حذف الحرفة بنجاح';
          document.body.appendChild(successMsg);
          setTimeout(() => {
            if (document.body.contains(successMsg)) {
              document.body.removeChild(successMsg);
            }
          }, 3000);
        } else {
          const errorText = await res.text();
          console.error('خطأ في الحذف:', res.status, errorText);
          setError(`فشل الحذف. الكود: ${res.status}`);
        }
      } catch (err) {
        console.error('خطأ أثناء الحذف:', err);
        setError("فشل الاتصال بالخادم أثناء محاولة الحذف. تأكد من الاتصال بالإنترنت.");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const getPopularityLevel = (likes, favorites) => {
    const totalEngagement = likes + favorites;
    if (totalEngagement >= 100) return { level: 'عالي جداً', color: 'text-green-600 bg-green-100', icon: FaFire };
    if (totalEngagement >= 50) return { level: 'عالي', color: 'text-blue-600 bg-blue-100', icon: FaEye };
    if (totalEngagement >= 20) return { level: 'متوسط', color: 'text-yellow-600 bg-yellow-100', icon: FaStar };
    return { level: 'منخفض', color: 'text-gray-600 bg-gray-100', icon: FaPalette };
  };

  const getRankIcon = (index) => {
    if (index === 0) return <FaFire className="text-red-500 text-lg" />;
    if (index === 1) return <FaStar className="text-yellow-500 text-lg" />;
    if (index === 2) return <FaEye className="text-blue-500 text-lg" />;
    return <span className="text-gray-500 font-bold">#{index + 1}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-600">
          <FaSpinner className="animate-spin text-2xl" />
          <span className="text-lg">جاري تحميل الحرف اليدوية...</span>
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
                <FaHammer className="text-blue-600" />
                الحرف اليدوية الأكثر شعبية
              </h1>
              <p className="text-gray-600 mt-1">
                إدارة وعرض الحرف اليدوية الأكثر تفاعلاً - إجمالي {totalItems} حرفة
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <FaHammer className="text-blue-600 text-3xl" />
              <div>
                <h3 className="text-gray-500 text-sm">إجمالي الحرف</h3>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <FaHeart className="text-red-600 text-3xl" />
              <div>
                <h3 className="text-gray-500 text-sm">إجمالي الإعجابات</h3>
                <p className="text-2xl font-bold">
                  {handicrafts.reduce((sum, handicraft) => sum + handicraft.likeCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <FaStar className="text-yellow-600 text-3xl" />
              <div>
                <h3 className="text-gray-500 text-sm">إجمالي المفضلة</h3>
                <p className="text-2xl font-bold">
                  {handicrafts.reduce((sum, handicraft) => sum + handicraft.favoriteCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Handicrafts Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">قائمة الحرف اليدوية الأكثر شعبية</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-right text-sm font-semibold text-gray-700">الترتيب</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-700">الحرفة</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">الحرفي</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">الإعجابات</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">المفضلة</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">تاريخ الإنشاء</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">مستوى الشعبية</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {handicrafts.map((handicraft, index) => {
                  const popularity = getPopularityLevel(handicraft.likeCount, handicraft.favoriteCount);
                  const globalRank = (pageIndex - 1) * pageSize + index;
                  const PopularityIcon = popularity.icon;
                  
                  return (
                    <tr key={handicraft.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          {getRankIcon(globalRank)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">{handicraft.title}</h4>
                          <p className="text-sm text-gray-500">ID: {handicraft.id}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <FaUser className="text-blue-500 text-sm" />
                          <span className="font-medium">{handicraft.creatorName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaHeart className="text-red-500 text-sm" />
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                            {handicraft.likeCount}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaStar className="text-yellow-500 text-sm" />
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                            {handicraft.favoriteCount}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaCalendar className="text-gray-500 text-sm" />
                          <span className="text-sm text-gray-600">
                            {new Date(handicraft.dateCreated).toLocaleDateString('ar-EG')}
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
                          onClick={() => handleDelete(handicraft.id)}
                          disabled={deleteLoading === handicraft.id}
                          className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="حذف الحرفة"
                        >
                          {deleteLoading === handicraft.id ? (
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
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                عرض {((pageIndex - 1) * pageSize) + 1} إلى {Math.min(pageIndex * pageSize, totalItems)} من {totalItems} حرفة
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