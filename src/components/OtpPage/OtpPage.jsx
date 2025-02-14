import React, { useState } from 'react';
import background from "./../../assets/background.jpg";
import styles from "./OtpPage.module.css";
import { useNavigate } from 'react-router-dom';

export default function OtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  let navigate = useNavigate();

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // alert("OTP Submitted: " + otp.join(""));
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${background})` }}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>رمز OTP</h2>
        <p className={styles.description}>لقد أرسلنا رمزًا إلى بريدك الإلكتروني</p>
        <form onSubmit={handleSubmit} className={styles.otpForm}>
          <div className={styles.otpInputs}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className={styles.otpInput}
              />
            ))}
          </div>
          <button type="submit" onClick={() => navigate('/newpassword')} className={styles.confirmButton}>تأكيد</button>
        </form>
        <div className={styles.footerLinks}>
          <span onClick={() => alert("إعادة إرسال الرمز")} className={styles.resendLink}>إعادة إرسال الرمز</span>
          <span onClick={() => navigate('/repassword')} className={styles.backLink}>الرجوع</span>
        </div>
      </div>
    </div>
  );
}
