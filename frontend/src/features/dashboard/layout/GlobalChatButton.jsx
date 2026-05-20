import React from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useChatbot } from "../../../context/ChatbotContext";

export default function GlobalChatButton() {
  const { toggleChat } = useChatbot();

  return (
    <button
      onClick={toggleChat}
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        background: "linear-gradient(90deg, hsl(12,98%,65%), hsl(12,98%,40%))",
        color: "#fff",
        borderRadius: "50%",
        width: "3.5rem",
        height: "3.5rem",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",

        // LOWER than chatbot’s z-index (6500)
        zIndex: 6400,
      }}
    >
      <IoChatbubbleEllipsesOutline size={22} />
    </button>
  );
}
