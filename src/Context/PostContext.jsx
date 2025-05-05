import { createContext, useContext, useState } from "react";

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]); 

  // إضافة منشور جديد
  const addPost = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  // تحديث منشور
  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  // حذف منشور
  const deletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        addPost,
        updatePost,
        deletePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
}
