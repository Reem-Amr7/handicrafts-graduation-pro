import React, { useState, useEffect } from 'react';
import styles from "./Profile.module.css";
import ProfileLeftside from './ProfileLeftside';
import axios from 'axios';
import { FaCalendarAlt, FaThumbsUp, FaComment, FaShare, FaRedo } from "react-icons/fa";
import NewPost from '../Home/newpost';
import PostSettings from '../Home/postSetting';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [userSkills, setUserSkills] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // Retrieve current userId and token
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("userToken");

  // Keys for per-user storage
  const picKey = `profilePicture_${userId}`;
  const coverKey = `coverImage_${userId}`;

  useEffect(() => {
    if (!userId || !token) {
      setError("لم يتم العثور على بيانات المستخدم. تأكد من تسجيل الدخول.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `https://ourheritage.runasp.net/api/Users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(res.data);
        setUserSkills(res.data.skills || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.status === 401
          ? "خطأ 401: غير مصرح بالوصول. تأكد من تسجيل الدخول."
          : "حدث خطأ أثناء جلب البيانات. تحقق من الاتصال وصلاحيات الوصول.");
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(
          `https://ourheritage.runasp.net/api/Articles`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { PageIndex: 1, PageSize: 100 }
          }
        );
        if (Array.isArray(res.data.items)) {
          setUserPosts(res.data.items.filter(p => p.userId == userId));
        }
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء جلب البوستات. تحقق من الاتصال.");
      }
    };

    const load = async () => {
      await Promise.all([fetchUserData(), fetchUserPosts()]);
      setLoading(false);
    };
    load();
  }, [userId, token]);

  // Load stored images for this user
  useEffect(() => {
    if (userId) {
      const storedPic = localStorage.getItem(picKey);
      if (storedPic) setProfilePicture(storedPic);
      const storedCover = localStorage.getItem(coverKey);
      if (storedCover) setCoverImage(storedCover);
    }
  }, [userId]);

  const handleProfilePictureChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem(picKey, reader.result);
      setProfilePicture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem(coverKey, reader.result);
      setCoverImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkills = async e => {
    e.preventDefault();
    if (!newSkill) return setError("يجب إدخال مهارة.");
    const updated = [...userSkills, newSkill];
    setUserSkills(updated);
    try {
      await axios.put(
        `https://ourheritage.runasp.net/api/Users/${userId}`,
        { skills: updated },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewSkill("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء إضافة المهارة.");
    }
  };

  const handleCoverClick = () => document.getElementById("coverImageInput").click();

  if (loading) return <p>جاري تحميل البيانات...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className={styles.container}>
      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-9">
          <div className={styles.coverContainer} onClick={handleCoverClick}>
            <input
              type="file"
              id="coverImageInput"
              style={{ display:'none' }}
              accept="image/*"
              onChange={handleCoverImageChange}
            />
          </div>

          <div
            className={styles.profileContainer}
            style={{
              backgroundImage: `url(${coverImage||''})`,
              backgroundSize:'cover',
              backgroundPosition:'center'
            }}
            onClick={handleCoverClick}
          >
            <div className={styles.profileContent}>
              <div className={styles.profilePictureLabel}>
                <img
                  src={profilePicture||"https://via.placeholder.com/150"}
                  alt="Profile"
                  className={`${styles.profilePicture} cursor-pointer`}
                  onClick={() => document.getElementById("profilePictureInput").click()}
                />
                <input
                  type="file"
                  id="profilePictureInput"
                  style={{ display:'none' }}
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <h2>{userData.fullName}</h2>
              <p>رقم الهاتف: {userData.phone||"غير متوفر"}</p>
            </div>
          </div>

          <div className={styles.stats}>
            <div>
              <strong>المهارات:</strong>
              <p>{userSkills.length ? userSkills.join(", ") : "لا توجد"}</p>
            </div>
            <div>
              <strong>تاريخ الانضمام:</strong>
              <p>{new Date(userData.dateJoined).toLocaleDateString()}</p>
            </div>
          </div>

          <NewPost />

          <div className={styles.postsSection}>
            <h3 className="text-xl font-bold mb-4">منشورات المستخدم</h3>
            {userPosts.length ? userPosts.map(post => (
              <div key={post.id} className="mb-8 p-4 bg-white shadow-md rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={profilePicture||"https://via.placeholder.com/50"}
                      alt=""
                      className="w-12 h-12 border-2 border-red-900 rounded-full"
                    />
                    <div>
                      <p className="font-bold text-red-800">{userData.fullName}</p>
                      <div className="flex items-center text-gray-600 text-sm gap-1">
                        <FaCalendarAlt />
                        <span>{new Date(post.dateCreated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <PostSettings post={post} setUserPosts={setUserPosts} />
                </div>
                {post.imageURL && (
                  <div className="w-full h-96 rounded-md mb-4">
                    <img src={post.imageURL} alt="Post" className="w-full h-full object-cover rounded-md"/>
                  </div>
                )}
                <h4 className="text-lg font-bold mb-2">{post.title || "بدون عنوان"}</h4>
                <p className="border-b-2 border-black pb-2 mb-2">{post.content || "بدون محتوى"}</p>
                <div className="flex justify-between items-center mt-4 text-red-900">
                  <div className="flex gap-8 items-center">
                    <div className="flex items-center gap-1 cursor-pointer"><FaThumbsUp /><span>إعجاب</span></div>
                    <div className="flex items-center gap-1 cursor-pointer"><FaComment /><span>تعليق</span></div>
                    <div className="flex items-center gap-1 cursor-pointer"><FaShare /><span>مشاركة</span></div>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer"><span>إعادة نشر</span><FaRedo /></div>
                </div>
              </div>
            )) : (
              <p>لا توجد منشورات.</p>
            )}
          </div>
        </div>
        <div className="col-span-3"><ProfileLeftside /></div>
      </div>
    </div>
  );
}
