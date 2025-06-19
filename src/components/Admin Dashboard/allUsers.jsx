import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { TokenContext } from '../../Context/TokenContext';
import {
  FaArrowLeft, FaUsers, FaTrash, FaUser, FaCalendar, FaSpinner,
  FaEye, FaNewspaper, FaHammer, FaUserFriends, FaCheckCircle,
  FaTimesCircle, FaSearch, FaCrown, FaUserCheck, FaChevronLeft,
  FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight
} from "react-icons/fa";

export default function UsersManagement() {
  const { token } = useContext(TokenContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError('الرجاء تسجيل الدخول لعرض المستخدمين.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
        const res = await fetch(`https://ourheritage.runasp.net/api/Statistics/users?pageIndex=${pageIndex}&pageSize=${pageSize}${searchParam}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (data.isSucceeded) {
          setUsers(data.model.items);
          setTotalPages(data.model.totalPages);
          setTotalItems(data.model.totalItems);
        } else {
          setError('فشل في جلب المستخدمين');
        }
      } catch (err) {
        console.error('خطأ أثناء جلب المستخدمين:', err);
        setError('خطأ أثناء جلب المستخدمين');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pageIndex, pageSize, token, searchTerm]);

  const handleDelete = async (userId) => {
    if (!token) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        setDeleteLoading(userId);
        setError(null);

        const res = await fetch(`https://ourheritage.runasp.net/api/Users/${userId}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });

        if (res.ok) {
          setUsers(prev => prev.filter(user => user.userId !== userId));
          setTotalItems(prev => prev - 1);

          const successMsg = document.createElement('div');
          successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          successMsg.textContent = 'تم حذف المستخدم بنجاح';
          document.body.appendChild(successMsg);
          setTimeout(() => {
            if (document.body.contains(successMsg)) {
              document.body.removeChild(successMsg);
            }
          }, 3000);
        } else {
          const errorText = await res.text();
          setError(`فشل الحذف - كود الخطأ: ${res.status} (${res.statusText})`);
          console.error('تفاصيل الخطأ:', errorText);
        }
      } catch (err) {
        console.error('خطأ أثناء الحذف:', err);
        setError('حدث خطأ أثناء الحذف، تحقق من الاتصال بالإنترنت أو الخادم');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const getUserActivityLevel = (articleCount, handiCraftCount) => {
    const totalContent = articleCount + handiCraftCount;
    if (totalContent >= 10) return { level: 'نشط جداً', color: 'text-green-600 bg-green-100', icon: FaCrown };
    if (totalContent >= 5) return { level: 'نشط', color: 'text-blue-600 bg-blue-100', icon: FaUserCheck };
    if (totalContent >= 1) return { level: 'متوسط', color: 'text-yellow-600 bg-yellow-100', icon: FaUser };
    return { level: 'مبتدئ', color: 'text-gray-600 bg-gray-100', icon: FaEye };
  };

  const handleSearch = () => {
    setPageIndex(1);
  };

  // Pagination functions
  const goToFirstPage = () => setPageIndex(1);
  const goToLastPage = () => setPageIndex(totalPages);
  const goToPreviousPage = () => setPageIndex(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setPageIndex(prev => Math.min(totalPages, prev + 1));
  const goToPage = (page) => setPageIndex(page);

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, pageIndex - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-600">
          <FaSpinner className="animate-spin text-2xl" />
          <span className="text-lg">جاري تحميل المستخدمين...</span>
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
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FaArrowLeft /> العودة للداشبورد
            </button>
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
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-white p-3 rounded-xl shadow hover:shadow-md transition"
            >
              <FaArrowLeft className="text-blue-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaUsers className="text-blue-600" />
                إدارة المستخدمين
              </h1>
              <p className="text-gray-600 mt-1">
                عرض وإدارة جميع المستخدمين - إجمالي {totalItems} مستخدم
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="البحث عن مستخدم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              بحث
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-right text-sm font-semibold text-gray-700">المستخدم</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">البريد الإلكتروني</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">المقالات</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">الحرف</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">مستوى النشاط</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const activity = getUserActivityLevel(user.articleCount, user.handiCraftCount);
                  const ActivityIcon = activity.icon;

                  return (
                    <tr
                      key={user.userId}
                      className="border-b hover:bg-blue-50 transition"
                    >
                      <Link
                        to={`/users/${user.userId}`}
                        className="contents"
                      >
                        <td className="p-4 flex items-center gap-2 cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            {user.profilePicture !== 'default.jpg' ? (
                              <img src={user.profilePicture} className="w-full h-full object-cover" />
                            ) : <FaUser className="text-gray-500 w-full h-full p-2" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{user.userName}</h4>
                            <p className="text-sm text-gray-500">ID: {user.userId}</p>
                          </div>
                        </td>
                        <td className="p-4 text-center text-sm text-gray-600 cursor-pointer">{user.email}</td>
                        <td className="p-4 text-center text-sm text-green-700 cursor-pointer">{user.articleCount}</td>
                        <td className="p-4 text-center text-sm text-orange-700 cursor-pointer">{user.handiCraftCount}</td>
                        <td className="p-4 text-center cursor-pointer">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${activity.color}`}>
                            <ActivityIcon className="inline mr-1" />
                            {activity.level}
                          </span>
                        </td>
                      </Link>
                      <td className="p-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(user.userId);
                          }}
                          disabled={deleteLoading === user.userId}
                          className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                          title="حذف المستخدم"
                        >
                          {deleteLoading === user.userId ? (
                            <FaSpinner className="animate-spin" />
                          ) : <FaTrash />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t">
              <div className="flex items-center justify-between">
                {/* Results Info */}
                <div className="text-sm text-gray-600">
                  عرض {((pageIndex - 1) * pageSize) + 1} - {Math.min(pageIndex * pageSize, totalItems)} من {totalItems} مستخدم
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  {/* First Page */}
                  <button
                    onClick={goToFirstPage}
                    disabled={pageIndex === 1}
                    className={`p-2 rounded-lg ${
                      pageIndex === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    title="الصفحة الأولى"
                  >
                    <FaAngleDoubleRight />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={pageIndex === 1}
                    className={`p-2 rounded-lg ${
                      pageIndex === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    title="الصفحة السابقة"
                  >
                    <FaChevronRight />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPaginationNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors ${
                          page === pageIndex
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={goToNextPage}
                    disabled={pageIndex === totalPages}
                    className={`p-2 rounded-lg ${
                      pageIndex === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    title="الصفحة التالية"
                  >
                    <FaChevronLeft />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={goToLastPage}
                    disabled={pageIndex === totalPages}
                    className={`p-2 rounded-lg ${
                      pageIndex === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    title="الصفحة الأخيرة"
                  >
                    <FaAngleDoubleLeft />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}