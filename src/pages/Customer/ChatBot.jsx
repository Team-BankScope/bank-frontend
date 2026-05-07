import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; 
import { useAuth } from "../../context/AuthContext";
import styles from './ChatBot.module.css';
import chatbotImg from '../../images/Home/chatbot.png';
import ReactMarkdown from 'react-markdown';

const ChatBot = () => {
  const { user } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); 
  const chatEndRef = useRef(null);

  
  useEffect(() => {
    const savedChats = sessionStorage.getItem('chatHistory');
    if (savedChats) {
      setMessages(JSON.parse(savedChats));
    } else {
     
      setMessages([{ sender: "banker", text: "안녕하세요! 무엇을 도와드릴까요?", timestamp: new Date().toLocaleString() }]);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const onSend = async () => {
    if (!input.trim()) return;
    

    const userMsg = { 
      sender: "customer", 
      text: input, 
      timestamp: new Date().toLocaleString() 
    };
    
    const updatedWithUser = [...messages, userMsg];
    setMessages(updatedWithUser);
    sessionStorage.setItem('chatHistory', JSON.stringify(updatedWithUser)); // 세션 저장
    setInput("");

    try {
      const response = await axios.post('http://localhost:8000/py/chat', {
        user_id: user?.id || 0, 
        message: input
      });

      if (response.data.result === "SUCCESS") {
     
        const botMsg = { 
          sender: "banker", 
          text: response.data.content, 
          timestamp: response.data.timestamp 
        };
        
        const finalMessages = [...updatedWithUser, botMsg];
        setMessages(finalMessages);
        sessionStorage.setItem('chatHistory', JSON.stringify(finalMessages));
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { sender: "banker", text: "상담 연결이 원활하지 않습니다." }]);
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className={styles.chatbotContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <span>💬 은행원 상담 채팅</span>
            <button className={styles.chatCloseBtn} onClick={toggleChat}><span>✕</span></button>
          </div>

          <div className={styles.chatBody}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "customer"
                    ? styles.customerMsg
                    : styles.bankerMsg
                }
              >
                <div className={styles.msgContent}>
                  {msg.sender === "banker" ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
                <div className={styles.msgTime}>{msg.timestamp}</div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <div className={styles.chatInput}>
            <input
              value={input}
              placeholder="메시지를 입력하세요..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  onSend();
                }
              }}
            />
            <button className={styles.sendBtn} onClick={onSend}><span>➤</span></button>
          </div>
        </div>
      )}

      <button className={styles.floatingButton} onClick={toggleChat}>
        <img src={chatbotImg} alt="챗봇 버튼" />
      </button>
    </div>
  );
};

export default ChatBot;