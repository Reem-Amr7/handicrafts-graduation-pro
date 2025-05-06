import React, { useState } from 'react';
import styles from "./Cart.module.css";
import product1 from "./../../assets/Screenshot 2025-02-13 210809.png";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "حذاء رياضي", price: 250, quantity: 2, image: "https://via.placeholder.com/80" },
    { id: 2, name: "قميص جينز", price: 180, quantity: 1, image: "https://via.placeholder.com/80" },
    { id: 3, name: "ساعة ذكية", price: 400, quantity: 1, image: "https://via.placeholder.com/80" },
  ]);

  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: item.quantity + 1} : item
    ));
  };

  const decreaseQuantity = (id) => {
    const item = cartItems.find(item => item.id === id);
    
    if (item.quantity === 1) {
      if (window.confirm('هل تريد إزالة هذا المنتج من السلة؟')) {
        removeFromCart(id);
      }
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? {...item, quantity: item.quantity - 1} : item
      ));
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 50;
  const total = subtotal + shipping;

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>عربة التسوق 🛒</h1>
      
      <div className={styles.cartContent}>
        <div className={styles.itemsSection}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <img src={product1} alt={item.name} className={styles.itemImage} />
              
              <div className={styles.itemDetails}>
                <h3>{item.name}</h3>
                <p>السعر: {item.price} جنيه</p>
                
                <div className={styles.quantityControl}>
                  <button 
                    className={styles.quantityBtn} 
                    style={{ color: '#A67C52' }}
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    -
                  </button>
                  <span className={styles.quantityNumber}>{item.quantity}</span>
                  <button 
                    className={styles.quantityBtn} 
                    style={{ color: '#A67C52' }}
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h2>ملخص الطلب</h2>
            
            <div className={styles.summaryRow}>
              <span>المجموع الفرعي:</span>
              <span>{subtotal} جنيه</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>الشحن:</span>
              <span>{shipping} جنيه</span>
            </div>
            
            <hr className={styles.divider} />
            
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>الإجمالي:</span>
              <span>{total} جنيه</span>
            </div>
            
            <button className={styles.checkoutBtn}>إتمام الشراء</button>
            
            <p className={styles.continueShopping}>أو <a href="#">مواصلة التسوق</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}