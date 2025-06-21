import { useState, useEffect } from 'react';
import {
  FaArrowLeft, FaLayerGroup, FaNewspaper, FaHammer, FaChartBar, 
  FaSpinner, FaFire, FaStar, FaEye, FaPalette, FaCalendar, FaTrash
} from "react-icons/fa";
import { useContext } from "react";
import { TokenContext } from "../../Context/TokenContext";
import { Link } from 'react-router-dom'; // تأكدي إنك مستوردة Link

export default function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
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
          successMsg.className = 'fixed top-4 right-4 bg-[#52796f] text-white px-6 py-3 rounded-lg shadow-lg z-50';
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
        errorDetails.className = 'fixed bottom-4 right-4 bg-[#a44a3f]/10 border border-[#a44a3f] text-[#a44a3f] px-4 py-3 rounded-lg shadow-lg z-50 max-w-md';
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
    if (totalCount >= 20) return { level: 'عالي جداً', color: 'text-white bg-[#b08968]', icon: FaFire };
    if (totalCount >= 10) return { level: 'عالي', color: 'text-white bg-[#9c6644]', icon: FaEye };
    if (totalCount >= 5) return { level: 'متوسط', color: 'text-white bg-[#a44a3f]', icon: FaStar };
    return { level: 'منخفض', color: 'text-white bg-[#52796f]', icon: FaPalette };
  };

  const getRankIcon = (index) => {
    if (index === 0) return <FaFire className="text-[#b08968] text-lg" />;
    if (index === 1) return <FaStar className="text-[#9c6644] text-lg" />;
    if (index === 2) return <FaEye className="text-[#a44a3f] text-lg" />;
    return <span className="text-[#6e4c2f] font-bold">#{index + 1}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-[#fefaf4] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#b08968]">
          <FaSpinner className="animate-spin text-2xl" />
          <span className="text-lg">جاري تحميل إحصائيات الفئات...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8  bg-[#fefaf4]">
        <div className="max-w-6xl  mx-auto">
          <div className="bg-[#a44a3f]/10 border border-[#a44a3f]/20 rounded-xl p-6 text-center">
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

  const totalArticles = categories.reduce((sum, category) => sum + category.articleCount, 0);
  const totalHandicrafts = categories.reduce((sum, category) => sum + category.handiCraftCount, 0);
  const totalContent = categories.reduce((sum, category) => sum + category.totalCount, 0);

  return (
    <div className="min-h-screen p-8 mt-24 bg-[#fefaf4]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
          <Link
  to="/admin"
  className="bg-[#f5eee6] p-3 rounded-xl shadow hover:shadow-md transition border border-[#e0c9b9]"
>
  <FaArrowLeft className="text-[#b08968]" />
</Link>
            <div className='w-52'>
              <h1 className="text-3xl  w-72 font-bold text-[#5e3c23] flex items-center gap-3">
                <FaLayerGroup className="text-[#b08968]" />
                إحصائيات الفئات
              </h1>
              <p className="text-[#6e4c2f] mt-1">
                إدارة وعرض إحصائيات الفئات والمحتوى - إجمالي {totalItems} فئة
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#f5eee6] rounded-xl shadow p-6 border border-[#e0c9b9]">
            <div className="flex items-center gap-4">
              <FaLayerGroup className="text-[#b08968] text-3xl" />
              <div>
                <h3 className="text-[#6e4c2f] text-sm">إجمالي الفئات</h3>
                <p className="text-2xl font-bold text-[#9c6644]">{totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#f5eee6] rounded-xl shadow p-6 border border-[#e0c9b9]">
            <div className="flex items-center gap-4">
              <FaNewspaper className="text-[#b08968] text-3xl" />
              <div>
                <h3 className="text-[#6e4c2f] text-sm">إجمالي المقالات</h3>
                <p className="text-2xl font-bold text-[#52796f]">{totalArticles}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#f5eee6] rounded-xl shadow p-6 border border-[#e0c9b9]">
            <div className="flex items-center gap-4">
              <FaHammer className="text-[#b08968] text-3xl" />
              <div>
                <h3 className="text-[#6e4c2f] text-sm">إجمالي الحرف</h3>
                <p className="text-2xl font-bold text-[#a44a3f]">{totalHandicrafts}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#f5eee6] rounded-xl shadow p-6 border border-[#e0c9b9]">
            <div className="flex items-center gap-4">
              <FaChartBar className="text-[#b08968] text-3xl" />
              <div>
                <h3 className="text-[#6e4c2f] text-sm">إجمالي المحتوى</h3>
                <p className="text-2xl font-bold text-[#b08968]">{totalContent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-[#f5eee6] rounded-xl shadow overflow-hidden border border-[#e0c9b9]">
          <div className="p-6 border-b bg-[#e0c9b9]">
            <h2 className="text-xl font-bold text-[#5e3c23]">قائمة الفئات وإحصائياتها</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#e0c9b9] border-b border-[#e0c9b9]">
                <tr>
                  <th className="p-4 text-right text-sm font-semibold text-[#5e3c23]">الترتيب</th>
                  <th className="p-4 text-right text-sm font-semibold text-[#5e3c23]">اسم الفئة</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">عدد المقالات</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">عدد الحرف</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">إجمالي المحتوى</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">مستوى النشاط</th>
                  <th className="p-4 text-center text-sm font-semibold text-[#5e3c23]">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => {
                  const popularity = getPopularityLevel(category.totalCount);
                  const globalRank = (pageIndex - 1) * pageSize + index;
                  const PopularityIcon = popularity.icon;
                  
                  return (
                    <tr key={category.categoryId} className="border-b border-[#e0c9b9] hover:bg-[#e0c9b9] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center justify-center">
                          {getRankIcon(globalRank)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <h4 className="font-semibold text-[#5e3c23] mb-1">{category.categoryName}</h4>
                          <p className="text-sm text-[#6e4c2f]">ID: {category.categoryId}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaNewspaper className="text-[#52796f] text-sm" />
                          <span className="bg-[#52796f] text-white px-2 py-1 rounded-full text-sm font-medium">
                            {category.articleCount}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaHammer className="text-[#a44a3f] text-sm" />
                          <span className="bg-[#a44a3f] text-white px-2 py-1 rounded-full text-sm font-medium">
                            {category.handiCraftCount}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaChartBar className="text-[#b08968] text-sm" />
                          <span className="bg-[#b08968] text-white px-3 py-1 rounded-full text-sm font-bold">
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
                          className="bg-[#a44a3f] hover:bg-[#8b352d] text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <FaLayerGroup className="text-[#6e4c2f] text-5xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#5e3c23] mb-2">لا توجد فئات</h3>
              <p className="text-[#6e4c2f]">لم يتم إنشاء أي فئات بعد</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 bg-[#e0c9b9] border-t border-[#e0c9b9]">
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#5e3c23]">
                  عرض {((pageIndex - 1) * pageSize) + 1} إلى {Math.min(pageIndex * pageSize, totalItems)} من {totalItems} فئة
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
                      const page = Math.max(1, Math.min(pageIndex - 2 + i, totalPages - 4 + i));
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
          )}
        </div>
      </div>
    </div>
  );
}
