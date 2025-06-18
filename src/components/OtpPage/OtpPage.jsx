import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from './OtpPage.module.css';
import background from './../../assets/background.jpg';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../../Context/TokenContext';

export default function OtpAndResetPassword() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [counter, setCounter] = useState(0);

  const navigate = useNavigate();
  const email = localStorage.getItem('recoveryEmail');

  const { token, setToken } = useContext(TokenContext);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/recoverpassword');
    } else {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (resendDisabled && counter > 0) {
      timer = setInterval(() => setCounter(prev => prev - 1), 1000);
    } else if (counter === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, counter]);

  const handleOtpChange = (index, value) => {
    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) otpRefs.current[index + 1]?.focus();
      if (value === '' && index > 0) otpRefs.current[index - 1]?.focus();
    }
  };

  const resendOtp = async () => {
    if (resendDisabled) return;
    if (!email) {
      setResendMessage('❌ البريد الإلكتروني غير موجود.');
      navigate('/recoverpassword');
      return;
    }

    setResendDisabled(true);
    setCounter(30);
    setResendMessage('');

    try {
      const formData = new FormData();
      formData.append('Email', email);

      const response = await fetch('https://ourheritage.runasp.net/api/Auth/resend-otp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const text = await response.text();
      console.log('Resend OTP Response:', response.status, text);

      if (response.ok) {
        setResendMessage('✅ تم إرسال الرمز مرة أخرى إلى بريدك الإلكتروني.');
        const newToken = response.headers.get('Authorization')?.split(' ')[1];
        if (newToken) {
          setToken(newToken);
          localStorage.setItem('recoverToken', newToken);
        }
      } else if (response.status === 401) {
        setResendMessage('❌ انتهت صلاحية الجلسة. يرجى إعادة المحاولة.');
      } else {
        try {
          const errorData = JSON.parse(text);
          if (errorData.errors && errorData.errors.Email) {
            setResendMessage(`❌ ${errorData.errors.Email[0]}`);
          } else {
            setResendMessage(`❌ ${text || 'فشل إرسال الرمز.'}`);
          }
        } catch {
          setResendMessage(`❌ ${text || 'فشل إرسال الرمز.'}`);
        }
      }
    } catch (err) {
      console.error('Resend OTP Error:', err);
      setResendMessage('❌ فشل الاتصال بالخادم.');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length !== 6) {
      setMessage('❌ أدخل رمز مكون من 6 أرقام.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('❌ كلمتا المرور غير متطابقتين.');
      return;
    }
    if (password.length < 6) {
      setMessage('❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل.');
      return;
    }

    const formData = new FormData();
    formData.append('OtpCode', code);
    formData.append('NewPassword', password);
    formData.append('ConfirmPassword', confirmPassword);

    console.log('Sending reset-password:', { code, password });

    try {
      const response = await fetch('https://ourheritage.runasp.net/api/Auth/reset-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const text = await response.text();
      console.log('Reset Password Response:', response.status, text);

      if (response.ok) {
        setMessage('✅ تم تعيين كلمة المرور بنجاح.');
        setToken(null);
        localStorage.removeItem('userToken');
        localStorage.removeItem('recoverToken');
        localStorage.removeItem('recoveryEmail');
        setTimeout(() => navigate('/login'), 1500);
      } else if (response.status === 401) {
        setMessage('❌ انتهت صلاحية الجلسة.');
        setTimeout(() => {
          setToken(null);
          localStorage.removeItem('recoverToken');
          localStorage.removeItem('userToken');
          navigate('/recoverpassword');
        }, 1500);
      } else {
        let msg;
        try { msg = JSON.parse(text).message; } catch { msg = text; }
        setMessage(`❌ ${msg || 'فشل في تعيين كلمة المرور.'}`);
      }
    } catch (err) {
      console.error('Reset Password Error:', err);
      setMessage('❌ فشل الاتصال بالخادم.');
    }
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${background})` }}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>OTP وتعيين كلمة المرور</h2>
        <p>📧 تم إرسال الرمز إلى: <strong>{email}</strong></p>

        <form onSubmit={handleSubmit} className={styles.otpForm}>
          <div className={styles.otpInputs} style={{ direction: 'ltr' }}>
            {otp.map((d, i) => (
              <input
                key={i}
                ref={el => (otpRefs.current[i] = el)}
                type="text"
                maxLength="1"
                value={d}
                onChange={e => handleOtpChange(i, e.target.value)}
                className={styles.otpInput}
                onKeyDown={e => e.key === 'Backspace' && !d && i > 0 && otpRefs.current[i - 1]?.focus()}
              />
            ))}
          </div>

          <div className={styles.inputGroup}>
            <label>🔐 كلمة المرور الجديدة</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="6 أحرف أو أكثر"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>🔐 تأكيد كلمة المرور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="أعد إدخال كلمة المرور"
            />
          </div>

          <button type="submit" className={styles.confirmButton}>تأكيد</button>
        </form>

        {!!message && <p className={styles.message}>{message}</p>}

        <div className={styles.footerLinks}>
          <button
            className={`${styles.resendLink} ${resendDisabled ? styles.disabled : ''}`}
            onClick={resendOtp}
            disabled={resendDisabled}
          >
            📩 {resendDisabled ? `إعادة خلال ${counter}ث` : 'إعادة إرسال الرمز'}
          </button>
        </div>
        {!!resendMessage && <p className={styles.message}>{resendMessage}</p>}
      </div>
    </div>
  );
}

