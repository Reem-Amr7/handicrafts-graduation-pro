import { useState } from "react";
import { FaComment } from "react-icons/fa";

export default function Comment({post}) {
    const [showComments, setShowComments] = useState(false);
    const toggleComments = () => {
        setShowComments(!showComments);
    };

    return (
        <>
            <div className="relative flex items-center gap-1 cursor-pointer group" onClick={toggleComments}>
                <FaComment />
                <span>{post.commentCount}</span>

                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block text-black text-xs  py-1 px-2"
                style={{ border: '2px solid #B18B5E', backgroundColor: '#FFFCFC',width:"max-content" }}>
                    عرض التعليقات
                </div>
            </div>
 
           
        </>
    );
}
