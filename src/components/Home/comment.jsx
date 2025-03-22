import { useState, useEffect, useContext } from "react";
import { FaComment ,FaTrash} from "react-icons/fa";
import axios from "axios";
import { TokenContext } from "../../Context/TokenContext";

export default function Comment({ post }) {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState(""); // لحفظ التعليق الجديد
    const [comments, setComments] = useState([]); // لحفظ التعليقات
    const [isSubmitting, setIsSubmitting] = useState(false); // لمنع إرسال التعليق عدة مرات
    const { token } = useContext(TokenContext); // استيراد Token من TokenContext
    const [commentCount, setCommentCount] = useState(0); // لحفظ عدد التعليقات
    const [pageIndex, setPageIndex] = useState(1); // الصفحة الحالية
    const [pageSize] = useState(100); // عدد التعليقات لكل صفحة

    // قراءة بيانات المستخدم من localStorage
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    useEffect(() => {
        if (post?.id) {
            fetchComments();  // جلب التعليقات عند تحميل الصفحة أو تغيير الـ ID للمنشور
        }
    }, [post?.id, pageIndex]);  // سيتم التحديث عند تغيير الـ ID الخاص بالمنشور أو الصفحة

    // لتبديل عرض التعليقات
    const toggleComments = async () => {
        setShowComments((prev) => !prev);
        if (!showComments && comments.length === 0) {
            await fetchComments();
        }
    };

    // جلب التعليقات من السيرفر باستخدام المعاملات الجديدة
    const fetchComments = async () => {
        if (!token) {
            console.error("🚨 التوكن غير موجود! لا يمكن جلب التعليقات.");
            return;
        }

        if (!post?.id) {
            console.error("🚨 المنشور غير موجود! لا يمكن جلب التعليقات.");
            return;
        }

        try {
            const response = await axios.get(
                `https://ourheritage.runasp.net/api/Comments/article/${post.id}`,
                {
                    headers: { "Authorization": `Bearer ${token}` },
                    params: {
                        PageIndex: pageIndex,
                        PageSize: pageSize,
                    },
                }
            );

            if (response.status === 200) {
                setComments(response.data.items); // تحديث التعليقات
                setCommentCount(response.data.totalItems); // تحديث عدد التعليقات
            } else {
                console.error("⚠️ فشل في جلب التعليقات، حالة الاستجابة:", response.status);
            }
        } catch (error) {
            console.error("❌ فشل في جلب التعليقات:", error.message);
        }
    };

    // إرسال التعليق
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return;

        // تحقق من وجود بيانات المستخدم في localStorage
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
                'https://ourheritage.runasp.net/api/Comments/add',
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
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

                // تحديث التعليقات بعد إضافة التعليق الجديد
                setComments([...comments, newCommentData]);
                setCommentCount(commentCount + 1);
                setNewComment(""); // إعادة تعيين التعليق الجديد بعد الإرسال
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
        if (!token) return;

        const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا التعليق؟");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(
                `https://ourheritage.runasp.net/api/Comments/delete/${commentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                setComments(comments.filter((comment) => comment.id !== commentId));
                setCommentCount(commentCount - 1);
            }
        } catch (error) {
            console.error("❌ خطأ في حذف التعليق:", error);
        }
    };
    return (
        <div>
            <div
                className="relative flex items-center gap-1 cursor-pointer group"
                onClick={toggleComments}
            >
                <FaComment />
                <span>{commentCount}</span> {/* عرض عدد التعليقات */}
            </div>

            {showComments && (
                <div className="mt-4">
                    <div>
                        <h3 className="text-lg font-bold">التعليقات</h3>
                        <div
                            className="comments-container"
                            style={{
                                maxHeight: "300px",
                                overflowY: "auto",
                                border: "1px solid #ddd",
                                padding: "10px",
                                borderRadius: "8px",
                            }}
                        >
                            {comments.length === 0 ? (
                                <p>لا توجد تعليقات بعد</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="border-b py-2">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={`path/to/images/${comment.userProfilePicture}`}
                                                alt={comment.nameOfUser}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <span className="font-bold">{comment.nameOfUser}</span>
                                            {comment.userId === userId && (
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleDeleteComment(comment.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                                        </div>
                                        <p>{comment.content}</p>
                                        <span className="text-sm text-gray-500">{new Date(comment.dateCreated).toLocaleString()}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleCommentSubmit} className="mt-4">
                        <textarea
                            className="w-full p-2 border"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="اكتب تعليقك هنا..."
                            rows="4"
                        />
                        <button
                            type="submit"
                            className="mt-2 p-2 bg-blue-500 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "إرسال..." : "أضف تعليق"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
