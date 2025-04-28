import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import Post from './Post';
import Suggest from './Suggest';
import axios from 'axios';

export default function Maincontent() {
  const [posts, setPosts] = useState([]); // حالة لتخزين البوستات
  const [newPostContent, setNewPostContent] = useState(''); // حالة لتخزين محتوى البوست الجديد
  const [loading, setLoading] = useState(true); // حالة للتحميل
  const [error, setError] = useState(null); // حالة للخطأ

  useEffect(() => {
    fetchPosts(); // جلب البوستات عند تحميل المكون
  }, []);

  const fetchPosts = async () => {
    const token = localStorage.getItem('userToken'); // جلب التوكن من localStorage
    const userId = localStorage.getItem('userId'); // جلب userId من localStorage

    if (!token || !userId) {
      setError('يجب تسجيل الدخول أولاً');
      setLoading(false);
      return;
    }

    try {
      // جلب البوستات الخاصة بالمستخدم من API
      const postsResponse = await axios.get(`https://ourheritage.runasp.net/api/Posts?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(postsResponse.data); // تخزين البوستات
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('حدث خطأ أثناء جلب المنشورات');
    } finally {
      setLoading(false); // إيقاف حالة التحميل
    }
  };

  const handleAddPost = async () => {
    const token = localStorage.getItem('userToken'); // جلب التوكن من localStorage
    const userId = localStorage.getItem('userId'); // جلب userId من localStorage

    if (!token || !userId) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      // إرسال بوست جديد إلى API
      const response = await axios.post(
        'https://ourheritage.runasp.net/api/Posts',
        {
          title: 'منشور جديد', // يمكنك تعديل العنوان إذا كان مطلوبًا
          content: newPostContent,
          userId: userId, // إرسال userId مع البوست
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // إضافة البوست الجديد إلى القائمة
      setPosts([response.data, ...posts]);
      setNewPostContent(''); // مسح حقل الإدخال
    } catch (error) {
      console.error('Error adding post:', error);
      setError('حدث خطأ أثناء إضافة المنشور');
    }
  };

  if (loading) {
    return <div>جاري التحميل...</div>; // عرض رسالة تحميل
  }

  if (error) {
    return <div>{error}</div>; // عرض رسالة خطأ
  }

  return (
    <>
      <main className="col-span-6 p-9 rounded-lg">
        <div className={`p-5 h-44 ${styles.leftside}`}>
          <h2 className="mb-4">إضافة منشور جديد</h2>
          <input
            type="text"
            placeholder="ماذا تفكر؟"
            className="w-full border p-2 rounded-md"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button
            onClick={handleAddPost}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            نشر
          </button>
        </div>
        <Suggest />

        {/* عرض البوستات الخاصة بالمستخدم */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post.id}
              title={post.title}
              content={post.content}
              createdAt={post.createdAt}
            />
          ))
        ) : (
          <p>لا توجد منشورات.</p>
        )}
      </main>
    </>
  );
}