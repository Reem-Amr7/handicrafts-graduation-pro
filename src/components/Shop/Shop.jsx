import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext";

import axios from "axios";
import styles from "./Shop.module.css";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../../Context/TokenContext";
import prof1 from "/src/assets/prof.jpg";
import defaultProductImage from "/src/assets/product1.jpg";

const PRODUCTS_PER_PAGE = 9;
const categories = ["الدوس", "المعمار", "منتجات الخاصة", "السجاد الديوني"];
const countries = ["مصر", "السعودية", "المغرب", "تونس", "الجزائر"];

const Shop = () => {
  const { token } = useContext(TokenContext);
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [priceRange, setPriceRange] = useState(405);
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [],
    countries: [],
    price: 405,
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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




  const fetchProducts = () => {
    setLoading(true);
    axios
      // نجيب كل المنتجات دفعة وحدة بتحديد pageSize كبير
      .get(
        "https://ourheritage.runasp.net/api/HandiCrafts?page=1&pageSize=1000",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (Array.isArray(res.data.items)) {
          // رتب من الأحدث للأقدم
          const uniqueMap = new Map();
res.data.items.forEach((item) => {
  const key = `${item.title}-${item.description}`;
  if (!uniqueMap.has(key)) {
    uniqueMap.set(key, item);
  }
});
const uniqueProducts = Array.from(uniqueMap.values()).sort((a, b) => b.id - a.id);
setAllProducts(uniqueProducts);
;
        } else {
          setAllProducts([]);
        }
      })
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  // كل ما يتغير appliedFilters نرجع للصفحة الأولى
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      appliedFilters.categories.length === 0 ||
      appliedFilters.categories.includes(product.categoryName);
    const matchesCountry =
      appliedFilters.countries.length === 0 ||
      appliedFilters.countries.includes(product.countryName);
    const matchesPrice = product.price <= appliedFilters.price;
    return matchesCategory && matchesCountry && matchesPrice;
  });

  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleApplyFilters = () => {
    setAppliedFilters({
      categories: selectedCategories,
      countries: selectedCountries,
      price: priceRange,
    });
  };

  const handleImageChange = (e) => {
    setNewProduct((p) => ({ ...p, image: e.target.files[0] }));
  };

  const categoryMap = {
    "الدوس": 1,
    "woodworking": 2,
    "Embroidery": 3,
    "Metalworking": 4,
  };
  
  
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    console.log("submitting...");
    
    const { name, description, price, category, image } = newProduct;
  
    // التأكد من ملء جميع الحقول
    if (!name || !description || !price || !category || !image) {
      return alert("يرجى ملء جميع الحقول واختيار صورة");
    }
  
    // تحويل الاسم المختار للفئة إلى ID
    const categoryId = categoryMap[category];
    if (!categoryId) {
      return alert("فئة غير صالحة");
    }
  
    // إعداد البيانات للإرسال
    const formData = new FormData();
    formData.append("Title", name);            // اسم المنتج
    formData.append("Description", description); // وصف المنتج
    formData.append("Price", price);            // سعر المنتج
    formData.append("CategoryId", categoryId);  // CategoryId وليس categoryName
    formData.append("Image", image);            // صورة المنتج
    // لو كان مطلوب UserId ضيفه هنا (مثال: formData.append("UserId", userId);)
  
    try {
      // إرسال البيانات عبر API
      const response = await axios.post(
        "https://ourheritage.runasp.net/api/HandiCrafts/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",  // تأكيد أن البيانات بصيغة FormData
          },
        }
      );
      // عند النجاح
      console.log("تمت الإضافة بنجاح", response.data);
      alert("✅ تم إضافة المنتج بنجاح");
  
      // إغلاق المودال وتصفير الحقول
      setIsModalOpen(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
      });
  // إعادة تحميل المنتجات
fetchProducts();
} catch (error) {
  // طباعة كامل الخطأ
  console.error("خطأ في الإضافة:", error.response || error.message);
  
  if (error.response) {
    // إذا كانت استجابة من الخادم، نعرض رسالة الخطأ
    console.error("API Error:", error.response.data);
    alert(`❌ فشل في إرسال المنتج: ${error.response.data?.message || error.response.statusText}`);
  } else {
    // إذا كان هناك خطأ غير متعلق بالـ API (مثل مشاكل في الاتصال)
    alert("❌ فشل في إرسال المنتج: تحقق من الاتصال بالإنترنت أو حاول مرة أخرى");
  }
}}

  return (
    <div className={styles.shopContainer}>
      <div className={styles.filtersSidebar}>
        <h3 className={styles.filterTitle}>تصفية حسب</h3>
        <div className={styles.filterSection}>
          <h4>التصنيف</h4>
          {categories.map((cat) => (
            <label key={cat} className={styles.filterItem}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() =>
                  setSelectedCategories((prev) =>
                    prev.includes(cat)
                      ? prev.filter((c) => c !== cat)
                      : [...prev, cat]
                  )
                }
              />
              {cat}
            </label>
          ))}
        </div>
        <div className={styles.filterSection}>
          <h4>السعر</h4>
          <div className={styles.priceFilter}>
            <input
              type="range"
              min="0"
              max="405"
              value={priceRange}
              onChange={(e) => setPriceRange(+e.target.value)}
            />
            <span>{priceRange} $</span>
          </div>
        </div>
        <div className={styles.filterSection}>
          <h4>الدولة</h4>
          {countries.map((ct) => (
            <label key={ct} className={styles.filterItem}>
              <input
                type="checkbox"
                checked={selectedCountries.includes(ct)}
                onChange={() =>
                  setSelectedCountries((prev) =>
                    prev.includes(ct)
                      ? prev.filter((c) => c !== ct)
                      : [...prev, ct]
                  )
                }
              />
              {ct}
            </label>
          ))}
        </div>
        <button
          className={styles.applyButton}
          onClick={handleApplyFilters}
        >
          تطبيق
        </button>
        <button
          className={styles.applyButton}
          style={{ marginTop: "10px", backgroundColor: `#A67C52` ,hover:`#099d79`}}
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
                  <option key={cat} value={cat}>
                    {cat}
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
          <div className={styles.loading}>جار التحميل...</div>
        ) : (
          <>
            <div className={styles.productsGrid}>
              {displayedProducts.map((p) => (
                <div key={p.id} className={styles.productPost}>
                  <div className={styles.postHeader}>
                    <div>
                      <p className={styles.username}>ANN JI</p>
                      <p className={styles.postDate}>منذ 3 أيام</p>
                    </div>
                    <div className={styles.profileWrapper}>
  <Link to={`/profile/${p.userId}`}>
    <img
      src={prof1}
      alt="User"
      className={styles.profileImage}
    />
  </Link>
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
  <i className="fa-solid fa-cart-shopping text-lg" />
  <span className="font-semibold">{p.price}$</span>
</button>


                      <span className={styles.likes}>❤ {p.likes || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.pagination}>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(p - 1, 1))
                }
                disabled={currentPage === 1}
              >
                السابق
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={
                    currentPage === i + 1 ? styles.activePage : ""
                  }
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
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
