// frontend/src/features/dashboard/layout/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { IoClose, IoSparkles, IoSend, IoSyncOutline } from "react-icons/io5";
import ReactMarkdown from "react-markdown";
import axios from "../../../api/Api";
import { useTheme } from "../../../context/ThemeContext";
import { useChatbot } from "../../../context/ChatbotContext";

const Chatbot = () => {
  const { isOpen, closeChat } = useChatbot();
  const { darkMode } = useTheme();

  const orange = "hsl(12, 98%, 52%)";
  const orangeLight = "hsl(12, 98%, 65%)";
  const orangeDark = "hsl(12, 98%, 40%)";

  const theme = darkMode
    ? {
        bg: "#111",
        sidebar: "rgba(25,25,25,0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        text: "#fff",
        secondary: "#ccc",
        aiBubble: "rgba(255,255,255,0.06)",
        userBubble: `linear-gradient(135deg, ${orangeLight}, ${orangeDark})`,
        inputBg: "rgba(255,255,255,0.05)",
        avatarBg: orange,
      }
    : {
        bg: "#f8f9fa",
        sidebar: "rgba(255,255,255,0.95)",
        border: "1px solid rgba(0,0,0,0.1)",
        text: "#212529",
        secondary: "#6c757d",
        aiBubble: "rgba(0,0,0,0.05)",
        userBubble: `linear-gradient(135deg, ${orangeLight}, ${orangeDark})`,
        inputBg: "rgba(0,0,0,0.05)",
        avatarBg: orange,
      };

  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isOpen]);

  const handleGetTip = async () => {
    if (!userInput.trim()) return;

    const userMsg = {
      role: "user",
      content: userInput,
      id: `${Date.now()}-u`,
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        "/ai/get-tip",
        { prompt: userMsg.content },
        { timeout: 60000 }
      );

      const aiText = res?.data?.tip ?? "No tip returned.";
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", content: aiText, id: `${Date.now()}-a` },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", content: "Unable to fetch tip right now.", id: `${Date.now()}-e` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={closeChat}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 6400,
          }}
        ></div>
      )}

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "380px",
          background: theme.sidebar,
          borderLeft: theme.border,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform .28s ease",
          zIndex: 6500,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: "1rem",
            borderBottom: theme.border,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IoSparkles size={20} style={{ color: orange }} />
            <h3 style={{ margin: 0 }}>AI Assistant</h3>
          </div>

          <button
            onClick={closeChat}
            style={{ background: "none", border: "none", color: theme.secondary }}
          >
            <IoClose size={24} />
          </button>
        </header>

        {/* Messages */}
        <div
          style={{
            flexGrow: 1,
            padding: "1rem",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                gap: "10px",
              }}
            >
              {msg.role === "ai" && (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: theme.avatarBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IoSparkles size={16} color="#fff" />
                </div>
              )}

              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "1rem",
                  maxWidth: "75%",
                  background: msg.role === "user" ? theme.userBubble : theme.aiBubble,
                  color: msg.role === "user" ? "#fff" : theme.text,
                }}
              >
              
              <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p {...props} style={{ margin: 0 }} />
                ),
              }}
            >
              {msg.content}
            </ReactMarkdown>

              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: theme.avatarBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IoSparkles size={16} color="#fff" />
              </div>

              <div
                style={{
                  padding: "0.75rem",
                  background: theme.aiBubble,
                  borderRadius: "1rem",
                }}
              >
                <IoSyncOutline className="spin" size={20} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "1rem", borderTop: theme.border }}>
          <div
            style={{
              background: theme.inputBg,
              borderRadius: "0.75rem",
              padding: "0.5rem",
              border: theme.border,
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGetTip()}
              placeholder="Ask AI Assistant..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: theme.text,
              }}
            />

            <button
              onClick={handleGetTip}
              style={{
                background: theme.avatarBg,
                borderRadius: "0.5rem",
                border: "none",
                padding: "0.5rem",
              }}
            >
              <IoSend size={20} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
