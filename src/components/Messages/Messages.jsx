import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { TokenContext } from "../../Context/TokenContext";
import { FaReply, FaTimes, FaUsers } from "react-icons/fa";
import chatBackground from "../../assets/back2.jpg";

export default function ChatApp() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showFriendList, setShowFriendList] = useState(false);
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatSearchTerm, setChatSearchTerm] = useState("");
  const [chatAreaMessage, setChatAreaMessage] = useState("");
  const [error, setError] = useState(null);
  const [friendError, setFriendError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const userId = localStorage.getItem("userId") || "tempUserId";
  const userName = localStorage.getItem("userName") || "You";
  const { token } = useContext(TokenContext);

  useEffect(() => {
    if ((showFriendList || showGroupModal) && userId && token) {
      axios
        .get(`https://ourheritage.runasp.net/api/Follow/${userId}/followings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const friendsData = res.data || [];
          console.log("Friends API Response:", friendsData);
          setFriends(friendsData.filter(f => f.id && f.userName));
          setFriendError(null);
        })
        .catch((err) => {
          console.error("Error fetching friends:", err.response?.data);
          setFriendError("خطأ في جلب الأصدقاء");
        });
    }
  }, [showFriendList, showGroupModal, token, userId]);

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

        const messages = res.data.items.map((msg) => {
          console.log("Message Sender Data:", {
            senderId: msg.sender?.id,
            senderFirstName: msg.sender?.firstName,
            userId,
            userName,
          });
          return {
            id: msg.id || `msg-${Date.now()}`,
            conversationId: msg.conversationId,
            content: msg.content,
            senderId: msg.sender?.id || null,
            sentBy: msg.sender?.firstName || "Unknown",
            fullName: `${msg.sender?.firstName || "Unknown"} ${msg.sender?.lastName || ""}`.trim(),
            profilePicture: msg.sender?.profilePicture || "https://via.placeholder.com/40",
            sentAt: msg.sentAt || new Date().toISOString(),
            type: msg.type === 0 ? "normal" : "system",
            replyToMessageId: msg.replyToMessageId || null,
          };
        });

        const convRes = await axios.get(
          "https://ourheritage.runasp.net/api/Chat/conversations?page=1&pageSize=20",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Conversations API Response:", convRes.data);

        const conversationMap = convRes.data.items.reduce((acc, conv) => {
          const isGroup = conv.participants?.length > 2;
          acc[conv.id] = {
            id: conv.id,
            title: conv.title || (isGroup ? "Untitled Group" : conv.participants
              ?.filter(p => p.id !== Number(userId))
              .map((p) => `${p.firstName} ${p.lastName || ""}`)
              .join(", ") || "Unknown"),
            participants: conv.participants || [],
            isGroup,
          };
          console.log(`Conversation ${conv.id}: title=${acc[conv.id].title}, isGroup=${isGroup}`);
          return acc;
        }, {});

        const groupedConversations = messages.reduce((acc, msg) => {
          const convId = msg.conversationId;
          if (!acc[convId]) {
            const convData = conversationMap[convId] || {};
            acc[convId] = {
              id: convId,
              title: convData.title,
              messages: [],
              participants: convData.participants || [{ firstName: msg.sentBy, lastName: msg.sender?.lastName || "" }],
              lastMessage: msg,
              isGroup: convData.isGroup || false,
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
        setError("خطأ في جلب الرسائل: " + (err.response?.data?.message || err.message));
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
      replyToMessageId: replyToMessage?.id || 0,
    };
    console.log("Sending payload:", payload);

    try {
      const endpoint = replyToMessage
        ? "https://ourheritage.runasp.net/api/Chat/messages/reply"
        : "https://ourheritage.runasp.net/api/Chat/messages";

      const res = await axios.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.status === 200 || res.status === 201) {
        const newMsg = {
          id: res.data.id || Date.now(),
          conversationId: selectedChat.id,
          content: trimmed,
          senderId: Number(userId),
          sentBy: userName,
          fullName: userName,
          profilePicture: "https://via.placeholder.com/40",
          sentAt: new Date().toISOString(),
          type: "normal",
          replyToMessageId: replyToMessage?.id || null,
        };
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...(prev?.messages || []), newMsg],
        }));
        if (fromChatArea) {
          setChatAreaMessage("");
          setReplyToMessage(null);
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
      c.participants.some((p) => p.id === friend.id && !c.isGroup)
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
          isGroup: false,
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

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError("يرجى إدخال اسم المجموعة");
      return;
    }
    if (selectedParticipants.length === 0) {
      setError("يرجى اختيار مشارك واحد على الأقل");
      return;
    }

    setIsCreatingChat(true);
    try {
      const createRes = await axios.post(
        "https://ourheritage.runasp.net/api/Chat/conversations",
        {
          participantIds: selectedParticipants.map(id => Number(id)),
          title: groupName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("New group conversation response:", createRes.data);
      if (!createRes.data?.conversationId) {
        throw new Error("Invalid conversation ID returned");
      }

      const conversationId = createRes.data.conversationId;

      for (const participantId of selectedParticipants) {
        try {
          await axios.post(
            "https://ourheritage.runasp.net/api/Chat/conversations/join",
            { conversationId: Number(conversationId) },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
          console.log(`Participant ${participantId} joined group ${conversationId}`);
        } catch (joinErr) {
          console.error(`Error joining participant ${participantId}:`, joinErr.response?.data);
        }
      }

      const newConv = {
        id: conversationId,
        title: groupName,
        messages: [],
        participants: [
          { firstName: userName, id: Number(userId) },
          ...friends
            .filter(f => selectedParticipants.includes(f.id))
            .map(f => ({ firstName: f.userName, id: f.id })),
        ],
        lastMessage: null,
        isGroup: true,
      };
      setConversations((prev) => [...prev, newConv]);
      setSelectedChat(newConv);
      console.log("New group created and selected:", newConv);

      setShowGroupModal(false);
      setGroupName("");
      setSelectedParticipants([]);
    } catch (err) {
      console.error("Error creating group:", err.response?.data || err.message);
      setError(`خطأ في إنشاء المجموعة: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const toggleParticipant = (friendId) => {
    setSelectedParticipants((prev) =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleReply = (message) => {
    setReplyToMessage(message);
    setChatAreaMessage(`رد على "${message.content}": `);
  };

  const toggleFriendList = () => {
    setShowFriendList((prev) => !prev);
    if (showFriendList) {
      setFriendError(null);
      setFriends([]);
    }
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
    f.userName?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-screen border border-gray-200" dir="rtl">
      {/* الشريط الجانبي */}
      <div
        className="w-1/4 border-r border-gray-300 bg-gray-50 overflow-y-auto"
        style={{ backgroundColor: "#F5F5DC", borderLeft: "1px solid black" }}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <button
            onClick={toggleFriendList}
            className="text-sm h-10 text-white px-3 py-1 rounded hover:bg-blue-700"
            style={{ backgroundColor: "brown" }}
          >
            بدء محادثة
          </button>
          <button
            onClick={() => setShowGroupModal(true)}
            className="text-sm h-10 text-white px-3 py-1 rounded hover:bg-blue-700"
            style={{ backgroundColor: "brown" }}
          >
            <FaUsers className="inline-block w-4 h-4 ml-1" />
            إنشاء مجموعة
          </button>
        </div>

        {showFriendList && (
          <div className="bg-white shadow p-3 space-y-2">
            <input
              type="text"
              placeholder="ابحث عن صديق..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72 mr-9 p-2 border border-black-300 rounded"
            />
            {friendError ? (
              <div className="text-sm text-red-500 text-center">{friendError}</div>
            ) : (
              <ul className="space-y-1 max-h-60 overflow-y-auto">
                {filteredFriends.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center">
                    لا يوجد أصدقاء لعرضهم
                  </div>
                ) : (
                  filteredFriends.map((friend, index) => (
                    <li
                      key={friend.id || `friend-${index}`}
                      className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                    >
                      <span>{friend.userName}</span>
                      <button
                        onClick={() => handleStartChat(friend)}
                        className="text-blue-500 text-sm hover:underline bg-slate-300 w-20"
                        disabled={isCreatingChat}
                      >
                        ابدأ
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        )}

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
                className={`cursor-pointer p-4 border-b hover:bg-gray-50 ${
                  selectedChat?.id === conv.id ? "bg-white font-semibold" : ""
                }`}
              >
                <div className="flex items-center gap-2 text-sm">
                  <img
                    src={
                      conv.isGroup
                        ? "https://via.placeholder.com/40?text=Group"
                        : conv.participants?.find((p) => p.id !== Number(userId))?.profilePicture ||
                          "https://via.placeholder.com/40"
                    }
                    alt={conv.isGroup ? "Group" : `${conv.participants?.find((p) => p.id !== Number(userId))?.firstName || "Unknown"}'s profile`}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
                  />
                  <div className="flex flex-col">
                    <span>{conv.title}</span>
                    <div className="text-xs text-gray-600 truncate pr-2">
                      {conv.lastMessage?.content ||
                        conv.messages?.[0]?.content ||
                        "لا توجد رسائل"}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {/* {page < totalPages && (
          <button
            onClick={loadMoreMessages}
            className="w-full p-2 text-blue-500 hover:bg-gray-100"
          >
            تحميل المزيد
          </button>
        )} */}
      </div>

      {/* Group Creation Modal */}
      {showGroupModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          dir="rtl"
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              width: "384px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>إنشاء مجموعة جديدة</h3>
              <button
                onClick={() => {
                  setShowGroupModal(false);
                  setGroupName("");
                  setSelectedParticipants([]);
                }}
                style={{ color: "#ef4444", fontSize: "24px", cursor: "pointer" }}
              >
                <FaTimes />
              </button>
            </div>
            <input
              type="text"
              placeholder="اسم المجموعة..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            />
            <input
              type="text"
              placeholder="ابحث عن أصدقاء..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            />
            <ul style={{ maxHeight: "160px", overflowY: "auto", marginBottom: "16px" }}>
              {filteredFriends.length === 0 ? (
                <div style={{ fontSize: "14px", color: "#6b7280", textAlign: "center" }}>
                  لا يوجد أصدقاء لعرضهم
                </div>
              ) : (
                filteredFriends.map((friend) => (
                  <li
                    key={friend.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px",
                      borderRadius: "4px",
                    }}
                  >
                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(friend.id)}
                        onChange={() => toggleParticipant(friend.id)}
                        style={{ width: "16px", height: "16px" }}
                      />
                      {friend.userName}
                    </label>
                  </li>
                ))
              )}
            </ul>
            <div style={{ display: "flex", justifyContent: "end", gap: "8px" }}>
              <button
                onClick={handleCreateGroup}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#894414",
                  color: "white",
                  borderRadius: "4px",
                  cursor: isCreatingChat ? "not-allowed" : "pointer",
                }}
                disabled={isCreatingChat}
              >
                {isCreatingChat ? "جاري الإنشاء..." : "إنشاء"}
              </button>
              <button
                onClick={() => {
                  setShowGroupModal(false);
                  setGroupName("");
                  setSelectedParticipants([]);
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#d1d5db",
                  color: "#1f2937",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* منطقة المحادثة */}
      <div className="flex-1 flex flex-col bg-gray-100 relative">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            لا توجد محادثات. ابدأ محادثة جديدة من القائمة الجانبية.
          </div>
        ) : selectedChat ? (
          <>
            <div
              className="p-4 border-b font-semibold sticky top-0 z-10"
              style={{ backgroundColor: "#F5F5DC", borderBottom: "1px solid black" }}
            >
              {selectedChat.title}
            </div>
            <div
              className="flex-1 p-4 overflow-y-auto space-y-4"
              style={{
                paddingBottom: "120px",
                backgroundImage: `url(${chatBackground})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              {(selectedChat.messages || []).map((msg, index) => {
                const isUser = msg.senderId
                  ? String(msg.senderId) === String(userId)
                  : msg.sentBy.trim().toLowerCase() === userName.trim().toLowerCase();
                const isSystem = msg.type === "system";
                const repliedMessage = msg.replyToMessageId
                  ? selectedChat.messages.find((m) => m.id === msg.replyToMessageId)
                  : null;

                return (
                  <div
                    key={`msg-${msg.id || index}`}
                    className={`flex items-start gap-2 max-w-[98%] ${
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
                          ? "bg-[#d5ab9f] text-white w-80"
                          : "bg-white text-gray-800 w-80"
                      }`}
                    >
                      {!isSystem && (
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-semibold">{msg.fullName}</p>
                          <FaReply
                            className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                            title="رد"
                            onClick={() => handleReply(msg)}
                          />
                        </div>
                      )}
                      {repliedMessage && (
                        <div className="text-xs bg-gray-100 p-2 rounded mb-2">
                          <p className="font-semibold">{repliedMessage.fullName}</p>
                          <p className="truncate">{repliedMessage.content}</p>
                        </div>
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
            <div className="absolute bottom-0 w-full bg-white border-t p-4 z-20">
              {replyToMessage && (
                <div className="w-full bg-gray-100 p-2 mb-2 rounded flex justify-between items-center">
                  <p className="text-sm">رد على: {replyToMessage.content}</p>
                  <span
                    onClick={() => setReplyToMessage(null)}
                    className="text-red-500 text-2xl cursor-pointer hover:scale-110 transition-transform"
                    title="إلغاء الرد"
                  >
                    ×
                  </span>
                </div>
              )}
              <form
                className="flex"
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
                  className={`flex-1 p-2 h-12 border border-gray-300 rounded-l focus:outline-none ${
                    !selectedChat || isSending || isCreatingChat || !selectedChat.id
                      ? "bg-gray-200 cursor-not-allowed"
                      : ""
                  }`}
                />
                <button
                  type="submit"
                  disabled={!selectedChat || !chatAreaMessage.trim() || isSending || isCreatingChat || !selectedChat.id}
                  style={{
                    backgroundColor:
                      selectedChat && chatAreaMessage.trim() && !isSending && !isCreatingChat && selectedChat.id
                        ? "#894414"
                        : "#d1d5db",
                  }}
                  className="px-4 py-2 w-24 h-12 mr-5 rounded-r text-white cursor-pointer"
                >
                  {isSending ? "جاري الإرسال..." : "إرسال"}
                </button>
              </form>
            </div>
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