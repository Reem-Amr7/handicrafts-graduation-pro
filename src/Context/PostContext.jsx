import { createContext, useContext, useState } from "react";

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]); 

  return (
    <PostContext.Provider value={{ posts, setPosts }}>
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
