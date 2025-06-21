import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import axios from "axios";
import { ColorRing } from 'react-loader-spinner';
import styles from "./Shop.module.css";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../../Context/TokenContext";
import prof1 from "/src/assets/prof.jpg";
import defaultProductImage from "/src/assets/product1.jpg";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";
import timezone from 'dayjs/plugin/timezone';
import { FaHeart } from "react-icons/fa";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("ar");

const PRODUCTS_PER_PAGE = 9;

const Shop = () => {
  const { token } = useContext(TokenContext);
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(405);
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [],
    price: 405,
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userMap, setUserMap] = useState({});
  const [localFavorites, setLocalFavorites] = useState({});
  const [categories, setCategories] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://ourheritage.runasp.net/api/Categories?PageIndex=1&PageSize=10",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(res.data.items || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  const fetchProducts = () => {
    setLoading(true);
    axios
      .get(
        "https://ourheritage.runasp.net/api/HandiCrafts?page=1&pageSize=1000",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (Array.isArray(res.data.items)) {
          const uniqueMap = new Map();
          res.data.items.forEach((item) => {
            const key = `${item.title}-${item.description}`;
            if (!uniqueMap.has(key)) {
              uniqueMap.set(key, { 
                ...item,
                likes: item.likes || 0 
              });
            }
          });
          const uniqueProducts = Array.from(uniqueMap.values()).map(p => ({
            ...p,
            likes: p.likes || 0
          })).sort((a, b) => b.id - a.id);
          setAllProducts(uniqueProducts);
          
          const initialFavorites = {};
          uniqueProducts.forEach(p => {
            const isFav = localStorage.getItem(`favorite-${p.id}`) === 'true';
            initialFavorites[p.id] = isFav;
          });
          setLocalFavorites(initialFavorites);
        } else {
          setAllProducts([]);
        }
      })
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  };
  
  const fetchUserData = async (userId) => {
    if (userMap[userId]) return;

    try {
      const res = await axios.get(
        `https://ourheritage.runasp.net/api/Users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserMap((prev) => ({
        ...prev,
        [userId]: res.data,
      }));
    } catch (err) {
      console.error("فشل في تحميل بيانات المستخدم:", err);
    }
  };

  const timeAgoCustom = (utcDateString) => {
    if (!utcDateString) return "تاريخ غير متاح";
    
    try {
      let dateStr = utcDateString;
      if (dateStr.length === 10) {
        dateStr += "T" + new Date().toISOString().substring(11, 19) + "Z";
      }

      const date = dayjs.utc(dateStr);
      if (!date.isValid()) return "تاريخ غير صالح";
      
      const now = dayjs.utc();
      const diffInMilliseconds = now.diff(date);
      
      const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInWeeks = Math.floor(diffInDays / 7);
      const diffInMonths = Math.floor(diffInDays / 30);
      const diffInYears = Math.floor(diffInMonths / 12);
    
      if (diffInSeconds < 5) {
        return 'الآن';
      } else if (diffInSeconds < 60) {
        return `منذ ${diffInSeconds} ثانية`;
      } else if (diffInMinutes < 60) {
        if (diffInMinutes === 1) return 'منذ دقيقة واحدة';
        if (diffInMinutes === 2) return 'منذ دقيقتين';
        if (diffInMinutes >= 3 && diffInMinutes <= 10) return `منذ ${diffInMinutes} دقائق`;
        return `منذ ${diffInMinutes} دقيقة`;
      } else if (diffInHours < 24) {
        if (diffInHours === 1) return 'منذ ساعة واحدة';
        if (diffInHours === 2) return 'منذ ساعتين';
        if (diffInHours >= 3 && diffInHours <= 10) return `منذ ${diffInHours} ساعات`;
        return `منذ ${diffInHours} ساعة`;
      } else if (diffInDays < 7) {
        if (diffInDays === 1) return 'منذ يوم واحد';
        if (diffInDays === 2) return 'منذ يومين';
        if (diffInDays >= 3 && diffInDays <= 10) return `منذ ${diffInDays} أيام`;
        return `منذ ${diffInDays} يوم`;
      } else if (diffInWeeks < 4) {
        if (diffInWeeks === 1) return 'منذ أسبوع واحد';
        if (diffInWeeks === 2) return 'منذ أسبوعين';
        if (diffInWeeks >= 3 && diffInWeeks <= 10) return `منذ ${diffInWeeks} أسابيع`;
        return `منذ ${diffInWeeks} أسبوع`;
      } else if (diffInMonths < 12) {
        if (diffInMonths === 1) return 'منذ شهر واحد';
        if (diffInMonths === 2) return 'منذ شهرين';
        if (diffInMonths >= 3 && diffInMonths <= 10) return `منذ ${diffInMonths} أشهر`;
        return `منذ ${diffInMonths} شهر`;
      } else {
        if (diffInYears === 1) return 'منذ سنة واحدة';
        if (diffInYears === 2) return 'منذ سنتين';
        if (diffInYears >= 3 && diffInYears <= 10) return `منذ ${diffInYears} سنوات`;
        return `منذ ${diffInYears} سنة`;
      }
    } catch (error) {
      console.error("خطأ في حساب التاريخ:", error, "التاريخ:", utcDateString);
      return "تاريخ غير متاح";
    }
  };

  const toggleFavorite = async (productId) => {
    const userId = Number(localStorage.getItem('userId'));
    const token = localStorage.getItem('userToken');

    if (!userId || !productId || !token) {
      console.error("userId أو productId أو token غير موجود!");
      alert("حدث خطأ: بيانات غير مكتملة.");
      throw new Error("بيانات غير مكتملة");
    }

    try {
      const checkRes = await axios.get(
        `https://ourheritage.runasp.net/api/Favorites/handicraft/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const favoriteData = checkRes.data;

      if (favoriteData && favoriteData.id) {
        await axios.delete(
          `https://ourheritage.runasp.net/api/Favorites/${favoriteData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.setItem(`favorite-${productId}`, 'false');
        
      } else {
        await axios.post(
          "https://ourheritage.runasp.net/api/Favorites/add",
          {
            userId,
            handiCraftId: productId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Accept": "text/plain",
            },
          }
        );

        localStorage.setItem(`favorite-${productId}`, 'true');
       
      }
    } catch (err) {
      console.error('Favorite toggle error:', err.response?.data || err.message);
      alert('حدث خطأ أثناء التفاعل مع المفضلة.');
      throw err;
    }
  };

  const handleFavoriteClick = async (productId) => {
    const prevState = localFavorites[productId];
    const newState = !prevState;
    
    setLocalFavorites(prev => ({ ...prev, [productId]: newState }));
    localStorage.setItem(`favorite-${productId}`, newState.toString());
    
    try {
      await toggleFavorite(productId);
    } catch (error) {
      setLocalFavorites(prev => ({ ...prev, [productId]: prevState }));
      localStorage.setItem(`favorite-${productId}`, prevState.toString());
    }
  };

  useEffect(() => {
    if (token) {
      fetchCategories();
      fetchProducts();
    }
  }, [token]);
  
  useEffect(() => {
    if (token && allProducts.length) {
      const userIds = Array.from(new Set(allProducts.map(p => p.userId)));
      userIds.forEach((id) => fetchUserData(id));
    }
  }, [allProducts, token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      appliedFilters.categories.length === 0 ||
      appliedFilters.categories.includes(product.categoryId);
    
    const matchesPrice = product.price <= appliedFilters.price;
    
    return matchesCategory && matchesPrice;
  });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleApplyFilters = () => {
    setAppliedFilters({
      categories: selectedCategories,
      price: priceRange,
    });
  };

  const handleImageChange = (e) => {
    setNewProduct((p) => ({ ...p, image: e.target.files[0] }));
  };
  
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    
    const { name, description, price, category, image } = newProduct;

    if (!name || !description || !price || !category || !image) {
      return alert("يرجى ملء جميع الحقول واختيار صورة");
    }

    const categoryId = parseInt(category);
    if (!categoryId) {
      return alert("فئة غير صالحة");
    }

    const formData = new FormData();
    formData.append("Title", name);
    formData.append("Description", description);
    formData.append("Price", price.toString());
    formData.append("CategoryId", categoryId.toString());
    formData.append("Images", image);

    try {
      const response = await axios.post(
        "https://ourheritage.runasp.net/api/HandiCrafts/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      alert("✅ تم إضافة المنتج بنجاح");
      setIsModalOpen(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
      });
      fetchProducts();
    } catch (error) {
      let errorMessage = "❌ فشل في إرسال المنتج";
      if (error.response) {
        errorMessage += `: ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage += ": لا يوجد اتصال بالخادم";
      } else {
        errorMessage += ": خطأ في إعداد الطلب";
      }
      alert(errorMessage);
    }
  };

  return (
    <div className={styles.shopContainer}>
      <div className={styles.filtersSidebar}>
        <h3 className={styles.filterTitle}>تصفية حسب</h3>
        
        <div className={styles.filterSection}>
          <h4>التصنيف</h4>
          {categories.map((cat) => (
            <label key={cat.id} className={styles.filterItem}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() =>
                  setSelectedCategories((prev) =>
                    prev.includes(cat.id)
                      ? prev.filter((c) => c !== cat.id)
                      : [...prev, cat.id]
                  )
                }
              />
              {cat.name}
            </label>
          ))}
        </div>
        
        <div className={styles.filterSection}>
          <h4>السعر</h4>
          <div className={styles.priceFilter}>
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange}
              onChange={(e) => setPriceRange(+e.target.value)}
            />
            <span>{priceRange} $</span>
          </div>
        </div>
        
        <button
          className={styles.applyButton}
          onClick={handleApplyFilters}
        >
          تطبيق
        </button>
        
        <button
          className={styles.applyButton}
          style={{ marginTop: "10px", backgroundColor: `#A67C52` }}
          onClick={() => setIsModalOpen(true)}
        >
          ➕ إضافة منتج
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>إضافة منتج جديد</h2>
            <form onSubmit={handleSubmitProduct}>
              <label>اسم المنتج</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, name: e.target.value }))
                }
              />
              <label>وصف المنتج</label>
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
              />
              <label>السعر</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, price: e.target.value }))
                }
              />
              <label>الفئة</label>
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, category: e.target.value }))
                }
              >
                <option value="">اختر الفئة</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <label>صورة المنتج</label>
              <input type="file" onChange={handleImageChange} />
              <div className={styles.modalActions}>
                <button type="submit">إضافة</button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.mainContent}>
        {loading ? (
          <div className="h-screen flex justify-center items-center">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
            />
          </div>
        ) : (
          <>
            <div className={styles.productsGrid}>
              {displayedProducts.map((p) => {
                const isFavorite = localFavorites[p.id] || false;
                
                return (
                  <div key={p.id} className={styles.productPost}>
                    <div className={styles.postHeader}>
                         <div className={styles.profileWrapper}>
                        <Link to={`/profile/${p.userId}`}>
                          <img
                            src={userMap[p.userId]?.profilePicture || prof1}
                            alt="User"
                            className={styles.profileImage}
                          />
                        </Link>
                      </div>
                      <div>
                        <p className={styles.username}>
                          {userMap[p.userId]
                            ? `${userMap[p.userId].firstName} ${userMap[p.userId].lastName}`
                            : "مستخدم غير معروف"}
                        </p>
                        <p className={styles.postDate}>
                          {p.dateAdded ? timeAgoCustom(p.dateAdded) : "تاريخ غير متاح"}
                        </p>
                      </div>
                   
                    </div>

                    <Link to={`/product-details/${p.id}`}>
                      <img
                        src={p.imageOrVideo?.[0] || defaultProductImage}
                        alt={p.title}
                        className={styles.productImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultProductImage;
                        }}
                      />
                    </Link>

                    <div className={styles.productInfo}>
                      <h3>{p.title}</h3>
                      <p>{p.description}</p>
                      <div className={styles.productFooter}>
                        <button
                          onClick={() => {
                            const cartItem = {
                              id: p.id,
                              name: p.title,
                              price: Number(p.price),
                              image: p.imageOrVideo?.[0] || p.image || defaultProductImage,
                              quantity: 1,
                            };
                            addToCart(cartItem);
                            alert("تمت إضافة المنتج إلى السلة");
                          }}
                          className={styles.cartButton}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            fill="currentColor" 
                            viewBox="0 0 16 16"
                            style={{ marginLeft: '5px' }}
                          >
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                          </svg>
                          <span className="font-semibold">{p.price}$</span>
                        </button>
                        
                        <div 
                          className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
                          onClick={() => handleFavoriteClick(p.id)}
                          title={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                        >
                          <FaHeart className={isFavorite ? styles.favoriteIconActive : styles.favoriteIcon} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                السابق
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? styles.activePage : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                التالي
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;