import { FaHeart, FaThumbsUp } from 'react-icons/fa';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../../Context/TokenContext';
import styles from "../Profile/Profile.module.css";
export default function Like({ post }) {
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const { token } = useContext(TokenContext);
  const userId = Number(localStorage.getItem('userId'));

  // 1. حمل حالة اللايك من localStorage
  useEffect(() => {
    if (localStorage.getItem(`liked-${post.id}`) === 'true') {
      setIsLiked(true);
    }
  }, [post.id]);

  const toggleLike = async () => {
    if (!userId) return;

    try {
      if (isLiked) {
        await axios.delete(
          `https://ourheritage.runasp.net/api/Like/remove-like`,
          { params: { userId, culturalArticleId: post.id },
            headers: { Authorization: `Bearer ${token}` } }
        );
        setLikeCount(c => c - 1);
      } else {
        await axios.post(
          `https://ourheritage.runasp.net/api/Like/add-like`,
          { userId, culturalArticleId: post.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLikeCount(c => c + 1);
      }
      // 2. حدّث الحالة في الواجهة و localStorage
      setIsLiked(l => !l);
      localStorage.setItem(`liked-${post.id}`, (!isLiked).toString());
    } catch (err) {
      console.error('Like error:', err.response?.data || err.message);
    }
  };

  return (
    // <div className="flex items-center gap-1 cursor-pointer" onClick={toggleLike}>
    //   <FaHeart className={isLiked ? 'text-red-500' : 'text-gray-400'} />
    //   <span className="text-sm">{likeCount}</span>
    // </div>



 <div className={`flex items-center gap-1 cursor-pointer ${styles.postActionButton}`} onClick={toggleLike}>
                        <FaThumbsUp  className={isLiked ? 'text-red-500' : 'text-gray-400' }  /><span className='text-xl mr-2'>إعجاب</span>
                         <span className="text-xl mr-2 mt-1">{likeCount}</span>
                      </div>
  );
}
