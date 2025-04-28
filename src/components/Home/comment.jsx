import { useState, useEffect, useContext } from "react";
import { FaComment, FaTrash, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { TokenContext } from "../../Context/TokenContext";

export default function Comment({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useContext(TokenContext);
  const [commentCount, setCommentCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(100);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (post?.id) {
      fetchComments();
    }
  }, [post?.id, pageIndex]);

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      await fetchComments(); // جلب التعليقات إذا كانت غير موجودة
    }
    setShowComments((prev) => !prev); // تغيير حالة العرض للتعليقات
  };

  const fetchComments = async () => {
    if (!token || !post?.id) {
      console.error("🚨 بيانات مفقودة لجلب التعليقات.");
      return;
    }

    try {
      const response = await axios.get(
        `https://ourheritage.runasp.net/api/Comments/article/${post.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            PageIndex: pageIndex,
            PageSize: pageSize,
          },
        }
      );

      if (response.status === 200) {
        setComments(response.data.items);
        setCommentCount(response.data.totalItems);
      } else {
        console.error("⚠️ فشل في جلب التعليقات:", response.status);
      }
    } catch (error) {
      console.error("❌ فشل في جلب التعليقات:", error.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    if (!userId || !userName) {
      console.error("UserId أو UserName غير موجودين في localStorage");
      return;
    }

    const formData = new FormData();
    formData.append("Content", newComment);
    formData.append("UserId", userId);
    formData.append("CulturalArticleId", post.id);
    formData.append("DateCreated", new Date().toISOString());

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://ourheritage.runasp.net/api/Comments/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const newCommentData = {
          id: response.data.id || comments.length + 1,
          content: newComment,
          userId: userId,
          dateCreated: new Date().toISOString(),
          nameOfUser: userName,
          userProfilePicture: "default.jpg",
        };

        setComments([...comments, newCommentData]);
        setCommentCount(commentCount + 1);
        setNewComment("");
      } else {
        console.error("خطأ: ", response.status, response.data);
      }
    } catch (error) {
      console.error("خطأ في إرسال التعليق:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) {
      console.error("❌ لا يوجد توكن.");
      return;
    }
  
    const comment = comments.find(c => c.id === commentId); // العثور على التعليق باستخدام commentId
    if (!comment) {
      console.error("❌ التعليق غير موجود.");
      return;
    }
  
    if (comment.userId !== userId) {
      console.error("❌ لا يمكنك حذف تعليق ليس لك.");
      return;
    }
  
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا التعليق؟");
    if (!confirmDelete) return;
  
    try {
      const response = await axios.delete(
        `https://ourheritage.runasp.net/api/Comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 200) {
        setComments(comments.filter((comment) => comment.id !== commentId));
        setCommentCount(commentCount - 1);
      } else {
        console.error("⚠️ فشل في حذف التعليق:", response.status, response.data);
      }
    } catch (error) {
      console.error("❌ خطأ في حذف التعليق:", error);
      console.error("تفاصيل الخطأ:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <div
        className="relative flex items-center gap-1 cursor-pointer group"
        onClick={toggleComments}
      >
        <FaComment />
        <span>{commentCount}</span>
      </div>

      {showComments && (
        <div className="comment-list mt-4">
          {comments.length === 0 && <p>لا توجد تعليقات حتى الآن.</p>}
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="comment mb-3 pb-3 border-b border-gray-200"
            >
              <div className="comment-header flex items-center">
                <img
                  src="https://via.placeholder.com/40"
                  alt="صورة المعلق"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                  <h4 className="font-semibold">{comment.nameOfUser}</h4>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.dateCreated).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="comment-text mt-2 text-sm">{comment.content}</p>

              <div className="comment-actions flex items-center gap-4 mt-2">
                {comment.userId === userId && (
                  <button
                    title="حذف التعليق"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleCommentSubmit} className="mt-4">
        <div className="relative w-full">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="اكتب تعليق"
            className="w-full p-2 pr-10 border rounded-md focus:outline-none"
          />
          <button
            type="submit"
            className="absolute inset-y-0 left-1 top-2 flex items-center text-blue-500 w-10 h-5 bg-white"
            disabled={isSubmitting}
          >
            <FaPaperPlane className="text-xl" />
          </button>
        </div>
      </form>
    </div>
  );
}
