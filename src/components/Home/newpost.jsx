import axios from "axios";
import { TokenContext } from "../../Context/TokenContext";
import React, { useState, useContext, useEffect } from "react";
import styles from './Home.module.css';



export default function NewPost() {
  const { token } = useContext(TokenContext);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    images: [],
    imageUrl: "",
    categoryId: "",
    userId: "",
    dateCreated: "",
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setPostData((prev) => ({ ...prev, userId: storedUserId }));
    }
  }, []);

  async function addNewPost(formData) {
    try {
      const res = await axios.post(
        "https://ourheritage.runasp.net/api/Articles",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: 20000,
        }
      );
      console.log("Post created successfully:", res.data);
      setIsFormVisible(false); 
    } catch (error) {
      console.error("Error creating post:", error.response?.data || error);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setPostData((prev) => ({
        ...prev,
        [name]: [...files],
      }));
    } else {
      setPostData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("Title", postData.title);
    formData.append("Content", postData.content);

    if (postData.images.length > 0) {
      postData.images.forEach((image) => {
        formData.append("Images", image);
      });
    }

    if (postData.imageUrl) {
      formData.append("ImageURL", postData.imageUrl);
    }

    if (postData.categoryId) formData.append("CategoryId", postData.categoryId);
    if (postData.userId) formData.append("UserId", postData.userId);
    if (postData.dateCreated) formData.append("DateCreated", postData.dateCreated);

    await addNewPost(formData);
  };

  return (
    <div className={`mb-8 p-4 bg-white shadow-md rounded-lg  ${styles.leftside}`}>
      <h2 className="text-right text-lg font-bold text-brown-700">إنشاء منشور جديد</h2>
      
      <div className="mt-2">
        <input
          type="text"
          placeholder="إنشاء منشور جديد"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none text-right cursor-pointer"
          onClick={() => setIsFormVisible(true)}
        />
      </div>

      {isFormVisible && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <form onSubmit={handleSubmit} className="mt-4">
            <input
                type="text"
                name="title"
                multiple
                onChange={handleChange}
                placeholder="العنوان"
                className="w-full p-2 border border-gray-300 rounded-md mt-2 text-right"
                value={postData.title}



              />
              <textarea
                name="content"
                placeholder="ماذا يدور في بالك؟"
                value={postData.content}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none text-right"
              />
              <input
                type="file"
                name="images"
                multiple
                onChange={handleChange}
                className="mt-2"
              />
              <input
                type="text"
                name="categoryId"
                placeholder="معرف الفئة"
                value={postData.categoryId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md mt-2 text-right"
              />
              
              <div className="flex justify-between mt-3">
                <button type="submit" className="bg-red-900 text-white px-4 py-2 ml-2 rounded-md shadow-md hover:bg-blue-700">
                  نشر
                </button>
                <button 
                  type="button" 
                  className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600"
                  onClick={() => setIsFormVisible(false)} 
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
