import React from 'react';
import background from "./../../assets/background.jpg";
import styles from './RecoverPassword.module.css';
import { useNavigate } from 'react-router-dom';

export default function RecoverPassword() {
  let navigate = useNavigate();

  return (
    <div className={styles.container } style={{ backgroundImage: `url(${background})` }}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>تعيين كلمة المرور</h2>
        <p className={styles.successMessage}>تم إعادة تعيين كلمة المرور بنجاح</p>
        <button onClick={() => navigate('/login')} className={styles.loginButton}>
          الرجوع إلى تسجيل الدخول
        </button>
      </div>
    </div>
  );
}