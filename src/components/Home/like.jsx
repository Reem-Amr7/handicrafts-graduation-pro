import { FaHeart } from "react-icons/fa";

export default function Like({ post, onLike }) {
  return (
    <div className="flex items-center gap-1 cursor-pointer" onClick={onLike}>
      <FaHeart />
      <span>{post.likeCount}</span>
    </div>
  );
}
