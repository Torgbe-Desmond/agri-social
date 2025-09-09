import React, { useRef, useState, useEffect, useCallback } from "react";
import { Box, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useSocket } from "../Socket/Socket";
import { sendMessage } from "../../Features/MessageSlice";

import ConversationHeader from "./ConversationHeader";
import MessageList from "./MessageList";
import FilePreviewList from "./FilePreviewList";
import MessageInput from "./MessageInput";

import "./GroupConversation.css";

function GroupConversation() {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { conversation_id, recipient_id } = useParams();

  const { userDetails } = useSelector((state) => state.auth);
  const { systemPrefersDark } = useOutletContext();
  const { currentlyConversingGroup } = useSelector((state) => state.message);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const scrollAnchorRef = useRef(null);

  // Scroll to bottom on messages update
  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Socket listener
  useEffect(() => {
    if (!socket || !socket.connected) return;
    const handleChatResponse = (data) => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender_id: "bot",
          image: null,
          profilePicture: require("../../assets/icons8-farmer-64.png"),
          content: data.content,
        },
      ]);
    };
    socket.on("chat_response", handleChatResponse);
    return () => socket.off("chat_response", handleChatResponse);
  }, [socket]);

  useEffect(() => () => setChatMessages([]), []);

  const handleAddFile = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.style.display = "none";
    document.body.appendChild(input);
    input.click();

    input.addEventListener("change", (event) => {
      const newFiles = Array.from(event.target.files);
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => setFiles((prev) => [...prev, reader.result]);
        reader.readAsDataURL(file);
      });
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      document.body.removeChild(input);
    });
  }, []);

  const handleGoBack = () => navigate(-1);

  const handleSend = async () => {
    if (!message) return;

    const formData = new FormData();
    const member_ids = [recipient_id, user?.refernce_id];
    formData.append("member_ids", member_ids);
    formData.append("content", message);
    files.forEach((file) => formData.append("files", file));
    if (conversation_id) formData.append("conversation_id", conversation_id);

    const payload = await sendMessage({
      formData,
      conversation_id, // 👈 pass conversation_id
      receiver_id: recipient_id, // 👈 pass receiver_id
    }).unwrap();

    setChatMessages((prev) => [
      ...prev,
      {
        sender_id: user?.id,
        conversation_id,
        images: payload?.vidoes || null,
        videos: payload?.images || null,
        content: payload?.content,
        profilePicture: user?.user_image || "/user-avatar.png",
      },
    ]);

    setMessage("");
    setFile([]);
    setUploadedFiles([]);
  };

  return (
    <Box className="group">
      <ConversationHeader
        groupInfo={currentlyConversingGroup}
        onBack={handleGoBack}
      />

      <MessageList
        chatMessages={chatMessages}
        userDetails={userDetails}
        systemPrefersDark={systemPrefersDark}
        scrollAnchorRef={scrollAnchorRef}
      />

      <FilePreviewList
        files={files}
        setFiles={setFiles}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
      />

      <MessageInput
        message={message}
        setMessage={setMessage}
        handleAddFile={handleAddFile}
        systemPrefersDark={systemPrefersDark}
      />
    </Box>
  );
}

export default GroupConversation;
