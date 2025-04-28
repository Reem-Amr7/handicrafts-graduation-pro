import Post from "./Post";
import Suggest from "./Suggest";
import NewPost from "./newpost";
import Posty from "./trypost";
import { FaCheckCircle, FaImage, FaVideo, FaLink, FaSort, FaHeart, FaComment, FaShareAlt, FaBookmark, FaPaperPlane } from 'react-icons/fa';

export default function Maincontent({ className }) {
  return (
    <main className={`col-span-6 p-9 ${className}`}>   {/* إضافة className هنا */}
      <NewPost />
      <Posty />
    </main>
  );
}

