import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useOutletContext } from "react-router-dom";
import {
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
  const { conversation_id, getConversationStatus, messages } = useSelector(
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
  const { recipient_id } = useParams();

  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  console.log("conversation_id",conversation_id)

  // useEffect(() => {
  //   if (recipient_id && userDetails?.id) {
  //     const member_ids = [recipient_id, userDetails?.id];
  //     console.log("member_ids", member_ids);
  //     const formData = new FormData();
  //     member_ids.forEach((id) => formData.append("member_ids", id));
  //     dispatch(getConversation({ formData }));
  //   }
  // }, [recipient_id, userDetails?.id]);

  useEffect(() => {
    if (conversation_id) {
      dispatch(getdMessages({ conversation_id }));
    }
  }, [getConversationStatus]);

  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!files || !message) return;

    const formData = new FormData();
    const member_ids = [recipient_id, userDetails?.id];
    formData.append("member_ids", member_ids);
    formData.append("sender_id", userDetails?.id);
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
      <ChatHeader userImage={userDetails?.user_image} />
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
