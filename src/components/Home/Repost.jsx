import { useState, useContext } from "react";
import axios from "axios";
import { FaTimes, FaShareAlt, FaRedo } from "react-icons/fa";
import { TokenContext } from "../../Context/TokenContext";
import styles from "../Profile/Profile.module.css";
export default function Repost({ post, userId = 0, onSuccess }) {
    const { token } = useContext(TokenContext);
    const [repostModalOpen, setRepostModalOpen] = useState(false);
    const [repostContent, setRepostContent] = useState("");
    const [error, setError] = useState(null);

    const openRepostModal = () => {
        setRepostModalOpen(true);
        setError(null);
    };

    const closeRepostModal = () => {
        setRepostModalOpen(false);
        setRepostContent("");
        setError(null);
    };

    const handleRepost = async () => {
        if (!post?.id) return;

        try {
            const response = await axios.post(
                "https://ourheritage.runasp.net/api/Repost/repost-cultural-article",
                {
                    userId: parseInt(userId),
                    culturalArticleId: post.id,
                    content: repostContent || " ",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "*/*",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert("تم إعادة النشر بنجاح!");
                closeRepostModal();
                if (onSuccess) onSuccess();
            } else {
                setError("فشل إعادة النشر. حاول مرة أخرى.");
            }
        } catch (err) {
            console.error("خطأ في إعادة النشر:", err);
            setError("حدث خطأ أثناء إعادة النشر. حاول مرة أخرى.");
        }
    };

    return (
        <>
           


   <div className={`flex items-center gap-2 cursor-pointer ${styles.postActionButton}`} onClick={openRepostModal}>
                      <span className="text-xl ml-1">إعادة نشر</span><FaRedo />
                    </div>
            {repostModalOpen && (
                <div
                    className="fixed inset-0 bg-[#f5f5dc] bg-opacity-60 flex justify-center items-center z-50"
                    onClick={closeRepostModal}
                >
                    <div
                        className="bg-white w-[90%] max-w-md p-6 rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4 text-2xl">
                            <h3 className="text-lg font-bold text-[#5C4033]">إعادة نشر</h3>
                            <FaTimes
                                className=" text-gray-400 hover:text-gray-700 cursor-pointer text-2xl"
                                onClick={closeRepostModal}
                            />
                        </div>

                        {/* Original Post Preview */}
                        <div className="border border-gray-200 rounded p-4 mb-4 bg-gray-50">
                            <div className="flex items-center mb-2">
                                {post?.user?.profilePicture ? (
                                    <img
                                        src={post.user.profilePicture}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full ml-2"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 ml-2" />
                                )}
                                <div>
                                    <p className="text-[#5C4033] font-semibold">
                                        {post?.user?.fullName || "مستخدم غير معروف"}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {post?.createdAt
                                            ? new Date(post.createdAt).toLocaleDateString("ar-EG", {
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                              })
                                            : "تاريخ غير معروف"}
                                    </p>
                                </div>
                            </div>
                            <p className="text-[#5C4033] mb-2">{post?.content || "لا يوجد محتوى"}</p>
                            {post?.media && (
                                <img
                                    src={post.media}
                                    alt="Post media"
                                    className="w-full h-auto rounded max-h-60 object-cover"
                                />
                            )}
                        </div>

                        {/* Repost Comment Input */}
                        <textarea
                            className="w-full p-2 border rounded mb-4 text-[#5C4033]"
                            placeholder="أضف تعليقًا لإعادة النشر (اختياري)"
                            value={repostContent}
                            onChange={(e) => setRepostContent(e.target.value)}
                        />

                        {error && <p className="text-red-600 mb-4">{error}</p>}

                        <div className="flex justify-end">
                            <button
                                className="bg-[#B22222] text-xl text-white px-4 py-2 rounded hover:bg-[#8B4513]"
                                onClick={handleRepost}
                            >
                                إعادة نشر
                            </button>
                            <button
                                className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                                onClick={closeRepostModal}
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}