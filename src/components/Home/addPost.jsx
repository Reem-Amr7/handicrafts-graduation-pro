import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TokenContext } from '../../Context/TokenContext';

export default function AddPost() {
  const { token } = useContext(TokenContext);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    imageUrl: '',
    dateCreated: new Date().toISOString(),
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    // if (!formData.title || !formData.content || !formData.categoryId || !formData.imageUrl) {
    //   setErrorMessage('يرجى تعبئة جميع الحقول المطلوبة');
    //   return;
    // }

    if (!token) {
      setErrorMessage('لم يتم العثور على التوكن، يرجى تسجيل الدخول');
      navigate("/login");
      return;
    }

    if (!userId) {
      setErrorMessage('لم يتم العثور على معرف المستخدم، يرجى تسجيل الدخول');
      navigate("/login");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('Id', '');
    formDataToSend.append('Title', formData.title);
    formDataToSend.append('Content', formData.content);
    formDataToSend.append('CategoryId', formData.categoryId);
    formDataToSend.append('UserId', userId);
    formDataToSend.append('DateCreated', new Date().toISOString());
    formDataToSend.append('ImageURL', formData.imageUrl);

    try {
      const response = await axios.post(
        'https://ourheritage.runasp.net/api/Articles',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('تم إضافة المنشور بنجاح');
        setFormData({
          title: '',
          content: '',
          categoryId: '',
          imageUrl: '',
          dateCreated: new Date().toISOString(),
        });
        setShowModal(false);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(`حدث خطأ: ${error.response.data.message || 'تعذر الاتصال بالخادم'}`);
      } else if (error.request) {
        setErrorMessage('لم يتم الرد من الخادم، تحقق من الاتصال بالإنترنت');
      } else {
        setErrorMessage('حدث خطأ غير معروف. يرجى المحاولة لاحقًا');
      }
    }
  };

  return (
    <div className="p-5">
      <h2 className="mb-4">إضافة منشور جديد</h2>
      <button
        onClick={() => setShowModal(true)}
        className="w-full border p-2 rounded-md bg-[#A68B55] text-white"
      >
        إضافة منشور
      </button>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-4 text-gray-600 text-2xl"
            >
              ×
            </button>
            <h3 className="mb-4 text-center text-lg font-semibold">إضافة منشور</h3>
            
            {errorMessage && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                <p>{errorMessage}</p>
              </div>
            )}
            {successMessage && (
              <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
                <p>{successMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block mb-1 font-medium">العنوان</label>
                <input
                  name="title"
                  type="text"
                  id="title"
                  onChange={handleInputChange}
                  value={formData.title}
                  className="w-full border p-2 rounded-md"
                  placeholder="أدخل العنوان"
                />
              </div>

              <div>
                <label htmlFor="content" className="block mb-1 font-medium">المحتوى</label>
                <textarea
                  name="content"
                  id="content"
                  onChange={handleInputChange}
                  value={formData.content}
                  className="w-full border p-2 rounded-md"
                  placeholder="أدخل محتوى المنشور"
                />
              </div>

              <div>
                <label htmlFor="categoryId" className="block mb-1 font-medium">فئة المنشور</label>
                <input
                  name="categoryId"
                  type="number"
                  id="categoryId"
                  onChange={handleInputChange}
                  value={formData.categoryId}
                  className="w-full border p-2 rounded-md"
                  placeholder="أدخل رقم الفئة"
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="block mb-1 font-medium">رابط الصورة</label>
                <input
                  name="imageUrl"
                  type="text"
                  id="imageUrl"
                  onChange={handleInputChange}
                  value={formData.imageUrl}
                  className="w-full border p-2 rounded-md"
                  placeholder="أدخل رابط الصورة"
                />
              </div>

              <button type="submit" className="bg-[#2E230D] text-white px-4 py-2 rounded-lg w-full">
                إضافة المنشور
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
