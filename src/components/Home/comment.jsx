import { useState, useEffect, useContext } from "react";
import { FaComment, FaTrash, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { TokenContext } from "../../Context/TokenContext";
import styles from "../Profile/Profile.module.css";

export default function Comment({ post }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const { token } = useContext(TokenContext);
  const [commentCount, setCommentCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(100);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (post?.id) {
      fetchComments();
    }
  }, [post?.id, pageIndex]);

  const fetchComments = async () => {
    if (!token || !post?.id) {
      console.error("🚨 بيانات مفقودة لجلب التعليقات.");
      return;
    }

    try {
      const response = await axios.get(
        `https://ourheritage.runasp.net/api/Comments/article/${post.id}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Accept': '*/*'
          },
          params: {
            PageIndex: pageIndex,
            PageSize: pageSize,
          },
        }
      );

      if (response.status === 200) {
        // التعامل مع البيانات سواء كانت array مباشرة أو object يحتوي على items
        const commentsData = Array.isArray(response.data) ? response.data : (response.data.items || []);
        setComments(commentsData);
        setCommentCount(response.data.totalItems || commentsData.length);
        setError(null);
      }
    } catch (error) {
      console.error("❌ فشل في جلب التعليقات:", error.message);
      setError("خطأ في جلب التعليقات");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    if (!userId || !userName) {
      console.error("UserId أو UserName غير موجودين في localStorage");
      setError("خطأ في بيانات المستخدم");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // جرب أولاً API الجديد
      let response;
      try {
        response = await axios.post(
          "https://ourheritage.runasp.net/api/Comments",
          {
            content: newComment,
            culturalArticleId: post.id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (newApiError) {
        // إذا فشل، جرب API القديم
        const formData = new FormData();
        formData.append("Content", newComment);
        formData.append("UserId", userId);
        formData.append("CulturalArticleId", post.id);
        formData.append("DateCreated", new Date().toISOString());

        response = await axios.post(
          "https://ourheritage.runasp.net/api/Comments/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        // إعادة جلب التعليقات لضمان الحصول على البيانات المحدثة
        await fetchComments();
        setNewComment("");
      }
    } catch (error) {
      console.error("خطأ في إرسال التعليق:", error);
      setError("فشل في إضافة التعليق");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) {
      console.error("❌ لا يوجد توكن.");
      setError("خطأ في التوثيق");
      return;
    }

    const comment = comments.find(c => c.id === commentId);
    if (!comment) {
      console.error("❌ التعليق غير موجود.");
      setError("التعليق غير موجود");
      return;
    }

    // التأكد من أن المستخدم يملك التعليق أو يملك المنشور
    const canDelete = comment.userId === parseInt(userId) || 
                     comment.userId === userId || 
                     post.userId === parseInt(userId) ||
                     post.userId === userId;

    if (!canDelete) {
      console.error("❌ لا يمكنك حذف هذا التعليق.");
      setError("ليس لديك صلاحية لحذف هذا التعليق");
      return;
    }

    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا التعليق؟");
    if (!confirmDelete) return;

    setDeletingCommentId(commentId);
    setError(null);

    try {
      const response = await axios.delete(
        `https://ourheritage.runasp.net/api/Comments/${commentId}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Accept': '*/*'
          },
        }
      );

      if (response.status === 200) {
        // إزالة التعليق من القائمة المحلية
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        setCommentCount(prevCount => Math.max(0, prevCount - 1));
        console.log("✅ تم حذف التعليق بنجاح");
      }
    } catch (error) {
      console.error("❌ خطأ في حذف التعليق:", error);
      
      if (error.response?.status === 404) {
        setError("التعليق غير موجود أو تم حذفه مسبقاً");
        // إزالة التعليق من القائمة إذا كان غير موجود
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        setCommentCount(prevCount => Math.max(0, prevCount - 1));
      } else if (error.response?.status === 403) {
        setError("ليس لديك صلاحية لحذف هذا التعليق");
      } else if (error.response?.status === 401) {
        setError("انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول");
      } else {
        setError("فشل في حذف التعليق، حاول مرة أخرى");
      }
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/40";
  };

  return (
    <div className="mt-4">
      {/* عرض رسائل الخطأ */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-right text-red-500 hover:text-red-700 ml-2"
          >
            ×
          </button>
        </div>
      )}

      <div className={`flex items-center gap-1 cursor-pointer ${styles.postActionButton}`}>
        {/* يمكنك إضافة محتوى إضافي هنا إذا لزم الأمر */}
      </div>

      {/* قائمة التعليقات */}
      {comments.length > 0 && (
        <div className="comment-list mt-4 space-y-3">
          <h4 className="font-semibold text-gray-800 mb-3">
            التعليقات ({commentCount})
          </h4>
          
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="comment bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="comment-header flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={comment.userProfilePicture || comment.user?.profilePicture || "https://via.placeholder.com/40"}
                    alt="صورة المعلق"
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                    onError={handleImageError}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {comment.nameOfUser || comment.user?.fullName || comment.user?.userName || "مستخدم مجهول"}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.dateCreated || comment.createdAt).toLocaleString('ar-EG', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* زر الحذف */}
                {(comment.userId === parseInt(userId) || 
                  comment.userId === userId || 
                  post.userId === parseInt(userId) ||
                  post.userId === userId) && (
                  <button
                    title="حذف التعليق"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors disabled:opacity-50"
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={deletingCommentId === comment.id}
                  >
                    {deletingCommentId === comment.id ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FaTrash size={14} />
                    )}
                  </button>
                )}
              </div>
              
              <p className="comment-text mt-3 text-sm text-gray-700 leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* عدم وجود تعليقات */}
      {comments.length === 0 && !error && (
        <div className="text-center py-6 text-gray-500">
          <FaComment className="mx-auto mb-2 text-2xl text-gray-400" />
          <p>لا توجد تعليقات بعد</p>
          <p className="text-sm">كن أول من يعلق على هذا المنشور</p>
        </div>
      )}

      {/* نموذج إضافة تعليق */}
      <form onSubmit={handleCommentSubmit} className="mt-6">
        <div className="relative w-full">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="اكتب تعليق..."
            className="w-full p-3 pr-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B22222] focus:border-transparent transition-all"
            disabled={isSubmitting}
          />
          {newComment.trim() && (
            <button
              type="submit"
              className="absolute left-1 top-0 bottom-0 hover:text-[#8B0000] transition-colors text-sm w-8 flex items-center justify-center leading-none bg-transparent border-none"
              disabled={isSubmitting}
              title="إرسال التعليق"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-[#B22222] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaPaperPlane className="text-lg text-gray-500" />
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}