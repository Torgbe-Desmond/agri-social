import React, { useRef, useState, useEffect, useCallback } from "react";
import "./GroupConversation.css";
import {
  Box,
  IconButton,
  Avatar,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  getdMessages,
  sendMessage,
} from "../../Features/MessageSlice";
import { useSocket } from "../Socket/Socket";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function GroupConversation() {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { conversation_id, recipient_id } = useParams();

  const { userDetails } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.message);
  const { systemPrefersDark } = useOutletContext();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    if (conversation_id) {
      dispatch(getdMessages({ conversation_id }));
    }
  }, [conversation_id, dispatch]);

  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  // Scroll to bottom on messages update
  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Listen for socket chat responses
  useEffect(() => {
    if (!socket || !socket.connected) return;

    const handleChatResponse = (data) => {
      const botMessage = {
        sender_id: "bot",
        image: null,
        profilePicture: require("../../assets/icons8-farmer-64.png"),
        content: data.content,
      };

      setChatMessages((prev) => [...prev, botMessage]);
    };

    socket.on("chat_response", handleChatResponse);

    return () => {
      socket.off("chat_response", handleChatResponse);
    };
  }, [socket]);

  // Cleanup chat messages on unmount
  useEffect(() => {
    return () => {
      setChatMessages([]);
    };
  }, []);

  // Handle file upload via hidden input
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

  const handleSend = () => {
    // Prevent sending if no message and no files
    if (!message.trim() && files.length === 0) return;

    const userMessage = {
      sender_id: userDetails?.id || "active",
      conversation_id,
      image: files,
      profilePicture: userDetails?.user_image || "/user-avatar.png",
      content: message,
    };

    setChatMessages((prev) => [...prev, userMessage]);

    const formData = new FormData();
    const member_ids = [recipient_id, userDetails?.id];
    formData.append("member_ids", member_ids);
    formData.append("content", message);
    formData.append("username", userDetails?.username || "");

    if (conversation_id) {
      formData.append("conversation_id", conversation_id);
    }

    // Append uploaded files to formData
    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });

    dispatch(sendMessage({ formData }));

    // Clear input and previews
    setMessage("");
    setFiles([]);
    setUploadedFiles([]);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box className="group">
      <Box className="group__header">
        <h2>
          <ArrowBackIcon cursor="pointer" onClick={handleGoBack} />
          <Avatar
            src={userDetails?.user_image}
            sx={{
              width: 45,
              height: 45,
              border: "4px solid black",
            }}
          />
        </h2>
        <span>Desmond</span>
      </Box>

      <div style={{ overflowY: "auto" }} className="group__chat-container">
        {chatMessages.map((msg, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection={
              msg.sender_id === userDetails?.id ? "row-reverse" : "row"
            }
            alignItems="flex-start"
            p={1}
            gap={2}
            mb={2}
            className={`group__message ${msg.sender_id}`}
          >
            <Avatar
              src={msg?.profilePicture || msg?.user_image}
              alt={msg?.sender_id}
              sx={{ width: 40, height: 40 }}
            />

            {/* Render images if any */}
            {msg.image &&
              msg.image.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="user-upload"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />
              ))}

            {/* Text message */}
            {msg.content && (
              <Box
                sx={{
                  background: systemPrefersDark ? "#daf4ff" : "#daf4ff",
                  borderRadius: 2,
                  p: 1.5,
                  maxWidth: "70%",
                  color: systemPrefersDark ? "#000" : "inherit",
                }}
                dangerouslySetInnerHTML={{
                  __html: msg.content,
                }}
              />
            )}
          </Box>
        ))}
        <div ref={scrollAnchorRef} />
      </div>

      {/* Image Preview with remove */}
      {files.map((img, idx) => (
        <Box
          key={idx}
          sx={{ display: "inline-block", position: "relative", margin: "8px" }}
        >
          <img
            src={img}
            alt={`preview-${idx}`}
            style={{
              width: 120,
              height: 120,
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
          <IconButton
            size="small"
            onClick={() => {
              setFiles((prev) => prev.filter((_, i) => i !== idx));
              setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
            }}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
            }}
            aria-label="Remove image"
          >
            &times;
          </IconButton>
        </Box>
      ))}

      <Box
        sx={{ bgcolor: systemPrefersDark ? "background.color" : "#FFF" }}
        display="flex"
        position="sticky"
        bottom="0"
        zIndex="100"
        gap={1}
        alignItems="center"
        pt={1}
      >
        <Box
          sx={{
            p: 1,
            bgcolor: systemPrefersDark ? "background.paper" : "inherit",
            width: "100%",
          }}
          display="flex"
          position="sticky"
          bottom="0"
          zIndex="100"
          gap={1}
          alignItems="center"
          borderTop="1px solid #ddd"
        >
          <TextField
            sx={{ bgcolor: systemPrefersDark ? "background.paper" : "inherit" }}
            fullWidth
            placeholder="Write a chat..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            size="small"
            multiline
            minRows={1}
            maxRows={3}
          />

          <IconButton onClick={handleAddFile}>
            <InsertPhotoOutlinedIcon />
          </IconButton>

          <IconButton onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default GroupConversation;
