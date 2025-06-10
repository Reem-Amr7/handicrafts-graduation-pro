import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { TokenContext } from "../../Context/TokenContext";

export default function ChatApp() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showFriendList, setShowFriendList] = useState(false);
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatSearchTerm, setChatSearchTerm] = useState("");
  const [chatAreaMessage, setChatAreaMessage] = useState("");
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userId = localStorage.getItem("userId") || "tempUserId";
  const userName = localStorage.getItem("userName") || "You";
  const { token } = useContext(TokenContext);

  useEffect(() => {
    if (showFriendList && userId && token) {
      axios
        .get(`https://ourheritage.runasp.net/api/Follow/${userId}/followings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const friendsData = res.data || [];
          console.log("Friends API Response:", friendsData);
          setFriends(friendsData.filter(f => f.id && f.userName));
        })
        .catch((err) => {
          console.error("Error fetching friends:", err.response?.data);
          setError("خطأ في جلب الأصدقاء");
        });
    }
  }, [showFriendList, token, userId]);

  useEffect(() => {
    async function fetchMessages() {
      if (!token) {
        setError("يرجى تسجيل الدخول لعرض الرسائل");
        return;
      }
      try {
        const res = await axios.get(
          `https://ourheritage.runasp.net/api/Chat/messages/all?page=${page}&pageSize=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        console.log("Messages API Response:", res.data);

        const messages = res.data.items.map((msg) => ({
          id: msg.id || `msg-${Date.now()}`,
          conversationId: msg.conversationId,
          content: msg.content,
          sentBy: msg.sender?.firstName || "Unknown",
          fullName: `${msg.sender?.firstName || "Unknown"} ${msg.sender?.lastName || ""}`.trim(),
          profilePicture: msg.sender?.profilePicture || "https://via.placeholder.com/40",
          sentAt: msg.sentAt || new Date().toISOString(),
          type: msg.type === 0 ? "normal" : "system",
        }));

        const convRes = await axios.get(
          "https://ourheritage.runasp.net/api/Chat/conversations?page=1&pageSize=20",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Conversations API Response:", convRes.data);

        const conversationMap = convRes.data.items.reduce((acc, conv) => {
          acc[conv.id] = {
            id: conv.id,
            title: conv.title || conv.participants
              ?.filter(p => p.id !== Number(userId))
              .map((p) => `${p.firstName} ${p.lastName || ""}`)
              .join(", ") || "Unknown",
            participants: conv.participants || [],
          };
          return acc;
        }, {});

        const groupedConversations = messages.reduce((acc, msg) => {
          const convId = msg.conversationId;
          if (!acc[convId]) {
            const convData = conversationMap[convId] || {
              id: convId,
              title: msg.fullName,
              participants: [{ firstName: msg.sentBy, lastName: msg.sender?.lastName || "" }],
            };
            acc[convId] = {
              id: convId,
              title: convData.title,
              messages: [],
              participants: convData.participants,
              lastMessage: msg,
            };
          }
          acc[convId].messages.push(msg);
          acc[convId].lastMessage = msg;
          return acc;
        }, {});

        const updatedConversations = Object.values(groupedConversations);
        console.log("Conversations:", updatedConversations);
        setConversations(updatedConversations);
        setTotalPages(res.data.totalPages);
        if (!selectedChat && updatedConversations.length > 0) {
          setSelectedChat(updatedConversations[0]);
        } else if (updatedConversations.length === 0) {
          setSelectedChat(null);
          console.log("No conversations available");
        }
      } catch (err) {
        console.error("خطأ في جلب الرسائل:", err.response?.data);
        setError("خطأ في جلب الرسائل");
      }
    }

    fetchMessages();
  }, [token, page, userName, userId]);

  const loadMoreMessages = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const sendMessage = async (messageContent, fromChatArea = false) => {
    const trimmed = messageContent.trim();
    if (!selectedChat?.id || !trimmed || !Number.isFinite(Number(selectedChat.id)) || isSending || isCreatingChat) {
      console.log("Send message blocked:", {
        selectedChatId: selectedChat?.id,
        message: trimmed,
        isSending,
        isCreatingChat,
      });
      setError("يرجى تحديد محادثة صالحة أو إدخال رسالة");
      return;
    }

    setIsSending(true);
    const payload = {
      conversationId: Number(selectedChat.id),
      content: trimmed,
      type: 0,
      attachment: "",
    };
    console.log("Sending payload:", payload);

    try {
      const res = await axios.post(
        "https://ourheritage.runasp.net/api/Chat/messages",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        const newMsg = {
          id: res.data.id || Date.now(),
          conversationId: selectedChat.id,
          content: trimmed,
          sentBy: userName,
          fullName: userName,
          profilePicture: "https://via.placeholder.com/40",
          sentAt: new Date().toISOString(),
          type: "normal",
        };
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...(prev?.messages || []), newMsg],
        }));
        if (fromChatArea) {
          setChatAreaMessage("");
        }

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedChat.id
              ? {
                  ...conv,
                  messages: [...(conv.messages || []), newMsg],
                  lastMessage: newMsg,
                }
              : conv
          )
        );
      }
    } catch (err) {
      console.error("Error sending message:", err.response?.data);
      setError(
        `حدث خطأ أثناء إرسال الرسالة: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleStartChat = async (friend) => {
    console.log("Starting chat with friend:", friend);
    if (!friend?.id || !friend?.userName) {
      console.error("Invalid friend data:", friend);
      setError("بيانات المستخدم غير صالحة. حاول مرة أخرى.");
      return;
    }

    setIsCreatingChat(true);
    const existing = conversations.find((c) =>
      c.participants.some((p) => p.id === friend.id || p.firstName === friend.userName)
    );
    if (existing) {
      setSelectedChat(existing);
      console.log("Selected existing conversation:", existing);
      setIsCreatingChat(false);
    } else {
      try {
        const res = await axios.post(
          "https://ourheritage.runasp.net/api/Chat/conversations",
          {
            participantIds: [Number(friend.id)],
            title: friend.userName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        console.log("New conversation response:", res.data);
        if (!res.data?.conversationId) {
          throw new Error("Invalid conversation ID returned");
        }
        const newConv = {
          id: res.data.conversationId,
          title: friend.userName,
          messages: [],
          participants: [{ firstName: friend.userName, id: friend.id }],
          lastMessage: null,
        };
        setConversations((prev) => [...prev, newConv]);
        setSelectedChat(newConv);
        console.log("New conversation created and selected:", newConv);
      } catch (err) {
        console.error("Error creating conversation:", err.response?.data || err.message);
        setError(`خطأ في إنشاء المحادثة: ${err.response?.data?.message || err.message}`);
      } finally {
        setIsCreatingChat(false);
      }
    }

    setShowFriendList(false);
    setSearchTerm("");
    setChatSearchTerm("");
  };

  const filteredConversations = conversations.filter((conv) => {
    const search = chatSearchTerm.toLowerCase();
    return (
      conv.title?.toLowerCase().includes(search) ||
      conv.participants?.some(
        (p) =>
          p.firstName.toLowerCase().includes(search) ||
          p.lastName?.toLowerCase().includes(search)
      )
    );
  });

  const filteredFriends = friends.filter((f) =>
    f.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error)
    return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="flex h-screen border border-gray-200" dir="rtl">
      {/* الشريط الجانبي */}
      <div className="w-1/3 border-r border-gray-300 bg-gray-50 overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">المحادثات</h2>
          <button
            onClick={() => setShowFriendList(!showFriendList)}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            بدء محادثة
          </button>
        </div>

        {showFriendList && (
          <div className="bg-white shadow p-3 space-y-2">
            <input
              type="text"
              placeholder="ابحث عن صديق..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <ul className="space-y-1 max-h-60 overflow-y-auto">
              {filteredFriends.length === 0 ? (
                <div className="text-sm text-gray-500">لا يوجد نتائج</div>
              ) : (
                filteredFriends.map((friend, index) => (
                  <li
                    key={friend.id || `friend-${index}`}
                    className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                  >
                    <span>{friend.userName}</span>
                    <button
                      onClick={() => handleStartChat(friend)}
                      className="text-blue-500 text-sm hover:underline"
                      disabled={isCreatingChat}
                    >
                      ابدأ
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        <input
          type="text"
          placeholder="ابحث في المحادثات..."
          value={chatSearchTerm}
          onChange={(e) => setChatSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded m-2"
        />
        {filteredConversations.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            لا توجد محادثات متاحة. ابدأ محادثة جديدة!
          </div>
        ) : (
          <ul>
            {filteredConversations.map((conv, index) => (
              <li
                key={conv.id || `conv-${index}`}
                onClick={() => setSelectedChat(conv)}
                className={`cursor-pointer p-4 border-b hover:bg-gray-200 ${
                  selectedChat?.id === conv.id ? "bg-white font-semibold" : ""
                }`}
              >
                <div className="text-sm">
                  {conv.title ||
                    conv.participants
                      ?.filter((p) => p.id !== Number(userId))
                      .map((p) => `${p.firstName} ${p.lastName || ""}`)
                      .join(", ") ||
                    "Unknown"}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {conv.lastMessage?.content ||
                    conv.messages?.[0]?.content ||
                    "لا توجد رسائل"}
                </div>
              </li>
            ))}
          </ul>
        )}
        {page < totalPages && (
          <button
            onClick={loadMoreMessages}
            className="w-full p-2 text-blue-500 hover:bg-gray-100"
          >
            تحميل المزيد
          </button>
        )}
      </div>

      {/* منطقة المحادثة */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            لا توجد محادثات. ابدأ محادثة جديدة من القائمة الجانبية.
          </div>
        ) : selectedChat ? (
          <>
            <div className="p-4 border-b bg-white font-semibold">
              {selectedChat.title ||
                selectedChat.participants
                  ?.filter((p) => p.id !== Number(userId))
                  .map((p) => `${p.firstName} ${p.lastName || ""}`)
                  .join(", ") ||
                "Unknown"}
            </div>
            <div
              className="flex-1 p-4 overflow-y-auto space-y-4"
              style={{ paddingBottom: "60px" }}
            >
              {(selectedChat.messages || []).map((msg, index) => {
                const isUser = msg.sentBy === userName;
                const isSystem = msg.type === "system";
                return (
                  <div
                    key={`msg-${msg.id || index}`}
                    className={`flex items-start gap-2 max-w-[70%] ${
                      isSystem
                        ? "text-center text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-md w-fit mx-auto"
                        : isUser
                        ? "ml-auto flex-row-reverse"
                        : "mr-auto flex-row"
                    }`}
                  >
                    {!isSystem && (
                      <img
                        src={msg.profilePicture}
                        alt={`${msg.fullName}'s profile`}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
                      />
                    )}
                    <div
                      className={`rounded-lg p-3 ${
                        isSystem
                          ? ""
                          : isUser
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      {!isSystem && (
                        <p className="text-sm font-semibold">{msg.fullName}</p>
                      )}
                      <p>{msg.content}</p>
                      {!isSystem && (
                        <small className="text-xs opacity-70">
                          {new Date(msg.sentAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <form
              className="flex p-4 bg-white border-t"
              onSubmit={(e) => {
                e.preventDefault();
                if (!selectedChat || isCreatingChat || !selectedChat.id) return;
                sendMessage(chatAreaMessage, true);
              }}
            >
              <input
                type="text"
                placeholder="اكتب رسالة..."
                value={chatAreaMessage}
                onChange={(e) => setChatAreaMessage(e.target.value)}
                disabled={!selectedChat || isSending || isCreatingChat || !selectedChat.id}
                className={`flex-1 p-2 border border-gray-300 rounded-l focus:outline-none ${
                  !selectedChat || isSending || isCreatingChat || !selectedChat.id
                    ? "bg-gray-200 cursor-not-allowed"
                    : ""
                }`}
              />
              <button
                type="submit"
                disabled={!selectedChat || !chatAreaMessage.trim() || isSending || isCreatingChat || !selectedChat.id}
                className={`px-4 py-2 w-20 rounded-r text-white ${
                  selectedChat && chatAreaMessage.trim() && !isSending && !isCreatingChat && selectedChat.id
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isSending ? "جاري الإرسال..." : "إرسال"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            اختر محادثة لبدء الدردشة
          </div>
        )}
      </div>
    </div>
  );
}