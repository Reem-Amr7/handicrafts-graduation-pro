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
      const res = await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        console.log("✅ المنشور تم حذفه بنجاح", res.data);
        setPosts(posts.filter((post) => post.id !== postId));  
      }
    } catch (err) {
      console.error("❌ خطأ في حذف المنشور:", err);
      setError("حدث خطأ أثناء حذف المنشور. حاول مرة أخرى.");
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
