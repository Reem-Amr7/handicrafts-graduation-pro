import React, { useState, createContext, useContext } from 'react';
import styles from "./Cart.module.css";
import product1 from "./../../assets/Screenshot 2025-02-13 210809.png";

// ==== 1. CartContext داخلي  ====
const CartContext = createContext();
const useCart = () => useContext(CartContext);

// ==== 2. Provider داخلي ====
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const increaseQuantity = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// ==== 3. Cart Component ====
export default function Cart() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 50;
  const total = subtotal + shipping;

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>عربة التسوق 🛒</h1>
      
      <div className={styles.cartContent}>
        <div className={styles.itemsSection}>
          {cartItems.length === 0 ? (
            <p>السلة فارغة.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.image || product1} alt={item.name} className={styles.itemImage} />
                
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
            ))
          )}
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
export { useCart };
