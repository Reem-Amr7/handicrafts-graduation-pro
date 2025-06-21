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
          successMsg.className = 'fixed top-4 right-4 bg-[#52796f] text-white px-6 py-3 rounded-lg shadow-lg z-50';
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
    if (totalContent >= 10) return { level: 'نشط جداً', color: 'text-[#52796f] bg-[#52796f]/10', icon: FaCrown };
    if (totalContent >= 5) return { level: 'نشط', color: 'text-[#b08968] bg-[#b08968]/10', icon: FaUserCheck };
    if (totalContent >= 1) return { level: 'متوسط', color: 'text-[#9c6644] bg-[#9c6644]/10', icon: FaUser };
    return { level: 'مبتدئ', color: 'text-[#6e4c2f] bg-[#6e4c2f]/10', icon: FaEye };
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
      <div className="min-h-screen p-8 bg-[#fefaf4] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#b08968]">
          <FaSpinner className="animate-spin text-2xl" />
          <span className="text-lg">جاري تحميل المستخدمين...</span>
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
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-4 inline-flex items-center gap-2 bg-[#b08968] text-white px-4 py-2 rounded-lg hover:bg-[#a7724e]"
            >
              <FaArrowLeft /> العودة للداشبورد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 mt-24 bg-[#fefaf4]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/admin"
              className="bg-[#f5eee6] p-3 rounded-xl shadow hover:shadow-md transition border border-[#e0c9b9]"
            >
              <FaArrowLeft className="text-[#b08968]" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#5e3c23] flex items-center gap-3">
                <FaUsers className="text-[#b08968]" />
                إدارة المستخدمين
              </h1>
              <p className="text-[#6e4c2f] mt-1">
                عرض وإدارة جميع المستخدمين - إجمالي {totalItems} مستخدم
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6e4c2f]" />
              <input
                type="text"
                placeholder="البحث عن مستخدم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#f5eee6] border border-[#e0c9b9] rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#b08968] text-[#5e3c23]"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-[#b08968] text-white px-4 py-2 rounded-lg hover:bg-[#a7724e] transition-colors"
            >
              بحث
            </button>
          </div>
        </div>

        <div className="bg-[#f5eee6] rounded-xl shadow overflow-hidden border border-[#e0c9b9]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#e0c9b9] border-b border-[#e0c9b9]">
                <tr>
                  <th className="p-4 text-right text-sm font-semibold text-[#5e3c23]">المستخدم</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">البريد الإلكتروني</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">المقالات</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">الحرف</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">مستوى النشاط</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const activity = getUserActivityLevel(user.articleCount, user.handiCraftCount);
                  const ActivityIcon = activity.icon;

                  return (
                    <tr
                      key={user.userId}
                      className="border-b border-[#e0c9b9] hover:bg-[#e0c9b9] transition"
                    >
                      <Link
                        to={`/users/${user.userId}`}
                        className="contents"
                      >
                        <td className="p-4 flex items-center gap-2 cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-[#e0c9b9] overflow-hidden">
                            {user.profilePicture !== 'default.jpg' ? (
                              <img src={user.profilePicture} className="w-full h-full object-cover" />
                            ) : <FaUser className="text-[#6e4c2f] w-full h-full p-2" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#5e3c23]">{user.userName}</h4>
                            <p className="text-sm text-[#6e4c2f]">ID: {user.userId}</p>
                          </div>
                        </td>
                        <td className="p-4 text-center text-sm text-[#6e4c2f] cursor-pointer">{user.email}</td>
                        <td className="p-4 text-center text-sm text-[#52796f] cursor-pointer">{user.articleCount}</td>
                        <td className="p-4 text-center text-sm text-[#a44a3f] cursor-pointer">{user.handiCraftCount}</td>
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
                          className="bg-[#a44a3f] hover:bg-[#8b352d] text-white p-2 rounded-lg transition-colors disabled:opacity-50"
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
            <div className="bg-[#e0c9b9] px-6 py-4 border-t border-[#e0c9b9]">
              <div className="flex items-center justify-between">
                {/* Results Info */}
                <div className="text-sm text-[#5e3c23]">
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
                        ? 'text-[#e0c9b9] cursor-not-allowed' 
                        : 'text-[#5e3c23] hover:bg-[#f5eee6]'
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
                        ? 'text-[#e0c9b9] cursor-not-allowed' 
                        : 'text-[#5e3c23] hover:bg-[#f5eee6]'
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
                            ? 'bg-[#b08968] text-white'
                            : 'text-[#5e3c23] hover:bg-[#f5eee6]'
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
                        ? 'text-[#e0c9b9] cursor-not-allowed' 
                        : 'text-[#5e3c23] hover:bg-[#f5eee6]'
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
                        ? 'text-[#e0c9b9] cursor-not-allowed' 
                        : 'text-[#5e3c23] hover:bg-[#f5eee6]'
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