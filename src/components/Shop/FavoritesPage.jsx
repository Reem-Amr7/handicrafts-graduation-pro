import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { TokenContext } from "../../Context/TokenContext";
import axios from "axios";
import { ColorRing } from 'react-loader-spinner';
import styles from "./Shop.module.css";
import profileimg from "../../assets/profile-icon-9.png";
import defaultProductImage from "/src/assets/product1.jpg";
import { FaHeart, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("ar");

const FavoritesPage = () => {
  const { token } = useContext(TokenContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMap, setUserMap] = useState({});
  const [localFavorites, setLocalFavorites] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [isRemovingAll, setIsRemovingAll] = useState(false);

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

  // دالة لجلب تفاصيل المنتج
  const fetchProductDetails = async (handiCraftId) => {
    try {
      const response = await axios.get(
        `https://ourheritage.runasp.net/api/HandiCrafts/${handiCraftId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      console.error("فشل في جلب تفاصيل المنتج:", error);
      return null;
    }
  };

  // دالة للتبديل بين الحالات (إضافة/حذف من المفضلة)
  const toggleFavorite = async (productId) => {
    const userId = Number(localStorage.getItem('userId'));
    const token = localStorage.getItem('userToken');

    if (!userId || !productId || !token) {
      console.error("userId أو productId أو token غير موجود!");
      alert("حدث خطأ: بيانات غير مكتملة.");
      throw new Error("بيانات غير مكتملة");
    }

    try {
      // 1. التحقق مما إذا كان المنتج في المفضلة بالفعل
      const checkRes = await axios.get(
        `https://ourheritage.runasp.net/api/Favorites/handicraft/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const favoriteData = checkRes.data;

      if (favoriteData && favoriteData.id) {
        // 2. إذا كان موجودًا، نقوم بحذفه
        await axios.delete(
          `https://ourheritage.runasp.net/api/Favorites/${favoriteData.id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        localStorage.setItem(`favorite-${productId}`, 'false');
        setFavorites(prev => prev.filter(p => p.id !== productId));
        
      } else {
        // 3. إذا لم يكن موجودًا، نقوم بإضافته
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

  // دالة للتعامل مع النقر على المفضلة
  const handleFavoriteClick = async (productId) => {
    const prevState = localFavorites[productId];
    const newState = !prevState;
    
    setLocalFavorites(prev => ({ ...prev, [productId]: newState }));
    
    try {
      await toggleFavorite(productId);
      setFavorites(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      setLocalFavorites(prev => ({ ...prev, [productId]: prevState }));
    }
  };

  // دالة لجلب بيانات المستخدم
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

  const removeAllFavorites = async () => {
    if (!token || !userId) return;

    if (!window.confirm("هل أنت متأكد من حذف جميع المنتجات من المفضلة؟")) return;

    setIsRemovingAll(true);

    try {
      const { data } = await axios.get(
        "https://ourheritage.runasp.net/api/Favorites/my-favorites",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // التعديل هنا: التحقق من بنية الاستجابة
      let allFavs = [];
      
      if (Array.isArray(data)) {
        allFavs = data;
      } else if (data && Array.isArray(data.models)) {
        allFavs = data.models;
      } else if (data && Array.isArray(data.items)) {
        allFavs = data.items;
      } else {
        console.error("بنية بيانات غير متوقعة:", data);
        throw new Error("بنية بيانات غير متوقعة");
      }
      
      // تنفيذ الحذف
      await Promise.all(
        allFavs.map((fav) =>
          axios.delete(
            `https://ourheritage.runasp.net/api/Favorites/${fav.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ).then(() => {
            localStorage.setItem(`favorite-${fav.handiCraftId}`, 'false');
          })
        )
      );

      setFavorites([]);
      alert("تم حذف جميع المنتجات من المفضلة بنجاح.");
    } catch (error) {
      console.error("فشل في حذف المفضلة:", error);
      alert("حدث خطأ أثناء حذف المفضلة.");
    } finally {
      setIsRemovingAll(false);
    }
  };

  // دالة لجلب المفضلات
  
  const fetchFavorites = async () => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://ourheritage.runasp.net/api/Favorites/my-favorites",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // التعديل هنا: التحقق من بنية الاستجابة
      let favItems = [];
      
      if (Array.isArray(data)) {
        favItems = data;
      } else if (data && Array.isArray(data.models)) {
        favItems = data.models;
      } else if (data && Array.isArray(data.items)) {
        favItems = data.items;
      } else {
        console.error("بنية بيانات غير متوقعة:", data);
        throw new Error("بنية بيانات غير متوقعة");
      }
      
      // جلب تفاصيل كل منتج مفضل
      const favoritesWithDetails = [];
      
      for (const item of favItems) {
        const productDetails = await fetchProductDetails(item.handiCraftId);
        if (productDetails) {
          favoritesWithDetails.push({
            ...productDetails,
            favoriteId: item.id,
            dateAdded: item.dateCreated
          });
        }
      }
      
      setFavorites(favoritesWithDetails);
      
      // تهيئة المفضلة المحلية
      const initialFavorites = {};
      favoritesWithDetails.forEach(p => {
        initialFavorites[p.id] = true;
      });
      setLocalFavorites(initialFavorites);
      
      // جلب بيانات المستخدمين للمنتجات
      const userIds = Array.from(new Set(favoritesWithDetails.map(p => p.userId)));
      userIds.forEach(id => fetchUserData(id));
    } catch (err) {
      console.error("فشل في جلب المفضلة:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [token, userId]);

  if (loading) {
    return (
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
    );
  }

  return (
    <div className={styles.shopContainer}>
      <div className={styles.filtersSidebar}>
        <h3 className={styles.filterTitle}>منتجاتي المفضلة</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/shop" className={styles.favoritesLink}>
            <button 
              className={styles.applyButton} 
              style={{ 
                backgroundColor: '#A67C52',
                width: '100%'
              }}
            >
              العودة إلى المتجر
            </button>
          </Link>
          
          <button 
            onClick={removeAllFavorites}
            className={styles.applyButton}
            style={{ 
              backgroundColor: '#d9534f',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}
            disabled={isRemovingAll || favorites.length === 0}
          >
            {isRemovingAll ? (
              <span>جاري الحذف...</span>
            ) : (
              <>
                <FaTrash />
                <span>إزالة الكل</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        {favorites.length === 0 ? (
          <div className={styles.emptyFavorites}>
            <p>لم تقم بإضافة أي منتج إلى المفضلة بعد.</p>
            <Link to="/shop" className={styles.backToShop}>استكشاف المنتجات</Link>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {favorites.map((p) => (
              <div key={p.id} className={styles.productPost}>
                <div className={styles.postHeader}>
                  <div className={styles.profileWrapper}>
                    <Link to={`/profile/${p.userId}`}>
                      <img
                        src={userMap[p.userId]?.profilePicture || profileimg}
                        alt="User"
                        className={styles.profileImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = profileimg;
                        }}
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
                    src={p.images?.[0] || defaultProductImage}
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
                          image: p.images?.[0] || defaultProductImage,
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
                      className={`${styles.favoriteButton} ${styles.favorited}`}
                      onClick={() => handleFavoriteClick(p.id)}
                      title="إزالة من المفضلة"
                    >
                      <FaHeart className={styles.favoriteIconActive} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;