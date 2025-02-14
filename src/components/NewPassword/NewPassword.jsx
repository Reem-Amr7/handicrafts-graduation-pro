import React, { useState } from 'react';
import background from "./../../assets/background.jpg";
import styles from './NewPassword.module.css';
import { useNavigate } from 'react-router-dom';

export default function NewPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  let navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      alert('تم تعيين كلمة المرور بنجاح');
      navigate('/login');
    } else {
      alert('كلمة المرور غير متطابقة');
    }
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${background})` }}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>تعيين كلمة المرور الجديدة</h2>
        <form onSubmit={handleSubmit} className={styles.passwordForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="password">كلمة المرور</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>
          <button type="submit"  onClick={() => navigate('/recoverpassword')} className={styles.submitButton}>تعيين كلمة المرور</button>
        </form>
      </div>
    </div>
  );
}