import { useState, useContext } from "react";
import axios from "axios";
import { TokenContext } from "../../Context/TokenContext";
import { usePostContext } from "../../Context/PostContext";

export default function DeletePost({ postId }) {
  const { token } = useContext(TokenContext);
  const { posts, setPosts } = usePostContext();
  const [error, setError] = useState(null);

  const deletePost = async () => {
    // تأكيد الحذف
    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا المنشور؟");
    if (!confirmDelete) return;  // إلغاء الحذف إذا لم يوافق المستخدم

    if (!token) {
      setError("يجب أن تكون مسجلاً للدخول لحذف المنشورات.");
      return;
    }

    try {
      const apiUrl = `https://ourheritage.runasp.net/api/Articles/${postId}`;
      console.log("حذف المنشور، الاتصال بـ API:", apiUrl);

      const res = await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,  // الانتظار لمدة 10 ثوانٍ
      });

      console.log("الاستجابة من الـ API:", res);

      if (res.status === 200) {
        console.log("✅ المنشور تم حذفه بنجاح", res.data);
        setPosts(posts.filter((post) => post.id !== postId));  
      } else {
        setError(`حدث خطأ في الحذف. حالة الاستجابة: ${res.status}`);
      }
    } catch (err) {
      console.error("❌ خطأ في حذف المنشور:", err);

      if (err.response) {
        // إذا كان هناك استجابة من الخادم
        console.error("الاستجابة من الخادم:", err.response);
        setError(`خطأ من الخادم: ${err.response.status} - ${err.response.data.message || "حدث خطأ أثناء الحذف."}`);
      } else if (err.code === 'ECONNABORTED') {
        setError("الطلب استغرق وقتًا طويلاً. يرجى المحاولة لاحقًا.");
      } else if (err.message === "Network Error") {
        setError("حدث خطأ في الشبكة. يرجى التحقق من الاتصال.");
      } else {
        setError("حدث خطأ أثناء حذف المنشور. حاول مرة أخرى.");
      }
    }
  };

  console.log("Post ID:", postId);

  return (
    <div className="cursor-pointer hover:bg-gray-100 p-2">
      <p className="font-semibold text-red-600" onClick={deletePost}>
        حذف المنشور
      </p>
      <p className="text-sm text-gray-500">إذا كان المنشور غير مناسب عن طريق الخطأ</p>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
