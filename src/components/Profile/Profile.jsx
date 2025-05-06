import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaThumbsUp, FaComment, FaShare, FaRedo, FaEllipsisH, FaBars, FaUserPlus, FaUserMinus } from "react-icons/fa";
import styles from "./Profile.module.css";
import ProfileLeftside from './ProfileLeftside';
import NewPost from '../Home/newpost';
import PostSettings from '../Home/postSetting';
import { TokenContext } from "../../Context/TokenContext";

export default function Profile() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [userSkills, setUserSkills] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(() => {
    const storedFollowStatus = localStorage.getItem(`followStatus_${id}`);
    return storedFollowStatus ? JSON.parse(storedFollowStatus) : false;
  });
  const { token } = useContext(TokenContext);
  const currentUserId = localStorage.getItem("userId");

  const picKey = `profilePicture_${id}`;
  const coverKey = `coverImage_${id}`;

  useEffect(() => {
    if (!id || !token) {
      setError("لم يتم العثور على بيانات المستخدم. تأكد من تسجيل الدخول.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await axios.get(
          `https://ourheritage.runasp.net/api/Users/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fetch posts
        const postsRes = await axios.get(
          `https://ourheritage.runasp.net/api/Articles`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              PageIndex: 1,
              PageSize: 100,
              UserId: id
            }
          }
        );

        // Fetch followers
        const followersRes = await axios.get(
          `https://ourheritage.runasp.net/api/Follow/${id}/followers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fetch followings
        const followingsRes = await axios.get(
          `https://ourheritage.runasp.net/api/Follow/${id}/followings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserData(userRes.data);
        setUserSkills(userRes.data.skills || []);
        setFollowers(followersRes.data || []);
        setFollowing(followingsRes.data || []);
        // Set isFollowing based on whether currentUserId is in followers list
        const isUserFollowing = followersRes.data.some(follower => follower.id === parseInt(currentUserId));
        setIsFollowing(isUserFollowing);
        localStorage.setItem(`followStatus_${id}`, JSON.stringify(isUserFollowing));

        if (Array.isArray(postsRes.data.items)) {
          setUserPosts(postsRes.data.items.filter(p => p.userId == id));
        }

        const storedPic = localStorage.getItem(picKey);
        if (storedPic) setProfilePicture(storedPic);
        const storedCover = localStorage.getItem(coverKey);
        if (storedCover) setCoverImage(storedCover);

      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, currentUserId]);

  useEffect(() => {
    if (!token) {
      setError("لم يتم العثور على التوكن. تأكد من تسجيل الدخول.");
      return;
    }

    const fetchSkills = async () => {
      try {
        const response = await axios.get('https://ourheritage.runasp.net/api/Users/me/skills', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserSkills(response.data);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء جلب المهارات.");
      }
    };

    fetchSkills();
  }, [token]);

  const handleProfilePictureChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result !== profilePicture) {
        localStorage.setItem(picKey, reader.result);
        setProfilePicture(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result !== coverImage) {
        localStorage.setItem(coverKey, reader.result);
        setCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverClick = (e) => {
    e.stopPropagation();
    if (id === currentUserId) {
      const input = document.getElementById("coverImageInput");
      if (input) {
        input.click();
      } else {
        console.error("Input element not found");
      }
    }
  };

  const handleAddSkills = async (e) => {
    e.preventDefault();
    if (!newSkill) return setError("يجب إدخال مهارة.");
    
    const updatedSkills = [...userSkills, newSkill];
    setUserSkills(updatedSkills);
    
    try {
      await axios.post(
        `https://ourheritage.runasp.net/api/Users/skills`,
        newSkill,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      setNewSkill("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء إضافة المهارة.");
    }
  };

  const handleFollowToggle = async () => {
    if (!id || !token || !currentUserId) {
      setError("معرف المستخدم أو التوكن غير صالح.");
      return;
    }

    console.log("Attempting to follow/unfollow with:", {
      followerId: currentUserId,
      followingId: id,
      token: token.substring(0, 10) + "...",
      action: isFollowing ? "unfollow" : "follow"
    });

    try {
      const endpoint = isFollowing 
        ? `https://ourheritage.runasp.net/api/Follow/unfollow/${parseInt(currentUserId)}/${parseInt(id)}`
        : `https://ourheritage.runasp.net/api/Follow/follow`;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const body = { followerId: parseInt(currentUserId), followingId: parseInt(id) };

      const response = isFollowing 
        ? await axios.delete(endpoint, { ...config, data: body })
        : await axios.post(endpoint, body, config);
      
      if (response.status === 200 || response.status === 201) {
        // Fetch updated followers list
        const followersRes = await axios.get(
          `https://ourheritage.runasp.net/api/Follow/${id}/followers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowers(followersRes.data || []);
        // Update isFollowing based on whether currentUserId is in followers list
        const isUserFollowing = followersRes.data.some(follower => follower.id === parseInt(currentUserId));
        setIsFollowing(isUserFollowing);
        localStorage.setItem(`followStatus_${id}`, JSON.stringify(isUserFollowing));
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      console.error("Follow/Unfollow error:", err);
      console.error("Error response data:", err.response?.data);
      if (err.response?.status === 400 && err.response?.data?.message === "You are already following this user.") {
        setIsFollowing(true);
        localStorage.setItem(`followStatus_${id}`, JSON.stringify(true));
      } else if (err.response?.status === 400 && err.response?.data?.message === "Follower or following user not found.") {
        setError("المستخدم المتابع أو المستخدم الذي يتم متابعته غير موجود.");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || "طلب غير صالح. تحقق من معرف المستخدم أو حاول مرة أخرى.");
      } else if (err.response?.status === 401) {
        setError("غير مصرح. تأكد من تسجيل الدخول.");
      } else {
        setError("حدث خطأ أثناء تحديث حالة المتابعة. حاول مرة أخرى لاحقًا.");
      }
    }
  };

  if (loading) return <p className="text-center py-8">جاري تحميل البيانات...</p>;
  if (error) return <p className="text-red-600 text-center py-8">{error}</p>;
  if (!userData) return <p className="text-center py-8">لا يوجد بيانات</p>;

  return (
    <div className={styles.container}>
      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-12 md:col-span-9">
          <div
            className={`${styles.coverContainer} ${id === currentUserId ? styles.editableCover : ''}`}
            onClick={handleCoverClick}
            style={{
              backgroundImage: `url(${coverImage || userData.coverImage || ''})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              paddingBottom: '120px'
            }}
          >
            <input
              type="file"
              id="coverImageInput"
              style={{
                display: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
              accept="image/*"
              onChange={handleCoverImageChange}
            />
            {id === currentUserId && (
              <div className={styles.coverEditOverlay}>
                <span>تغيير صورة الغلاف</span>
              </div>
            )}

            <div className={styles.profileInfo} style={{ position: 'absolute', bottom: '10px', left: '10px', padding: '10px', borderRadius: '10px', right: '10px' }}>
              <div className={styles.profilePictureLabel}>
                <img
                  src={profilePicture || userData.profilePicture || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className={`${styles.profilePicture} ${id === currentUserId ? styles.editableProfile : ''}`}
                  onClick={() => {
                    if (id === currentUserId) {
                      document.getElementById("profilePictureInput").click();
                    }
                  }}
                />
                <input
                  type="file"
                  id="profilePictureInput"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <h2 className="text-white">{userData.fullName || `${userData.firstName} ${userData.lastName}`}</h2>
              <p className="text-white">رقم الهاتف: {userData.phone || "غير متوفر"}</p>
              
              {/* زر المتابعة/إلغاء المتابعة */}
              {id !== currentUserId && (
                <div className="absolute bottom-0 left-0 p-2">
                  <button
                    onClick={handleFollowToggle}
                    className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
                  >
                    {isFollowing ? (
                      <>
                        <FaUserMinus /> إلغاء المتابعة
                      </>
                    ) : (
                      <>
                        <FaUserPlus /> متابعة
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* نموذج إضافة المهارة يظهر فقط للمستخدم اللي عامل تسجيل دخول */}
          {id === currentUserId && (
            <form onSubmit={handleAddSkills}>
              <input 
                type="text" 
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)} 
                placeholder="أدخل مهارة جديدة" 
                className="mb-2 p-2 border border-gray-300 rounded"
              />
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">إضافة مهارة</button>
            </form>
          )}

          <div className={styles.stats}>
            <div>
              <strong>المهارات:</strong>
              <p>{userSkills.length ? userSkills.join(", ") : "لا توجد"}</p>
            </div>
            <div>
              <strong>متابع:</strong>
              <p>{followers.length}</p>
            </div>
            <div>
              <strong>اتابع:</strong>
              <p>{following.length}</p>
            </div>
            <div>
              <strong>تاريخ الانضمام:</strong>
              <p>{new Date(userData.dateJoined).toLocaleDateString()}</p>
            </div>
          </div>

          {id === currentUserId && <NewPost />}

          <div className={styles.postsSection}>
            <h3 className="text-xl font-bold mb-4">منشورات المستخدم</h3>
            {userPosts.length > 0 ? userPosts.map(post => (
              <div key={post.id} className="mb-8 p-4 bg-white shadow-md rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="setting"></div>
                  {id === currentUserId && (
                    <PostSettings post={post} setUserPosts={setUserPosts} />
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <img
                    src={profilePicture || userData.profilePicture || "https://via.placeholder.com/50"}
                    alt="User"
                    className="w-12 h-12 border-2 border-red-900 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-red-800">
                      {userData.fullName || `${userData.firstName} ${userData.lastName}`}
                    </p>
                  </div>
                </div>

                {post.imageURL && (
                  <div className="w-full h-96 rounded-md mb-4">
                    <img
                      src={post.imageURL}
                      alt="Post"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                )}

                <h4 className="text-lg font-bold mb-2">{post.title || "بدون عنوان"}</h4>
                <p className="border-b-2 border-black pb-2 mb-2">{post.content || "بدون محتوى"}</p>

                <div className="flex justify-between items-center mt-4 text-red-900">
                  <div className="flex gap-8 items-center">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <FaThumbsUp /><span>إعجاب</span>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer">
                      <FaComment /><span>تعليق</span>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer">
                      <FaShare /><span>مشاركة</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <span>إعادة نشر</span><FaRedo />
                  </div>
                </div>
              </div>
            )) : (
              <p>لا توجد منشورات.</p>
            )}
          </div>
        </div>
        <div className="col-span-12 md:col-span-3">
          <ProfileLeftside userData={userData} />
        </div>
      </div>
    </div>
  );
}