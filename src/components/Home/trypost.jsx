import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaHeart, FaCalendarAlt, FaComment, FaShareAlt, FaSort, FaTimes } from "react-icons/fa";
import { TokenContext } from "../../Context/TokenContext";
import { useNavigate } from "react-router-dom";
import styles from './Home.module.css';
import Comment from "./comment";
import PostSettings from "./postSetting";
import Like from "./like";
import profileimage from '../../assets/OIP (1).jpg';

export default function Posty() {
    const { token } = useContext(TokenContext);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [openComments, setOpenComments] = useState({});
    const [sortOption, setSortOption] = useState("الأحدث");
    const [selectedPost, setSelectedPost] = useState(null);
    const navigate = useNavigate();  // استخدم useNavigate لتوجيه المستخدم

    useEffect(() => {
        if (!token) return;

        const fetchPosts = async () => {
            try {
                const response = await axios.get(
                    "https://ourheritage.runasp.net/api/Articles?PageIndex=1&PageSize=30",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );

                if (response.status === 200) {
                    setPosts(response.data.items || response.data);
                } else {
                    setError("لا توجد منشورات حالياً.");
                }
            } catch (err) {
                console.error("خطأ في جلب المنشورات:", err);
                setError("حدث خطأ أثناء جلب المنشورات. حاول مرة أخرى.");
            }
        };

        fetchPosts();
    }, [token]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const toggleComments = (id) => {
        setOpenComments((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const sortedPosts = [...posts].sort((a, b) => {
        if (sortOption === "الأحدث") {
            return new Date(b.dateCreated) - new Date(a.dateCreated);
        }
        if (sortOption === "الأكثر تفاعلاً") {
            return (b.commentCount + b.likeCount) - (a.commentCount + a.likeCount);
        }
        return 0;
    });

    const goToProfile = (userId) => {
        navigate(`/profile/${userId}`);  // التوجيه إلى صفحة البروفايل باستخدام المعرف
    };

    if (error) {
        return <p className="text-center text-red-600 mt-5">{error}</p>;
    }

    return (
        <div>
            <div className="feed-header bg-white rounded shadow-md p-3 mb-4 flex justify-between items-center">
                <h2 className="feed-title text-xl text-[#8B4513] font-semibold">أحدث المنشورات</h2>
                <div className="sort-options relative">
                    <FaSort className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <select
                        className="pr-8 pl-2 py-1 rounded border bg-white text-[#5C4033] text-sm cursor-pointer"
                        value={sortOption}
                        onChange={handleSortChange}
                    >
                        <option>الأحدث</option>
                        <option>الأكثر تفاعلاً</option>
                        <option>الأعلى تقييماً</option>
                    </select>
                </div>
            </div>

            {sortedPosts.map((post) => (
                <div
                    key={post.id}
                    className="post-card bg-white rounded shadow-md mb-6 transition hover:-translate-y-[3px] hover:shadow-lg border-t-4 border-[#B22222] relative p-4"
                >
                    <div className="post-header flex items-center mb-3">
                        <img
                            src={post.userProfilePicture || profileimage}
                            className="w-10 h-10 border-2 border-red-900 rounded-full cursor-pointer"
                            onClick={() => goToProfile(post.userId)}  // عند الضغط على الصورة يتم التوجيه إلى صفحة البروفايل
                        />
                        <div className="post-author-info mt-2 mr-3 flex-1">
                            <h3 className="post-author-name font-normal text-[#5C4033] text-lg flex items-center">
                                {post.nameOfUser}
                            </h3>
                            <p className="post-time text-gray-500 text-xs mt-1">
                                {post.timeAgo} • {post.nameOfCategory}
                            </p>
                        </div>

                        <span className="post-category bg-[#fcfcfb] text-[#8B4513] px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                            <PostSettings post={post} setPosts={setPosts} />
                        </span>
                    </div>

                    <div className="post-content mb-3 text-base leading-relaxed">
                        <p className="whitespace-pre-line">{post.content}</p>

                        {post.imageURL?.length > 0 && (
                            <div className="post-img-container mb-3 rounded overflow-hidden">
                                <img
                                    src={post.imageURL[0]}
                                    alt="صورة المنشور"
                                    className="w-full max-h-96 object-cover cursor-pointer transition hover:scale-105"
                                    onClick={() => setSelectedPost(post)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="post-actions flex border-t pt-3">
                        <Like post={post} />

                        <div
                            className="post-action flex items-center mr-3 text-gray-600 cursor-pointer transition hover:text-[#A0522D] text-sm"
                            onClick={() => toggleComments(post.id)}
                        >
                            <span>{post.commentCount}</span>
                            <FaComment className="ml-1 text-gray-500" />
                        </div>
                        <div className="post-action flex items-center text-gray-600 cursor-pointer transition hover:text-[#A0522D] text-sm">
                            <FaShareAlt className="ml-1 text-gray-500" />
                        </div>
                    </div>

                    {openComments[post.id] && <Comment post={post} />}
                </div>
            ))}

            {selectedPost && (
                <div
                    className="fixed inset-0 bg-[#f5f5dc] bg-opacity-60 flex justify-center items-center z-50"
                    onClick={() => setSelectedPost(null)}
                >
                    <div
                        className="bg-white w-[90%] h-[90%] md:flex rounded-lg overflow-hidden relative shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span
                            className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 text-2xl"
                            onClick={() => setSelectedPost(null)}
                        >
                            <FaTimes />
                        </span>

                        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-black flex items-center justify-center">
                            <img
                                src={selectedPost.imageURL?.[0]}
                                alt="صورة البوست"
                                className="object-contain w-full h-full"
                            />
                        </div>

                        <div className="w-full md:w-1/2 h-1/2 md:h-full p-6 overflow-y-auto bg-white">
                            <div className="flex items-center mb-4">
                                <img
                                    src={selectedPost.userProfilePicture || profileimage}
                                    alt="مستخدم"
                                    className="w-10 h-10 rounded-full border-2 border-red-800"
                                />
                                <div className="mr-3">
                                    <h3 className="text-[#5C4033] font-semibold">{selectedPost.nameOfUser}</h3>
                                    <p className="text-xs text-gray-500">{selectedPost.timeAgo}</p>
                                </div>
                            </div>

                            <p className="text-[#5C4033] mb-4">{selectedPost.content}</p>

                            <Comment post={selectedPost} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
