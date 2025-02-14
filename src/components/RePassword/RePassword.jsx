import React, { useState } from 'react';
import background from "./../../assets/background.jpg";
import styles from "./RePassword.module.css";
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RePassword() {
  const [userMessage, setUserMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();

  function validate(values) {
    let errors = {};
    if (!values.email) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'بريد إلكتروني غير صحيح';
    }
    return errors;
  }

  let formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/forgot-password", values);
        setUserMessage(response.data.message);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "حدث خطأ ما");
      }
      setIsLoading(false);
    },
  });

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${background})` }}>
      <div className={styles.formContainer}>
        <h1 className='text-3xl text-center mb-6'>إعادة تعيين كلمة المرور</h1>
        {userMessage && <div className={styles.successMessage}>{userMessage}</div>}
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        <form onSubmit={formik.handleSubmit}>
          <div className='my-2'>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-right w-full">البريد الإلكتروني</label>
            <input
  name="email"
  type="email"
  id="email"
  onChange={formik.handleChange}
  value={formik.values.email}
  onBlur={formik.handleBlur}
  className="border border-[#A68B55] bg-[#A68B55] text-white text-sm rounded-lg focus:ring-[#A68B55] focus:border-[#A68B55] block w-full p-2.5 placeholder-white placeholder-opacity-100"
  placeholder="example@gmail.com"
/>
          </div>
          {formik.touched.email && formik.errors.email && <div className={styles.errorMessage}>{formik.errors.email}</div>}
          <div className='my-4 text-end'>
            {isLoading ? (
              <button type='submit' className='bg-[#2E230D] text-white px-4 py-2 rounded-lg w-full'>
                <i className='fa fa-spinner fa-spin'></i>
              </button>
            ) : (
              <button type='submit' onClick={() => navigate('/otp')} className='bg-[#2E230D] text-white px-4 py-2 rounded-lg w-full'>طلب رابط استعادة</button>
            )}
          </div>
          <div className='text-center mt-4'>
            <p className="text-sm">
              <span onClick={() => navigate('/login')} className="text-[#A68B55] hover:underline cursor-pointer">الرجوع إلى تسجيل الدخول</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
