import React, { useState, useContext } from 'react';
import background from "./../../assets/background.jpg";
import styles from "./OtpPage.module.css";
import { useNavigate } from 'react-router-dom';
import { TokenContext } from "../../Context/TokenContext"; // ← إضافة الكونتكست

export default function OtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { token } = useContext(TokenContext); // ← استدعاء التوكن من الكونتكست

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (value && nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length < 6) {
      setMessage("❌ الرجاء إدخال رمز مكون من 6 أرقام.");
      return;
    }

    // حاليًا مفيش endpoint رسمي لـ verify-otp
    // لذلك هننتقل فورًا
    setMessage("✅ تم إدخال الرمز بنجاح.");
    setTimeout(() => {
      navigate('/newpassword');
    }, 1000);
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch('https://ourheritage.runasp.net/api/Auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ← إرسال التوكن هنا
        }
        // body: JSON.stringify({ email }) ← لو احتجتي لاحقًا تضيفي إيميل
      });

      if (response.ok) {
        setMessage("✅ تم إرسال الرمز بنجاح.");
      } else {
        setMessage("❌ حدث خطأ أثناء الإرسال.");
      }
    } catch (error) {
      setMessage("❌ فشل الاتصال بالخادم.");
    }
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${background})` }}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>رمز OTP</h2>
        <p className={styles.description}>لقد أرسلنا رمزًا إلى بريدك الإلكتروني</p>

        {message && <p style={{ color: message.includes("✅") ? "green" : "red", textAlign: "center" }}>{message}</p>}

        <form onSubmit={handleSubmit} className={styles.otpForm}>
          <div className={styles.otpInputs}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className={styles.otpInput}
              />
            ))}
          </div>
          <button type="submit" className={styles.confirmButton}>تأكيد</button>
        </form>

        <div className={styles.footerLinks}>
          <span onClick={handleResendOtp} className={styles.resendLink}>إعادة إرسال الرمز</span>
          <span onClick={() => navigate('/repassword')} className={styles.backLink}>الرجوع</span>
        </div>
      </div>
    </div>
  );
}
