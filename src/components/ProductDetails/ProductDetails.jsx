import React from 'react';
import styles from "./ProductDetails.module.css";
import productImage from "../../assets/image.png";

export default function ProductDetails() {
  return (
    <div className={styles.productDetails}>
      
      <div className={styles.productImageSection}>
        <img src={productImage} alt="Product" className={styles.productImage} />
      </div>


      <div className={styles.productInfoSection}>
        <h2 className={styles.productTitle}>شنطة من المكرمية - جملي - 20*25 سم</h2>
        <div className={styles.rating}>
          ⭐⭐⭐⭐⭐
        </div>
        <div className={styles.price}>280.00$</div>

       
        <div className={styles.quantitySection}>
  <button className={styles.addToCart}>أضف إلى السلة</button>
  <input 
    type="number" 
    defaultValue={1} 
    min="0" 
    className={styles.quantityInput} 
    onChange={(e) => {
      if (e.target.value < 0) {
        e.target.value = 0; 
      }
    }} 
  />
</div>


        <button className={styles.buyNow}>اشتري الآن</button>

        <div className={styles.extraInfo}>
          <p><strong>بلد المنشأ:</strong> مصر</p>
          <p><strong>الفئة:</strong> المكرمية</p>
        </div>
      </div>
    </div>
  );
}
