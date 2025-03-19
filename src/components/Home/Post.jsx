// داخل Home.js
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from './Home.module.css';
import { FaRedo, FaCalendarAlt } from "react-icons/fa";
import PostSetting from './postSetting';
import Comment from './comment';
import Like from './like';
import Share from './share';
import Watching from './watching';
import { TokenContext } from '../../Context/TokenContext';
import { usePostContext } from '../../Context/PostContext';

export default function Home() {
  const { token } = useContext(TokenContext);
  const { posts, setPosts } = usePostContext();
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("لا يوجد توكن! الرجاء تسجيل الدخول.");
      return;
    }

    const fetchPosts = async () => {
      try {
        const apiUrl = `https://ourheritage.runasp.net/api/Articles?PageIndex=${pageIndex}&PageSize=${pageSize}`;
        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        console.log("🚀 بيانات المنشورات:", response.data.items);
        if (response.status === 200) {
          setPosts(response.data.items || response.data);
        } else {
          setError('لا توجد منشورات حالياً.');
        }
      } catch (err) {
        console.error('خطأ في جلب المنشورات:', err);
        if (err.response?.status === 401) {
          setError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجددًا.');
          localStorage.removeItem('userToken');
        } else {
          setError('حدث خطأ أثناء جلب المنشورات. حاول مرة أخرى.');
        }
      }
    };

    fetchPosts();
  }, [pageIndex, pageSize, token]);

  const handleLike = (id) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, likeCount: post.likeCount + 1 } : post
      )
    );
  };

  const handleImageLike = (id) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, likeCount: post.likeCount + 1 } : post
      )
    );
  };

  if (error) {
    return <p className="text-center text-red-600 mt-5">{error}</p>;
  }

  return (
    <div className="p-5">
      {posts.length > 0 ? (
        posts.map((post) => (
          !post.isHidden && ( // تحقق من حالة isHidden
            <div key={post.id} className={`mb-8 p-4 bg-white shadow-md rounded-lg ${styles.leftside}`}>
              <div className="flex items-center gap-2">
                <img
                  src={post.userProfilePicture || "https://via.placeholder.com/50"}
                  alt="صورة المستخدم"
                  className="w-12 h-12 border-2 border-red-900 rounded-full"
                />
                <div>
                  <p className="font-bold">{post.nameOfUser || "مستخدم مجهول"}</p>
                  <div className="flex items-center text-gray-600 text-sm gap-1">
                    <FaCalendarAlt />
                    <span>{post.dateCreated || "غير متوفر"}</span>
                  </div>
                  <PostSetting post={post} setPosts={setPosts} />  
                  {post.isFollowing ? (
                    <span className="text-green-600 text-sm">✓ متابع</span>
                  ) : (
                    <span className={styles.follow}>متابعة</span>
                  )}
                </div>
              </div>
              {post.imageURL && (
                <div
                  className="w-full h-96 rounded-md mt-4 cursor-pointer"
                  onDoubleClick={() => handleImageLike(post.id)}
                >
                  <img className="w-full h-full object-cover rounded-md" src={post.imageURL} alt="Post" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold">{post.title || "عنوان غير متوفر"}</h2>
                <p className="border-b-2 border-black block mt-2 p-3">
                  {post.content || "لا يوجد محتوى لهذا المنشور"}
                </p>
                <div className="flex justify-between mt-5 w-full">
                  <div className="flex items-center gap-8 text-red-900 relative">
                    <Like post={post} onLike={() => handleLike(post.id)} />
                    <Share />
                    <Comment post={post} />
                    <Watching />
                  </div>
                  <div className="flex items-center gap-2 text-red-900 w-36">
                    <span className="mr-8">إعادة نشر</span>
                    <FaRedo />
                  </div>
                </div>
              </div>
            </div>
          )
        ))
      ) : (
        <p className="text-center">لا توجد منشورات حالياً</p>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-screen h-screen">
          <div className="bg-white p-5 rounded-lg w-1/2">
            <h2 className="text-lg font-bold">تفاصيل المنشور</h2>
            <button onClick={() => setIsOpen(false)} className="mt-4 text-red-600">
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
