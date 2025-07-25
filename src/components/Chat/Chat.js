import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useOutletContext } from "react-router-dom";
import {
  clearMessages,
  getConversation,
  getdMessages,
  sendMessage,
} from "../../Features/MessageSlice";
import { useSocket } from "../Socket/Socket";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import ImagePreview from "./ImagePreview";
import "./Chat.css";

function Chat() {
  const { userDetails } = useSelector((state) => state.auth);
  const { predictionStatus, prediction } = useSelector(
    (state) => state.prediction
  );
  const { getConversationStatus, messages } = useSelector(
    (state) => state.message
  );
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const scrollAnchorRef = useRef(null);

  const socket = useSocket();
  const dispatch = useDispatch();
  const { darkMode, systemPrefersDark } = useOutletContext();
  const { conversation_id, recipient_id } = useParams();

  useEffect(() => {
    return () => dispatch(clearMessages());
  }, []);

  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (conversation_id) {
      dispatch(getdMessages({ conversation_id }));
    }
  }, [conversation_id]);

  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!files || !message) return;

    const formData = new FormData();
    const member_ids = [recipient_id, userDetails?.refernce_id];
    formData.append("member_ids", member_ids);
    formData.append("content", message);
    if (conversation_id) formData.append("conversation_id", conversation_id);
    dispatch(sendMessage({ formData }));

    setChatMessages((prev) => [
      ...prev,
      {
        sender_id: userDetails?.id,
        conversation_id,
        image: files,
        content: message,
        profilePicture: userDetails?.user_image || "/user-avatar.png",
      },
    ]);

    setMessage("");
    setFiles([]);
    setUploadedFiles([]);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("chat_response", (data) => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender_id: data?.sender_id,
          conversation_id: data?.conversation_id,
          content: data?.content,
          profilePicture: "/user-avatar.png",
        },
      ]);
      // "id": str(row.id),
      // "conversation_id": str(row.conversation_id),
      // "sender_id": str(row.sender_id),
      // "content": row.content,
      // "created_at": row.created_at.isoformat(),
    });
  }, [socket]);

  const handleAddFile = useCallback(() => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.multiple = true;
    inputElement.style.display = "none";
    document.body.appendChild(inputElement);
    inputElement.click();

    inputElement.addEventListener("change", (event) => {
      const newFiles = Array.from(event.target.files);
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => setFiles((prev) => [...prev, reader.result]);
        reader.readAsDataURL(file);
      });

      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      document.body.removeChild(inputElement);
    });
  }, []);

  return (
    <Box className="chat">
      <ChatHeader userImage={userDetails?.user_image} onlineStatus={socket} />
      <ChatMessageList
        messages={chatMessages}
        userDetails={userDetails}
        systemPrefersDark={systemPrefersDark}
        scrollRef={scrollAnchorRef}
      />
      <ImagePreview
        files={files}
        setFiles={setFiles}
        setUploadedFiles={setUploadedFiles}
      />
      <ChatInput
        message={message}
        setMessage={setMessage}
        handleSend={handleSend}
        handleAddFile={handleAddFile}
        systemPrefersDark={systemPrefersDark}
      />
    </Box>
  );
}

export default Chat;
