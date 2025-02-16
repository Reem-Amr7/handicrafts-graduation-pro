import React, { useState } from "react";
import { FaVideo, FaUsers, FaCog, FaMicrophoneSlash, FaTimes, FaComments, FaShareSquare } from "react-icons/fa";
import styles from "./LiveStream.module.css";

export default function LiveStream() {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { text: "رسالة المستخدم الأول", isLeft: true },
    { text: "رسالة المستخدم الثاني", isLeft: false }
  ]);

  const handleSendMessage = () => {
    if (chatInput.trim() !== "") {
      setChatMessages([...chatMessages, { text: chatInput, isLeft: false }]);
      setChatInput("");
    }
  };

  return (
    <div className={styles.container}>
      {/* الجانب الأيسر - الدردشة */}
      <div className={styles.chatSection}>
        <h2 className={styles.chatTitle}>الدردشة العامة</h2>
        {/* تاريخ اليوم تحت كلمة الدردشة */}
        <div className={styles.chatDate}>{new Date().toLocaleDateString()}</div>
        <div className={styles.messagesContainer}>
          {chatMessages.map((msg, index) => (
            <div key={index} className={`${styles.message} ${msg.isLeft ? styles.messageLeft : styles.messageRight}`}>
              <img 
                src="src\assets\user2.jpg" 
                alt="المستخدم الأول" 
                className={styles.avatar} 
              />
              <div className={styles.messageText}>{msg.text}</div>
            </div>
          ))}
        </div>
        {/* حاوية الإدخال مع أيقونة الإرسال */}
        <div className={styles.chatInputContainer} style={{ display: 'flex', alignItems: 'center' }}>
  <input 
    className={styles.chatInput} 
    placeholder="اكتب رسالة..." 
    value={chatInput}
    onChange={(e) => setChatInput(e.target.value)}
  />
  <button 
    className={styles.sendButton} 
    onClick={handleSendMessage} >
    <i className="fa-solid fa-paper-plane"></i>
  </button>
</div>

      </div>

      {/* المنطقة الرئيسية */}
      <div className={styles.mainArea}>
        <div className={styles.videoContainer}>
          <FaVideo className={styles.videoIcon} />
        </div>

        {/* شريط التحكم */}
        <div className={styles.controlBar}>
          <button className={styles.controlButton}>
            <FaUsers className={styles.buttonIcon} /> مشاركين
          </button>
          <button className={styles.controlButton}>
            <FaMicrophoneSlash className={styles.buttonIcon} /> صامت
          </button>
          <button className={styles.controlButton}>
            <FaTimes className={styles.buttonIcon} /> إيقاف الكاميرا
          </button>
          <button className={styles.controlButton}>
            <FaVideo className={styles.buttonIcon} /> تسجيل الفيديو
          </button>
          <button className={styles.controlButton}>
            <FaComments className={styles.buttonIcon} /> الدردشة
          </button>
          <button className={styles.controlButton}>
            <FaShareSquare className={styles.buttonIcon} /> مشاركة الشاشة
          </button>
        </div>
      </div>

      {/* الجانب الأيمن - الإعدادات */}
      <div className={styles.settingsSection}>
        <h2 className={styles.settingsTitle}>الإعدادات</h2>
        <div className={styles.settingsMenu}>
          <button className={styles.menuItem}>
            <FaVideo className={styles.buttonIcon} /> بث الفيديو
          </button>
          <button className={styles.menuItem}>
            <FaCog className={styles.buttonIcon} /> تنظيم
          </button>
          <button className={styles.menuItem}>
            <FaCog className={styles.buttonIcon} /> إعدادات الكاميرا
          </button>
          <button className={styles.menuItem}>
            <FaCog className={styles.buttonIcon} /> إعدادات
          </button>
        </div>
      </div>
    </div>
  );
}
