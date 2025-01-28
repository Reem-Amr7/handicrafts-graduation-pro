import React, { useState } from 'react';
import styles from "./Register.module.css"; // استيراد الأنماط
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [userMessage, setUserMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();

  function validate(values) {
    let errors = {};
    if (!values.name) {
      errors.name = "الاسم مطلوب";
    } else if (values.name.length < 3) {
      errors.name = "يجب أن يكون الاسم على الأقل 3 أحرف";
    }
    if (!values.email) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'بريد إلكتروني غير صحيح';
    }

    if (!values.password) {
      errors.password = "كلمة المرور مطلوبة";
    } else if (!/^[A-Z][a-z0-9]{3,8}$/i.test(values.password)) {
      errors.password = "كلمة مرور غير صحيحة";
    }
    if (!values.rePassword) {
      errors.rePassword = "تأكيد كلمة المرور مطلوب";
    } else if (values.rePassword !== values.password) {
      errors.rePassword = "كلمة المرور غير متطابقة";
    }

    if (!values.phone) {
      errors.phone = "رقم الهاتف مطلوب";
    } else if (!/^(002)?01[0125][0-9]{8}$/i.test(values.phone)) {
      errors.phone = "رقم هاتف غير صحيح";
    }

    if (!values.gender) {
      errors.gender = "النوع مطلوب";
    }

    if (!values.birthDate) {
      errors.birthDate = "تاريخ الميلاد مطلوب";
    } else if (new Date(values.birthDate) > new Date()) {
      errors.birthDate = "تاريخ الميلاد غير صحيح";
    }
    return errors;
  }

  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
      gender: "", 
      birthDate: "" 
    },
    validate,
    onSubmit: (values) => {
      registerForm(values);
    },
  });

  async function registerForm(values) {
    setIsLoading(true); 
    return await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signup", values)
      .then((data) => {
        console.log(data.data.message);
        setUserMessage(data.data.message);
        setIsLoading(false);
        navigate('/login');
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setErrorMessage(err.response.data.message);
        setIsLoading(false);
      });
  }

  const handleLoginClick = () => {
    navigate('/login'); 
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className='text-3xl text-center mb-6'>إنشاء حساب</h1>
        {userMessage ? (
          <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
            <p>{userMessage}</p>
          </div>
        ) : null}
        {errorMessage ? (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <p>{errorMessage}</p>
          </div>
        ) : null}
        <form onSubmit={formik.handleSubmit}>
          <div className='my-2'>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">الاسم</label>
            <input
              name="name"
              type="text"
              id="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              onBlur={formik.handleBlur}
              className=" border border-[#A68B55] text-white text-sm rounded-lg focus:ring-[#A68B55] focus:border-[#A68B55] block w-full p-2.5"
              placeholder="أدخل الاسم"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <p>{formik.errors.name}</p>
              </div>
            ) : null}
          </div>

          <div className='my-2'>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">البريد الإلكتروني</label>
            <input
              name="email"
              type="email"
              id="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
              className=" border border-[#A68B55] text-white text-sm rounded-lg focus:ring-[#A68B55] focus:border-[#A68B55] block w-full p-2.5"
              placeholder="أدخل البريد الإلكتروني"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <p>{formik.errors.email}</p>
              </div>
            ) : null}
          </div>

          <div className='my-2'>
            <label htmlFor="password" className="block mb-2 text-sm font-medium">كلمة المرور</label>
            <input
              name="password"
              type="password"
              id="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              className=" border border-[#A68B55] text-white text-sm rounded-lg focus:ring-[#A68B55] focus:border-[#A68B55] block w-full p-2.5"
              placeholder="أدخل كلمة المرور"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <p>{formik.errors.password}</p>
              </div>
            ) : null}
          </div>

          <div className='my-2'>
            <label htmlFor="rePassword" className="block mb-2 text-sm font-medium">تأكيد كلمة المرور</label>
            <input
              name="rePassword"
              type="password"
              id="rePassword"
              onChange={formik.handleChange}
              value={formik.values.rePassword}
              onBlur={formik.handleBlur}
              className=" border border-[#A68B55] text-white text-sm rounded-lg focus:ring-[#A68B55] focus:border-[#A68B55] block w-full p-2.5"
              placeholder="أعد إدخال كلمة المرور"
            />
            {formik.touched.rePassword && formik.errors.rePassword ? (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <p>{formik.errors.rePassword}</p>
              </div>
            ) : null}
          </div>

          <div className='my-2'>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium">رقم الهاتف</label>
            <input
              name="phone"
              type="tel"
              id="phone"
              onChange={formik.handleChange}
              value={formik.values.phone}
              onBlur={formik.handleBlur}
              className=" border border-[#A68B55] text-white text-sm rounded-lg focus:ring-[#A68B55] focus:border-[#A68B55] block w-full p-2.5"
              placeholder="أدخل رقم الهاتف"
            />
            {formik.touched.phone && formik.errors.phone ? (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <p>{formik.errors.phone}</p>
              </div>
            ) : null}
          </div>

          <div className='my-2'>
            <label className="block mb-2 text-sm font-medium">النوع</label>
            <div className="flex items-center">
              <input
                type="radio"
                id="male"
                name="gender"
                value="ذكر"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-4 h-4 text-[#A68B55] bg-gray-100 border-gray-300 rounded focus:ring-[#A68B55]"
              />
              <label htmlFor="male" className="ml-2 text-sm">ذكر</label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="radio"
                id="female"
                name="gender"
                value="أنثى"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-4 h-4 text-[#A68B55] bg-gray-100 border-gray-300 rounded focus:ring-[#A68B55]"
              />
              <label htmlFor="female" className="ml-2 text-sm">أنثى</label>
            </div>
            {formik.touched.gender && formik.errors.gender ? (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <p>{formik.errors.gender}</p>
              </div>
            ) : null}
          </div>

          <div className='my-2'>
            <label htmlFor="birthDate" className="block mb-2 text-sm font-medium">تاريخ الميلاد</label>
            <input
              name="birthDate"
              type="date"
              id="birthDate"
              onChange={formik.handleChange}
              value={formik.values.birthDate}
              onBlur={formik.handleBlur}
              className="bg-[#A68B55] border border-[#A68B55] text-white text-sm rounded-lg focus:ring-[#A68B55] focus:border-[#A68B55] block w-full p-2.5"
            />
            {formik.touched.birthDate && formik.errors.birthDate ? (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <p>{formik.errors.birthDate}</p>
              </div>
            ) : null}
          </div>

          <div className='my-4 text-end'>
            {isLoading ? (
              <button type='submit' className='bg-[#2E230D] text-white px-4 py-2 rounded-lg w-full'>
                <i className='fa fa-spinner fa-spin'></i>
              </button>
            ) : (
              <button type='submit' className='bg-[#2E230D] text-white px-4 py-2 rounded-lg w-full'>إنشاء حساب</button>
            )}
          </div>

          <div className='text-center mt-4'>
            <p className="text-sm">
              لديك حساب بالفعل؟{' '}
              <span
                onClick={handleLoginClick}
                className="text-[#A68B55] hover:underline cursor-pointer"
              >
                تسجيل الدخول
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}