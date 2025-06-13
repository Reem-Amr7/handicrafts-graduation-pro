import React, { useState, useEffect } from 'react';
import styles from './NewPassword.module.css';
import background from './../../assets/background.jpg';
import { useNavigate } from 'react-router-dom';

export default function NewPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem("recoverToken");

  useEffect(() => {
    if (!token) navigate('/recoverpassword');
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("❌ كلمتا المرور غير متطابقتين.");
      return;
    }

    try {
      const response = await fetch('https://ourheritage.runasp.net/api/Auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: password })
      });

      if (response.ok) {
        setMessage("✅ تم تعيين كلمة المرور.");
        localStorage.removeItem("recoverToken");
        localStorage.removeItem("recoveryEmail");
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage("❌ فشل في تعيين كلمة المرور.");
      }
    } catch {
      setMessage("❌ فشل الاتصال بالخادم.");
    }
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${background})` }}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>تعيين كلمة المرور الجديدة</h2>
        <form onSubmit={handleSubmit} className={styles.passwordForm}>
          <div className={styles.inputGroup}>
            <label>كلمة المرور</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label>تأكيد كلمة المرور</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className={styles.submitButton}>تعيين كلمة المرور</button>
        </form>
        {message && <p style={{ color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
      </div>
    </div>
  );
}
