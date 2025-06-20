import { useState, useEffect } from 'react';
// import { TokenContext } from '../../Context/TokenContext';
import {
  FaArrowLeft, FaLayerGroup, FaNewspaper, FaHammer, FaChartBar, 
  FaSpinner, FaFire, FaStar, FaEye, FaPalette, FaCalendar, FaTrash
} from "react-icons/fa";
import { useContext } from "react";
import { TokenContext } from "../../Context/TokenContext";

export default function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Mock token for demo - replace with real token context
const { token } = useContext(TokenContext);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) {
        setError('الرجاء تسجيل الدخول لعرض إحصائيات الفئات.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Mock data for demo - replace with real API call
        const mockData = {
          isSucceeded: true,
          model: {
            pageIndex: 1,
            pageSize: 10,
            totalItems: 10,
            totalPages: 1,
            items: [
              {
                categoryId: 1,
                categoryName: "الدوس",
                articleCount: 9,
                handiCraftCount: 13,
                totalCount: 22
              },
              {
                categoryId: 2,
                categoryName: "Woodworking",
                articleCount: 11,
                handiCraftCount: 6,
                totalCount: 17
              },
              {
                categoryId: 3,
                categoryName: "Embroidery",
                articleCount: 1,
                handiCraftCount: 3,
                totalCount: 4
              },
              {
                categoryId: 4,
                categoryName: "Metalworking",
                articleCount: 0,
                handiCraftCount: 3,
                totalCount: 3
              },
              {
                categoryId: 6,
                categoryName: "Carving",
                articleCount: 3,
                handiCraftCount: 0,
                totalCount: 3
              },
              {
                categoryId: 5,
                categoryName: "Painting",
                articleCount: 1,
                handiCraftCount: 0,
                totalCount: 1
              },
              {
                categoryId: 8,
                categoryName: "Mosaic Art",
                articleCount: 1,
                handiCraftCount: 0,
                totalCount: 1
              },
              {
                categoryId: 7,
                categoryName: "Ceramics",
                articleCount: 0,
                handiCraftCount: 0,
                totalCount: 0
              }
            ]
          }
        };

        // Sort by total count (most popular first)
        const sortedItems = mockData.model.items.sort((a, b) => b.totalCount - a.totalCount);

        setCategories(sortedItems);
        setTotalPages(Math.ceil(sortedItems.length / pageSize));
        setTotalItems(sortedItems.length);
      } catch (err) {
        console.error('خطأ أثناء جلب إحصائيات الفئات:', err);
        setError('خطأ أثناء جلب إحصائيات الفئات');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [pageIndex, pageSize, token]);

  const handleDelete = async (id) => {
    if (!token) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    if (window.confirm('هل أنت متأكد من حذف هذه الفئة؟ سيتم حذف جميع المحتويات المرتبطة بها.')) {
      try {
        setDeleteLoading(id);
        setError(null); // Clear any previous errors
        
        console.log('Attempting to delete category with ID:', id);
        console.log('Using token:', token ? 'Token present' : 'No token');
        
        // Real API call to delete category
        const response = await fetch(`https://ourheritage.runasp.net/api/Categories/${id}`, {
          method: 'DELETE',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (response.ok) {
          // Remove category from local state on successful deletion
          setCategories(prev => prev.filter(category => category.categoryId !== id));
          setTotalItems(prev => prev - 1);
          
          // Show success message
          const successMsg = document.createElement('div');
          successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          successMsg.textContent = 'تم حذف الفئة بنجاح';
          document.body.appendChild(successMsg);
          setTimeout(() => {
            if (document.body.contains(successMsg)) {
              document.body.removeChild(successMsg);
            }
          }, 3000);
        } else {
          // Handle API error response
          let errorMessage = `خطأ ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.text();
            if (errorData) {
              errorMessage += ` - ${errorData}`;
            }
          } catch (e) {
            console.log('Could not read error response:', e);
          }
          console.error('خطأ من الخادم:', errorMessage);
          setError(`فشل في حذف الفئة: ${errorMessage}`);
        }
        
      } catch (err) {
        console.error('خطأ أثناء الحذف:', err);
        
        // More specific error handling
        let errorMessage = "فشل الاتصال بالخادم أثناء محاولة الحذف.";
        
        if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
          errorMessage = "فشل الاتصال بالخادم. تأكد من:\n• الاتصال بالإنترنت\n• صحة الرابط\n• عدم حجب CORS";
        } else if (err.name === 'AbortError') {
          errorMessage = "انتهت مهلة الاتصال. حاول مرة أخرى.";
        } else if (err.message) {
          errorMessage = `خطأ في الطلب: ${err.message}`;
        }
        
        setError(errorMessage);
        
        // For development: show more detailed error
        const errorDetails = document.createElement('div');
        errorDetails.className = 'fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md';
        errorDetails.innerHTML = `
          <div class="font-bold">تفاصيل الخطأ للمطورين:</div>
          <div class="text-sm mt-1">
            <div>النوع: ${err.name}</div>
            <div>الرسالة: ${err.message}</div>
            <div>الرابط: https://ourheritage.runasp.net/api/Categories/${id}</div>
          </div>
        `;
        document.body.appendChild(errorDetails);
        setTimeout(() => {
          if (document.body.contains(errorDetails)) {
            document.body.removeChild(errorDetails);
          }
        }, 10000);
        
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const getPopularityLevel = (totalCount) => {
    if (totalCount >= 20) return { level: 'عالي جداً', color: 'text-green-600 bg-green-100', icon: FaFire };
    if (totalCount >= 10) return { level: 'عالي', color: 'text-blue-600 bg-blue-100', icon: FaEye };
    if (totalCount >= 5) return { level: 'متوسط', color: 'text-yellow-600 bg-yellow-100', icon: FaStar };
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
          <span className="text-lg">جاري تحميل إحصائيات الفئات...</span>
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

  const totalArticles = categories.reduce((sum, category) => sum + category.articleCount, 0);
  const totalHandicrafts = categories.reduce((sum, category) => sum + category.handiCraftCount, 0);
  const totalContent = categories.reduce((sum, category) => sum + category.totalCount, 0);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
                <FaLayerGroup className="text-blue-600" />
                إحصائيات الفئات
              </h1>
              <p className="text-gray-600 mt-1">
                إدارة وعرض إحصائيات الفئات والمحتوى - إجمالي {totalItems} فئة
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <FaLayerGroup className="text-blue-600 text-3xl" />
              <div>
                <h3 className="text-gray-500 text-sm">إجمالي الفئات</h3>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <FaNewspaper className="text-green-600 text-3xl" />
              <div>
                <h3 className="text-gray-500 text-sm">إجمالي المقالات</h3>
                <p className="text-2xl font-bold">{totalArticles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <FaHammer className="text-orange-600 text-3xl" />
              <div>
                <h3 className="text-gray-500 text-sm">إجمالي الحرف</h3>
                <p className="text-2xl font-bold">{totalHandicrafts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <FaChartBar className="text-purple-600 text-3xl" />
              <div>
                <h3 className="text-gray-500 text-sm">إجمالي المحتوى</h3>
                <p className="text-2xl font-bold">{totalContent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">قائمة الفئات وإحصائياتها</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-right text-sm font-semibold text-gray-700">الترتيب</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-700">اسم الفئة</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">عدد المقالات</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">عدد الحرف</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">إجمالي المحتوى</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">مستوى النشاط</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => {
                  const popularity = getPopularityLevel(category.totalCount);
                  const globalRank = (pageIndex - 1) * pageSize + index;
                  const PopularityIcon = popularity.icon;
                  
                  return (
                    <tr key={category.categoryId} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          {getRankIcon(globalRank)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">{category.categoryName}</h4>
                          <p className="text-sm text-gray-500">ID: {category.categoryId}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaNewspaper className="text-green-500 text-sm" />
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            {category.articleCount}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaHammer className="text-orange-500 text-sm" />
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm font-medium">
                            {category.handiCraftCount}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaChartBar className="text-purple-500 text-sm" />
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                            {category.totalCount}
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
                          onClick={() => handleDelete(category.categoryId)}
                          disabled={deleteLoading === category.categoryId}
                          className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="حذف الفئة"
                        >
                          {deleteLoading === category.categoryId ? (
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

          {/* Empty State */}
          {categories.length === 0 && !loading && (
            <div className="p-12 text-center">
              <FaLayerGroup className="text-gray-400 text-5xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فئات</h3>
              <p className="text-gray-500">لم يتم إنشاء أي فئات بعد</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  عرض {((pageIndex - 1) * pageSize) + 1} إلى {Math.min(pageIndex * pageSize, totalItems)} من {totalItems} فئة
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
                      const page = Math.max(1, Math.min(pageIndex - 2 + i, totalPages - 4 + i));
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
          )}
        </div>
      </div>
    </div>
  );
}