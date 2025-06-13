import React, { useState, useEffect } from 'react';
import styles from './OtpPage.module.css';
import background from './../../assets/background.jpg';
import { useNavigate } from 'react-router-dom';

export default function OtpAndResetPassword() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [counter, setCounter] = useState(0);

  const navigate = useNavigate();
  const email = localStorage.getItem("recoveryEmail");
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (!email) navigate('/recoverpassword');

    setTimeout(() => {
      const lastInput = document.getElementById("otp-5");
      if (lastInput) lastInput.focus();
    }, 0);
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
    if (/^\d?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
      if (value && index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    }
  };

  const resendOtp = async () => {
    try {
      setResendDisabled(true);
      setCounter(30);
      setResendMessage('');

      const response = await fetch('https://ourheritage.runasp.net/api/Auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const text = await response.text();
      console.log("Resend OTP Response:", response.status, text);

      if (response.ok) {
        setResendMessage("✅ تم إرسال الرمز مرة أخرى إلى بريدك الإلكتروني.");
      } else {
        setResendMessage(`❌ ${text || "فشل إرسال الرمز."}`);
      }
    } catch {
      setResendMessage("❌ فشل الاتصال بالخادم.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      setMessage("❌ أدخل رمز مكون من 6 أرقام.");
      return;
    }

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
        body: JSON.stringify({
          otpCode: code,
          newPassword: password,
          confirmPassword: confirmPassword
        })
      });

      const text = await response.text();
      console.log("Reset Password Response:", response.status, text);

      if (response.ok) {
        setMessage("✅ تم تعيين كلمة المرور بنجاح.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("recoveryEmail");
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(`❌ ${text || "فشل في تعيين كلمة المرور."}`);
      }
    } catch (err) {
      console.error("Reset Password Error:", err);
      setMessage("❌ فشل الاتصال بالخادم.");
    }
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${background})` }}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>رمز OTP وتعيين كلمة المرور</h2>
        <p>📧 تم إرسال الرمز إلى: <strong>{email}</strong></p>

        <form onSubmit={handleSubmit} className={styles.otpForm}>
          <div className={styles.otpInputs} style={{ direction: 'rtl' }}>
            {[...otp.keys()].reverse().map((_, index) => {
              const actualIndex = 5 - index;
              return (
                <input
                  key={actualIndex}
                  id={`otp-${actualIndex}`}
                  type="text"
                  maxLength="1"
                  value={otp[actualIndex]}
                  onChange={(e) => handleOtpChange(actualIndex, e.target.value)}
                  className={styles.otpInput}
                  style={{ textAlign: "center" }}
                />
              );
            })}
          </div>

          <div className={styles.inputGroup}>
            <label>🔐 كلمة المرور الجديدة</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>🔐 تأكيد كلمة المرور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.confirmButton}>تأكيد</button>
        </form>

        {message && (
          <p className={styles.message} style={{ color: message.includes("✅") ? "green" : "red" }}>
            {message}
          </p>
        )}

        <div className={styles.footerLinks}>
          <span
            className={styles.resendLink}
            onClick={!resendDisabled ? resendOtp : null}
            style={{ opacity: resendDisabled ? 0.5 : 1, cursor: resendDisabled ? "not-allowed" : "pointer" }}
          >
            📩 {resendDisabled ? `إعادة الإرسال خلال ${counter} ثانية` : "إعادة إرسال الرمز"}
          </span>
        </div>

        {resendMessage && (
          <p className={styles.message} style={{ color: resendMessage.includes("✅") ? "green" : "red" }}>
            {resendMessage}
          </p>
        )}
      </div>
    </div>
  );
}
