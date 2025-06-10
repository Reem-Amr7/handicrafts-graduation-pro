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
import Repost from './Repost';

export default function Posty() {
    const { token } = useContext(TokenContext);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [openComments, setOpenComments] = useState({});
    const [sortOption, setSortOption] = useState("الأحدث");
    const [selectedPost, setSelectedPost] = useState(null);
    const navigate = useNavigate();

    const fetchReposts = async (culturalArticleId) => {
        try {
            const response = await axios.get(
                `https://ourheritage.runasp.net/api/Repost/get-reposts/${culturalArticleId}?pageIndex=1&pageSize=10`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (response.status === 200) {
                return response.data.items || [];
            }
            return [];
        } catch (err) {
            console.error("خطأ في جلب الريبوستات:", err);
            return [];
        }
    };

    const fetchPostById = async (culturalArticleId) => {
        try {
            const response = await axios.get(
                `https://ourheritage.runasp.net/api/Articles/${culturalArticleId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );
            return response.data;
        } catch (err) {
            console.error(`خطأ في جلب المنشور ${culturalArticleId}:`, err);
            return null;
        }
    };

    useEffect(() => {
        if (!token) {
            setError("يرجى تسجيل الدخول لعرض المنشورات.");
            return;
        }

        const fetchAllPosts = async () => {
            try {
                // Fetch original posts
                const postsResponse = await axios.get(
                    "https://ourheritage.runasp.net/api/Articles?PageIndex=1&PageSize=30",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );

                if (postsResponse.status === 200) {
                    const originalPosts = postsResponse.data.items || postsResponse.data;

                    // Fetch reposts for each post and include original post details
                    const postsWithReposts = await Promise.all(
                        originalPosts.map(async (post) => {
                            const reposts = await fetchReposts(post.id);
                            // Fetch original post details for each repost
                            const repostsWithOriginal = await Promise.all(
                                reposts.map(async (repost) => {
                                    const originalPost = await fetchPostById(repost.culturalArticleId);
                                    return {
                                        ...repost,
                                        isRepost: true,
                                        originalPost: originalPost || {
                                            id: repost.culturalArticleId,
                                            content: "المنشور الأصلي غير متوفر",
                                            userId: 0,
                                            nameOfUser: "مستخدم غير معروف",
                                            userProfilePicture: profileimage,
                                            dateCreated: repost.dateCreated,
                                            imageURL: [],
                                            commentCount: 0,
                                            likeCount: 0,
                                        },
                                    };
                                })
                            );
                            return {
                                ...post,
                                isRepost: false,
                                reposts: repostsWithOriginal,
                            };
                        })
                    );

                    setPosts(postsWithReposts);
                } else {
                    setError("لا توجد منشورات حالياً.");
                }
            } catch (err) {
                console.error("خطأ في جلب المنشورات:", err);
                setError("حدث خطأ أثناء جلب المنشورات. حاول مرة أخرى.");
            }
        };

        fetchAllPosts();
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
        navigate(`/profile/${userId}`);
    };

    const handleRepostSuccess = async (culturalArticleId) => {
        const updatedPosts = await Promise.all(
            posts.map(async (post) => {
                if (post.id === culturalArticleId) {
                    const reposts = await fetchReposts(post.id);
                    const repostsWithOriginal = await Promise.all(
                        reposts.map(async (repost) => {
                            const originalPost = await fetchPostById(repost.culturalArticleId);
                            return {
                                ...repost,
                                isRepost: true,
                                originalPost: originalPost || {
                                    id: repost.culturalArticleId,
                                    content: "المنشور الأصلي غير متوفر",
                                    userId: 0,
                                    nameOfUser: "مستخدم غير معروف",
                                    userProfilePicture: profileimage,
                                    dateCreated: repost.dateCreated,
                                    imageURL: [],
                                    commentCount: 0,
                                    likeCount: 0,
                                },
                            };
                        })
                    );
                    return {
                        ...post,
                        reposts: repostsWithOriginal,
                    };
                }
                return post;
            })
        );
        setPosts(updatedPosts);
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

            {sortedPosts
                .filter((post) => !post.isHidden)
                .map((post) => (
                    <div key={post.id} className="mb-6 mt-8">
                        {/* Original Post */}
                        <div className="post-card bg-white rounded shadow-md transition hover:-translate-y-[3px] hover:shadow-lg border-t-4 border-[#B22222] relative p-4">
                            <div className="post-header flex items-center mb-3">
                                <img
                                    src={post.userProfilePicture || profileimage}
                                    className="w-10 h-10 border-2 border-red-900 rounded-full cursor-pointer"
                                    onClick={() => goToProfile(post.userId)}
                                    alt="Profile"
                                />
                                <div className="post-author-info mt-2 mr-3 flex-1">
                                    <h3 className="post-author-name font-normal text-[#5C4033] text-lg flex items-center">
                                        {post.nameOfUser || "مستخدم غير معروف"}
                                    </h3>
                                    <p className="post-time text-gray-500 text-xs mt-1">
                                        {post.timeAgo ||
                                            new Date(post.dateCreated).toLocaleString("ar-EG", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        {post.nameOfCategory && ` • ${post.nameOfCategory}`}
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
                                    <span>{post.commentCount || 0}</span>
                                    <FaComment className="ml-1 text-gray-500" />
                                </div>
                                <div className="post-action flex items-center text-gray-600 cursor-pointer transition hover:text-[#A0522D] text-sm">
                                    <Repost post={post} userId={post.userId || 0} onSuccess={() => handleRepostSuccess(post.id)} />
                                    <span>{post.reposts?.length || 0}</span>
                                </div>
                            </div>

                            {openComments[post.id] && <Comment post={post} />}
                        </div>

                        {/* Reposts */}
                        {post.reposts?.length > 0 && (
                            <div className="mt-4">
                                {post.reposts.map((repost) => (
                                    <div
                                        key={repost.id}
                                        className="post-card mt-4 w-full bg-white rounded shadow-md transition hover:-translate-y-[3px] hover:shadow-lg border-t-4 border-[#8B4513] relative p-4 ml-8"
                                    >
                                        <span className="absolute top-2 right-2 bg-[#f8f8f8] text-[#8B4513] px-2 py-1 rounded text-xs font-semibold">
                                            منشور معاد نشره
                                        </span>
                                        <div className="post-header flex items-center mb-3">
                                            <img
                                                src={repost.user?.profilePicture || profileimage}
                                                className="w-10 h-10 border-2 border-red-900 rounded-full cursor-pointer"
                                                onClick={() => goToProfile(repost.userId)}
                                                alt="Profile"
                                            />
                                            <div className="post-author-info mt-2 mr-3 flex-1">
                                                <h3 className="post-author-name font-normal text-[#5C4033] text-lg flex items-center">
                                                    {repost.user?.fullName ||
                                                        `${repost.user?.firstName || ""} ${repost.user?.lastName || ""}`.trim() ||
                                                        "مستخدم غير معروف"}
                                                </h3>
                                                <p className="post-time text-gray-500 text-xs mt-1">
                                                    {new Date(repost.dateCreated).toLocaleString("ar-EG", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {repost.content && repost.content !== " " && (
                                            <div className="mb-3 text-base leading-relaxed text-[#5C4033]">
                                                <p className="whitespace-pre-line">{repost.content}</p>
                                            </div>
                                        )}

                                        {/* Original Post within Repost */}
                                        <div className="bg-[#fdf9f5] border border-[#deb887] rounded p-4 shadow-inner">
                                            <div className="flex items-center mb-3">
                                                <img
                                                    src={repost.originalPost.userProfilePicture || profileimage}
                                                    className="w-8 h-8 border-2 border-red-900 rounded-full cursor-pointer"
                                                    onClick={() => goToProfile(repost.originalPost.userId)}
                                                    alt="Profile"
                                                />
                                                <div className="ml-3">
                                                    <h4 className="text-[#5C4033] font-medium">
                                                        {repost.originalPost.nameOfUser || "مستخدم غير معروف"}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(repost.originalPost.dateCreated).toLocaleString(
                                                            "ar-EG",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#5C4033] whitespace-pre-line mb-3">
                                                {repost.originalPost.content}
                                            </p>
                                            {repost.originalPost.imageURL?.length > 0 && (
                                                <img
                                                    src={repost.originalPost.imageURL[0]}
                                                    alt="صورة المنشور الأصلي"
                                                    className="w-full max-h-80 object-cover rounded"
                                                />
                                            )}
                                        </div>

                                        <div className="post-actions flex border-t pt-3 mt-3">
                                            <Like post={repost} />
                                            <div
                                                className="post-action flex items-center mr-3 text-gray-600 cursor-pointer transition hover:text-[#A0522D] text-sm"
                                                onClick={() => toggleComments(repost.id)}
                                            >
                                                <span>{repost.commentCount || 0}</span>
                                                <FaComment className="ml-1 text-gray-500" />
                                            </div>
                                            <div className="post-action flex items-center text-gray-600 cursor-pointer transition hover:text-[#A0522D] text-sm">
                                                <Repost
                                                    post={repost.originalPost}
                                                    userId={repost.userId || 0}
                                                    onSuccess={() => handleRepostSuccess(repost.originalPost.id)}
                                                />
                                                <span>{repost.reposts?.length || 0}</span>
                                            </div>
                                        </div>

                                        {openComments[repost.id] && <Comment post={repost} />}
                                    </div>
                                ))}
                            </div>
                        )}
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
                        <div className="p-6 text-[#8B4513] font-normal text-lg flex flex-col justify-between">
                            <h3 className="text-lg font-semibold">{selectedPost.title || "بدون عنوان"}</h3>
                            <p className="text-base leading-relaxed">{selectedPost.content}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}