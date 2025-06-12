import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";
import defaultProductImage from "../../assets/image.png";
import { TokenContext } from "../../Context/TokenContext";
import { useCart } from "../../Context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(TokenContext);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://ourheritage.runasp.net/api/HandiCrafts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("فشل تحميل البيانات");
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  if (loading) return <p className={styles.loading}>جاري التحميل...</p>;
  if (!product) return <p className={styles.error}>لم يتم العثور على المنتج.</p>;

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.title,
      price: Number(product.price),
      image: product.imageOrVideo?.[0] || defaultProductImage,
      quantity: Number(quantity) > 0 ? Number(quantity) : 1,
    };
    addToCart(cartItem);
    alert("تمت إضافة المنتج إلى السلة");
  };

  return (
    <div className={styles.productDetails}>
      <div className={styles.productImageSection}>
        <img
          src={product.imageOrVideo?.[0] || defaultProductImage}
          alt={product.title}
          className={styles.productImage}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultProductImage;
          }}
        />
      </div>

      <div className={styles.productInfoSection}>
        <h2 className={styles.productTitle}>{product.title}</h2>
        <div className={styles.rating}>⭐⭐⭐⭐⭐</div>
        <div className={styles.price}>{product.price}.00$</div>

        <div className={styles.quantitySection}>
          <button className={styles.addToCart} onClick={handleAddToCart}>
            أضف إلى السلة
          </button>
          <input
            type="number"
            value={quantity}
            min="1"
            className={styles.quantityInput}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button className={styles.buyNow}>اشتري الآن</button>

        <div className={styles.extraInfo}>
          <p><strong>بلد المنشأ:</strong> مصر</p>
          <p><strong>الفئة:</strong> {product.categoryName}</p>
          <p><strong>اسم الصانع:</strong> {product.nameOfUser}</p>
        </div>
      </div>
    </div>
  );
}

