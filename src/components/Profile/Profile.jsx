import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaThumbsUp, FaComment, FaShare, FaRedo, FaEllipsisH, FaBars, FaUserPlus, FaUserMinus, FaCog, FaPlus, FaTimes } from "react-icons/fa";
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
  const [profilePictures, setProfilePictures] = useState({});
  const [isFollowing, setIsFollowing] = useState(() => {
    const storedFollowStatus = localStorage.getItem(`followStatus_${id}`);
    return storedFollowStatus ? JSON.parse(storedFollowStatus) : false;
  });
  const [activeTab, setActiveTab] = useState("Posts");
  const { token } = useContext(TokenContext);
  const currentUserId = localStorage.getItem("userId");
  const skillInputRef = useRef(null);

  const picKey = `profilePicture_${id}`;
  const coverKey = `coverImage_${id}`;

  const fetchUserProfilePicture = async (userId) => {
    try {
      const res = await axios.get(
        `https://ourheritage.runasp.net/api/Users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`Fetched profile picture for user ${userId}:`, res.data.profilePicture);
      return res.data.profilePicture || "https://via.placeholder.com/40";
    } catch (err) {
      console.error(`Error fetching profile picture for user ${userId}:`, err);
      return "https://via.placeholder.com/40";
    }
  };

  const fetchData = async () => {
    try {
      const userRes = await axios.get(
        `https://ourheritage.runasp.net/api/Users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const postsRes = await axios.get(
        `https://ourheritage.runasp.net/api/Articles`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            PageIndex: 1,
            PageSize: 100,
            UserId: id,
          },
        }
      );
  
      const followersRes = await axios.get(
        `https://ourheritage.runasp.net/api/Follow/${id}/followers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const followingsRes = await axios.get(
        `https://ourheritage.runasp.net/api/Follow/${id}/followings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setUserData(userRes.data);
      setUserSkills(userRes.data.skills || []);
      setFollowers(followersRes.data || []);
      setFollowing(followingsRes.data || []);
      const isUserFollowing = followersRes.data.some(
        (follower) => follower.id === parseInt(currentUserId)
      );
      setIsFollowing(isUserFollowing);
      localStorage.setItem(`followStatus_${id}`, JSON.stringify(isUserFollowing));
  
      if (Array.isArray(postsRes.data.items)) {
        setUserPosts(postsRes.data.items.filter((p) => p.userId == id));
      }
  
      setProfilePicture(userRes.data.profilePicture || "https://via.placeholder.com/150");
      setCoverImage(userRes.data.coverProfilePicture || "https://via.placeholder.com/1500x500");
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id || !token) {
      setError("لم يتم العثور على بيانات المستخدم. تأكد من تسجيل الدخول.");
      setLoading(false);
      return;
    }

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

  useEffect(() => {
    const fetchAllProfilePictures = async () => {
      const followerPromises = followers.map(follower =>
        !profilePictures[follower.id]
          ? fetchUserProfilePicture(follower.id).then(pic => [follower.id, pic])
          : Promise.resolve([follower.id, profilePictures[follower.id]])
      );
      const followingPromises = following.map(followingUser =>
        !profilePictures[followingUser.id]
          ? fetchUserProfilePicture(followingUser.id).then(pic => [followingUser.id, pic])
          : Promise.resolve([followingUser.id, profilePictures[followingUser.id]])
      );
      const pics = Object.fromEntries(await Promise.all([...followerPromises, ...followingPromises]));
      setProfilePictures(prev => {
        console.log("Updated profile pictures:", { ...prev, ...pics });
        return { ...prev, ...pics };
      });
    };

    if (followers.length > 0 || following.length > 0) {
      fetchAllProfilePictures();
    }
  }, [followers, following, token]);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("ImageProfile", file);

    try {
      const response = await axios.post(
        "https://ourheritage.runasp.net/api/Users/profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const userRes = await axios.get(
          `https://ourheritage.runasp.net/api/Users/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfilePicture(userRes.data.profilePicture);
        setUserData(userRes.data); 
      }
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setError("حدث خطأ أثناء رفع صورة الملف الشخصي.");
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("ImageCover", file);
  
    try {
      const response = await axios.post(
        "https://ourheritage.runasp.net/api/Users/cover-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        const userRes = await axios.get(
          `https://ourheritage.runasp.net/api/Users/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCoverImage(userRes.data.coverProfilePicture || "https://via.placeholder.com/1500x500");
        setUserData(userRes.data);
      }
    } catch (err) {
      console.error("Error uploading cover image:", err);
      setError("حدث خطأ أثناء رفع صورة الغلاف.");
    }
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
      setUserSkills(userSkills); // Revert optimistic update
    }
  };

  const handleDeleteSkill = async (skill) => {
    if (!token) {
      setError("لم يتم العثور على التوكن. تأكد من تسجيل الدخول.");
      return;
    }

    // Optimistic update
    const updatedSkills = userSkills.filter(s => s !== skill);
    setUserSkills(updatedSkills);

    try {
      await axios.delete(
        `https://ourheritage.runasp.net/api/Users/skills/${encodeURIComponent(skill)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': '*/*',
          },
        }
      );

      setError(null);
    } catch (err) {
      console.error("Error deleting skill:", err);
      setError("حدث خطأ أثناء حذف المهارة.");
      setUserSkills(userSkills); // Revert optimistic update
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
        const followersRes = await axios.get(
          `https://ourheritage.runasp.net/api/Follow/${id}/followers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowers(followersRes.data || []);
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

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/40";
  };

  const postImages = userPosts
    .filter(post => post.imageURL && post.imageURL !== "https://via.placeholder.com/40")
    .map(post => ({
      id: post.id,
      imageURL: post.imageURL,
    }));

  const handleAddSkillClick = () => {
    setActiveTab("Posts");
    setTimeout(() => {
      if (skillInputRef.current) {
        skillInputRef.current.focus();
      }
    }, 0);
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
                  onError={handleImageError}
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
              {id !== currentUserId && (
                <div className="absolute bottom-0 left-0 p-2">
                  <button
                    onClick={handleFollowToggle}
                    className="px-4 py-2 bg-[#B22222] text-white rounded flex items-center gap-2 hover:bg-[#8B0000]"
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

          <div className={styles.nameAndTabs}>
            <h2 className="text-black">{userData.fullName || `${userData.firstName} ${userData.lastName}`}</h2>
            <div className={styles.tabNav}>
              <button
                className={`${styles.tabButton} ${activeTab === "Posts" ? styles.activeTab : ''}`}
                onClick={() => setActiveTab("Posts")}
              >
                المنشورات
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "Pictures" ? styles.activeTab : ''}`}
                onClick={() => setActiveTab("Pictures")}
              >
                الصور
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "Followers" ? styles.activeTab : ''}`}
                onClick={() => setActiveTab("Followers")}
              >
                متابع
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "Following" ? styles.activeTab : ''}`}
                onClick={() => setActiveTab("Following")}
              >
                يتابع
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === "About" ? styles.activeTab : ''}`}
                onClick={() => setActiveTab("About")}
              >
                حول
              </button>
            </div>
          </div>

          {activeTab === "Posts" && (
            <div className={styles.postsSection}>
              <div className={styles.stats}>
                <div>
                  <strong>متابع:</strong>
                  <p>{followers.length}</p>
                </div>
                <div>
                  <strong>يتابع:</strong>
                  <p>{following.length}</p>
                </div>
                <div>
                  <strong>المنشورات:</strong>
                  <p>{userPosts.length}</p>
                </div>
              </div>

              {id === currentUserId && (
                <form onSubmit={handleAddSkills} className="my-4">
                  <input 
                    type="text" 
                    value={newSkill} 
                    onChange={(e) => setNewSkill(e.target.value)} 
                    placeholder="أدخل مهارة جديدة" 
                    className="mb-2 p-2 border border-gray-300 rounded w-full"
                    ref={skillInputRef}
                  />
                  <button type="submit" className="px-4 py-2 bg-[#B22222] text-white rounded hover:bg-[#8B0000]">
                    إضافة مهارة
                  </button>
                </form>
              )}

              {id === currentUserId && <NewPost />}

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
                      onError={handleImageError}
                    />
                    <div>
                      <p className="font-bold text-red-800">
                        {userData.fullName || `${userData.firstName} ${userData.lastName}`}
                      </p>
                    </div>
                  </div>

                  {post.imageURL && post.imageURL !== "https://via.placeholder.com/40" && (
                    <div className="w-full h-96 rounded-md mb-4">
                      <img
                        src={post.imageURL}
                        alt="Post"
                        className="w-full h-full object-cover rounded-md"
                        onError={handleImageError}
                      />
                    </div>
                  )}

                  <h4 className="text-lg font-bold mb-2">{post.title || "بدون عنوان"}</h4>
                  <p className="border-b-2 border-black pb-2 mb-2">{post.content || "بدون محتوى"}</p>

                  <div className="flex justify-between items-center mt-4 text-red-900">
                    <div className="flex gap-8 items-center">
                      <div className={`flex items-center gap-1 cursor-pointer ${styles.postActionButton}`}>
                        <FaThumbsUp /><span>إعجاب</span>
                      </div>
                      <div className={`flex items-center gap-1 cursor-pointer ${styles.postActionButton}`}>
                        <FaComment /><span>تعليق</span>
                      </div>
                      <div className={`flex items-center gap-1 cursor-pointer ${styles.postActionButton}`}>
                        <FaShare /><span>مشاركة</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 cursor-pointer ${styles.postActionButton}`}>
                      <span>إعادة نشر</span><FaRedo />
                    </div>
                  </div>
                </div>
              )) : (
                <p>لا توجد منشورات.</p>
              )}
            </div>
          )}

          {activeTab === "Pictures" && (
            <div className={styles.postsSection}>
              <h3 className="text-xl font-bold mb-4">الصور</h3>
              {postImages.length > 0 ? (
                <div className={styles.imagesGrid}>
                  {postImages.map(image => (
                    <div key={image.id} className={styles.imageCard}>
                      <img
                        src={image.imageURL}
                        alt="Post Image"
                        className={styles.postImage}
                        onError={handleImageError}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p>لم يتم إضافة صور بعد.</p>
              )}
            </div>
          )}

          {activeTab === "Followers" && (
            <div className={styles.postsSection}>
              <h3 className="text-xl font-bold mb-4">المتابعون</h3>
              {followers.length > 0 ? (
                <div className={styles.friendsGrid}>
                  {followers.map(follower => (
                    <Link key={follower.id} to={`/profile/${follower.id}`} className={styles.friendCard}>
                      <img
                        src={profilePictures[follower.id] || "https://via.placeholder.com/40"}
                        alt={`${follower.userName || 'User'}'s profile`}
                        className={styles.friendImage}
                        onError={handleImageError}
                      />
                      <span className={styles.friendName}>{follower.userName || `User ${follower.id}`}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>لا يوجد متابعون.</p>
              )}
            </div>
          )}

          {activeTab === "Following" && (
            <div className={styles.postsSection}>
              <h3 className="text-xl font-bold mb-4">المتابعة</h3>
              {following.length > 0 ? (
                <div className={styles.friendsGrid}>
                  {following.map(followingUser => (
                    <Link key={followingUser.id} to={`/profile/${followingUser.id}`} className={styles.friendCard}>
                      <img
                        src={profilePictures[followingUser.id] || "https://via.placeholder.com/40"}
                        alt={`${followingUser.userName || 'User'}'s profile`}
                        className={styles.friendImage}
                        onError={handleImageError}
                      />
                      <span className={styles.friendName}>{followingUser.userName || `User ${followingUser.id}`}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>لا يوجد متابعة.</p>
              )}
            </div>
          )}

          {activeTab === "About" && (
            <div className={styles.postsSection}>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-2xl font-bold mb-6 text-[#B22222] border-b-2 border-[#B22222] pb-2">
                  حول {userData.fullName || `${userData.firstName} ${userData.lastName}`}
                </h3>
                
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-10">
                    <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <FaCog className="text-[#B22222]" />
                      المهارات
                    </h4>
                    {id === currentUserId && (
                      <button
                        onClick={handleAddSkillClick}
                        className="text-[#B22222] px-3 py-3 hover:text-[#8B0000] flex items-center gap-4 text-lg"
                      >
                        <FaPlus size={20} />
                        إضافة مهارة
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {userSkills.length > 0 ? (
                      userSkills.map((skill, index) => (
                        <div 
                          key={index} 
                          className="flex items-center px-8 justify-between text-black mb-4 rounded-full text-center shadow-md hover:shadow-lg transition-shadow duration-200"
                          style={{ backgroundColor: '#F5F5DC' }}
                        >
                          <span className='w-[900px] h-[30px] p-5 flex items-center justify-center' >{skill}</span>
                          {id === currentUserId && (
                            <button
                              onClick={() => handleDeleteSkill(skill)}
                              className="text-red-600 hover:text-red-800 mr-16 "
                              title="حذف المهارة"
                            >
                              <FaTimes size={14} />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-gray-500 text-center py-8 italic">
                        لا توجد مهارات مضافة بعد
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 mt-16">
                    <FaCalendarAlt className="text-[#B22222]" />
                    معلومات الانضمام
                  </h4>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#B22222] rounded-full"></div>
                      <span className="text-gray-700 font-medium">
                        انضم في: {new Date(userData.dateJoined).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      عضو منذ {Math.floor((new Date() - new Date(userData.dateJoined)) / (1000 * 60 * 60 * 24))} يوم
                    </div>
                  </div>
                </div>

                
              </div>
            </div>
          )}

        </div>
        <div className="col-span-12 md:col-span-3">
          <ProfileLeftside userData={userData} />
        </div>
      </div>
    </div>
  );
}