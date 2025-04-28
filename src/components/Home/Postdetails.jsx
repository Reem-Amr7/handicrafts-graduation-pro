// PostDetails.jsx
import React, { useState } from 'react';
import Comment from './comment';

export default function PostDetails({ posts }) {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="relative">

      {/* عرض البوستات */}
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedPost(post)}
            >
              <img
                src={post.imageURL?.[0] || 'https://via.placeholder.com/400'}
                alt="صورة المنشور"
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{post.nameOfUser}</h3>
                <p className="text-sm text-gray-500">{post.timeAgo} • {post.nameOfCategory}</p>
                <p className="mt-2 text-gray-700 line-clamp-3">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-5">لا توجد منشورات حالياً.</p>
      )}

      {/* تفاصيل البوست داخل الصفحة */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-6xl h-full md:h-[80%] flex flex-col md:flex-row mx-2 md:mx-6 overflow-hidden">

            {/* زر الإغلاق */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold z-50"
            >
              ×
            </button>

            {/* صورة البوست */}
            <div className="w-full md:w-1/2 bg-black flex justify-center items-center">
              <img
                src={selectedPost.imageURL?.[0] || 'https://via.placeholder.com/400'}
                alt="صورة المنشور"
                className="object-contain max-h-full p-4"
              />
            </div>

            {/* النص والتعليقات */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-[#5C4033] mb-2">{selectedPost.nameOfUser}</h2>
                <p className="text-gray-500 text-sm">{selectedPost.timeAgo} • {selectedPost.nameOfCategory}</p>
                <p className="mt-4 text-base text-gray-700 whitespace-pre-line">{selectedPost.content}</p>
              </div>

              {/* التعليقات */}
              <div className="border-t pt-4 mt-4">
                <Comment post={selectedPost} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
