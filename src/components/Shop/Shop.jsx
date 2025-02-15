import React, { useState } from "react";
import styles from "./Shop.module.css";

import product1 from "/src/assets/product1.jpg";
import product2 from "/src/assets/product2.jpg";
import product3 from "/src/assets/product3.jpg";
import product4 from "/src/assets/product4.jpg";
import product5 from "/src/assets/product5.jpg";
import product6 from "/src/assets/product6.jpg";
import product7 from "/src/assets/product7.jpg";
import product8 from "/src/assets/product8.jpg";
import product9 from "/src/assets/product9.jpg";
const products = [
  { id: 1, image: product1, title: "منتج من الخوص", description: "قطع فريدة بتصميم بسيط، تضيف لمسة تراثية.", likes: 105, category: "الدوس", price: 200, country: "مصر" },
  { id: 2, image: product2, title: "حقيبة من الخوص", description: "أنيقة وتناسب جميع الأوقات.", likes: 72, category: "العمار", price: 350, country: "السعودية" },
  { id: 3, image: product3, title: "ديكور منزلي قيم ", description: " قطع يدوية تضيف لمسة فنية.قويه", likes: 89, category: "متلجات الخاصة", price: 405, country: "المغرب" },
  { id: 4, image: product4, title: "حقيبة جلدية", description: "حقيبة بتصميم مميز تضيف لمسة عصرية.", likes: 120, category: "السجاد الديوني", price: 280, country: "تواسى" },
  { id: 5, image: product5, title: "طقم أكواب فخارية", description: "صناعة يدوية بأجود الخامات.", likes: 95, category: "الدوس", price: 150, country: "التراثر" },
  { id: 6, image: product6, title: "ديكور كف اليد", description: "قطعة فنية مميزة لديكور المنزل.", likes: 88, category: "العمار", price: 405, country: "مصر" },
  { id: 7, image: product7, title: "صينية خشبية", description: "مصنوعة من أجود أنواع الخشب.", likes: 67, category: "متلجات الخاصة", price: 180, country: "السعودية" },
  { id: 8, image: product8, title: "طاولة خشبية", description: "تصميم أنيق يناسب جميع الأذواق.", likes: 110, category: "السجاد الديوني", price: 405, country: "المغرب" },
  { id: 9, image: product9, title: "فاصل خشبي", description: "قطعة ديكور عملية وجميلة.", likes: 99, category: "الدوس", price: 220, country: "تواسى" },
  { id: 10, image: product2, title: "ديكور جداري", description: "لمسة فنية رائعة للحوائط.", likes: 78, category: "العمار", price: 130, country: "التراثر" },
  { id: 11, image: product6, title: "مزهرية فخارية", description: "مصنوعة يدويًا بأعلى جودة.", likes: 115, category: "متلجات الخاصة", price: 405, country: "مصر" },
  { id: 12, image: product7, title: "سجادة يدوية", description: "بتصميم عربي أصيل.", likes: 130, category: "السجاد الديوني", price: 300, country: "السعودية" },
];

const categories = ["الدوس", "المعمار", "منتجات الخاصة", "السجاد الديوني"];
const countries = ["مصر", "السعودية", "المغرب", "تونس", "الجزائر"];
const PRODUCTS_PER_PAGE = 9;

const Shop = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [priceRange, setPriceRange] = useState(405);
  const [appliedFilters, setAppliedFilters] = useState({ categories: [], countries: [], price: 405 });

  const handleApplyFilters = () => {
    setAppliedFilters({ categories: selectedCategories, countries: selectedCountries, price: priceRange });
    setCurrentPage(1); // العودة للصفحة الأولى بعد التصفية
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = appliedFilters.categories.length === 0 || appliedFilters.categories.includes(product.category);
    const countryMatch = appliedFilters.countries.length === 0 || appliedFilters.countries.includes(product.country);
    const priceMatch = product.price <= appliedFilters.price;
    return categoryMatch && countryMatch && priceMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const selectedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  return (
    <div className={styles.shopContainer } >
      {/* قسم الفلاتر الجانبي */}
      <div className={styles.filtersSidebar}>
        <h3 className={styles.filterTitle}>تصفية حسب</h3>

        <div className={styles.filterSection}>
          <h4>التصنيف</h4>
          {categories.map(category => (
            <label key={category} className={styles.filterItem}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() =>
                  setSelectedCategories(prev =>
                    prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
                  )
                }
              />
              {category}
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
             
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
            <span>{priceRange} $</span>
          </div>
        </div>

        <div className={styles.filterSection}>
          <h4>الدولة</h4>
          {countries.map(country => (
            <label key={country} className={styles.filterItem}>
              <input
                type="checkbox"
                checked={selectedCountries.includes(country)}
                onChange={() =>
                  setSelectedCountries(prev =>
                    prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
                  )
                }
              />
              {country}
            </label>
          ))}
        </div>

        <button className={styles.applyButton} onClick={handleApplyFilters}>تطبيق</button>
      </div>

      {/* المحتوى الرئيسي */}
      <div className={styles.mainContent}>
      

        <div className={styles.productsGrid}>
  {selectedProducts.map((product) => (
    <div key={product.id} className={styles.productPost}>
      
      {/* البروفايل وتاريخ النشر */}
      <div className={styles.postHeader}>
        
        <div>
          <p className={styles.username}>ANN JI</p>
          <p className={styles.postDate}>منذ 3 أيام</p>
        </div>
        <img src="src\assets\prof.jpg" alt="User Profile" className={styles.profileImage} />
      </div>

      {/* صورة المنتج */}
      <img src={product.image} alt={product.title} className={styles.productImage} />

      {/* تفاصيل المنتج */}
      <div className={styles.productInfo}>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <div className={styles.productFooter}>
        <button className={styles.cartButton}>
                   
  <i className="fa-solid fa-cart-shopping text-lg"></i>
  <span className="font-semibold">{product.price}$</span>
</button>
                    <span className={styles.likes}>❤ {product.likes}</span>
                    


        </div>
      </div>

    </div>
  ))}
</div>

        
        {/* الترقيم */}
        <div className={styles.pagination}>
         

          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            التالي
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? styles.activePage : ""}>
              {i + 1}
            </button>
          ))}
 <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            السابق
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shop;
