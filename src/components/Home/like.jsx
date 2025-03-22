import { FaHeart } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { TokenContext } from "../../Context/TokenContext";

export default function Like({ post }) {
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const { token } = useContext(TokenContext);
  const [userId, setUserId] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10)); // تحويله إلى رقم
    } else {
      console.error("⚠️ لا يوجد userId في localStorage!");
    }
  }, []);

  // استرجاع حالة الإعجاب عند تحميل المكون من localStorage
  useEffect(() => {
    const storedLikeStatus = localStorage.getItem(`liked-${post.id}`);
    if (storedLikeStatus === "true") {
      setIsLiked(true); // إذا كانت حالة الإعجاب محفوظة
    }
  }, [post.id]);

  // استرجاع حالة الإعجاب من API عند تحميل المكون
  useEffect(() => {
    const checkIfLiked = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `https://ourheritage.runasp.net/api/Like/check-like?userId=${userId}&culturalArticleId=${post.id}`,
            {
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            }
          );
          if (response.data.isLiked) {
            setIsLiked(true); // إذا كان المستخدم قد أعجب بالمقال
          }
        } catch (error) {
          console.error("فشل في التحقق من حالة الإعجاب:", error);
        }
      }
    };

    checkIfLiked();
  }, [userId, post.id, token]);

  const handleLike = async () => {
    if (!userId) {
      console.error("⚠️ لا يمكن إرسال الإعجاب بدون userId!");
      return;
    }

    if (isLiked) {
      // إزالة الإعجاب
      handleRemoveLike();
      return;
    }

    try {
      const response = await axios.post(
        "https://ourheritage.runasp.net/api/Like/add-like",
        {
          id: 0,
          userId: userId,
          culturalArticleId: post.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      console.log("استجابة API:", response.data);
      setLikeCount((prev) => prev + 1);
      setIsLiked(true); // تحديث حالة الإعجاب بعد نجاح الإعجاب
      localStorage.setItem(`liked-${post.id}`, "true"); // حفظ حالة الإعجاب في localStorage
    } catch (error) {
      console.error("❌ خطأ في إرسال الإعجاب:", error.response?.data || error.message);
    }
  };

  const handleRemoveLike = async () => {
    if (!userId) {
      console.error("⚠️ لا يمكن إزالة الإعجاب بدون userId!");
      return;
    }

    try {
      const response = await axios.delete(
        `https://ourheritage.runasp.net/api/Like/remove-like`,
        {
          params: {
            userId: userId,
            culturalArticleId: post.id,
          },
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      setLikeCount((prev) => prev - 1);
      setIsLiked(false); // إزالة الإعجاب وتحديث الحالة
      localStorage.removeItem(`liked-${post.id}`); // إزالة حالة الإعجاب من localStorage
    } catch (error) {
      console.error("❌ خطأ في إزالة الإعجاب:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex items-center gap-1 cursor-pointer" onClick={handleLike}>
      <FaHeart className={isLiked ? "text-red-500" : "text-gray-400"} />
      <span>{likeCount}</span>
    </div>
  );
}
