import React, { useRef, useState, useEffect } from "react";
import "./PredictDisease.css";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import { useDispatch, useSelector } from "react-redux";
import { predictImage } from "../../Features/PredictionSlice";
import { useOutletContext } from "react-router-dom";
import { setScrolling } from "../../Features/StackSlice";

function PredictDisease() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const { predictionStatus, prediction } = useSelector(
    (state) => state.prediction
  );
  const { userDetails } = useSelector((state) => state.auth);
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const { darkMode, systemPrefersDark } = useOutletContext();

  const chatContainerRef = useRef(null);
  const scrollAnchorRef = useRef(null);

  // Scroll to bottom when chatMessages change
  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  const handleSend = () => {
    if (!previewImage || !selectedFile) return;

    const userMessage = {
      sender: "user",
      image: previewImage,
      profilePicture: userDetails?.user_image || "/user-avatar.png",
      text: "",
    };

    setChatMessages((prev) => [...prev, userMessage]);

    const formData = new FormData();
    formData.append("user_id", userDetails?.id);
    formData.append("file", selectedFile);
    dispatch(predictImage({ formData }));

    // Clear preview
    setPreviewImage(null);
    setSelectedFile(null);
  };

  useEffect(() => {
    if (predictionStatus === "succeeded" && prediction) {
      const { filename, prediction_label, confidence } = prediction;
      const responseText = `The uploaded image was predicted as <strong>${prediction_label}</strong> with a confidence of ${(
        confidence * 100
      ).toFixed(2)}%.`;

      const botMessage = {
        sender: "bot",
        image: null, // Bot sends only text, no image
        profilePicture: require("../../assets/icons8-farmer-64.png"),
        text: responseText,
      };

      setChatMessages((prev) => [...prev, botMessage]);
    }
  }, [predictionStatus, prediction]);

  useEffect(() => {
    return () => setChatMessages([]);
  }, []);

  return (
    <Box className="predict">
      <Box
        sx={{ bgcolor: systemPrefersDark ? "background.paper" : "#FFF" }}
        className="predict__header"
      >
        <h2>Predict Disease</h2>
        <div className="message">
          Chat will be saved and can be viewed in predictions
        </div>
      </Box>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        style={{ overflowY: "auto" }}
        className="predict__chat-container"
      >
        {chatMessages.map((msg, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection={msg.sender === "user" ? "row-reverse" : "row"}
            alignItems="flex-start"
            p={1}
            gap={2}
            mb={2}
            className={`chat__message ${msg.sender}`}
          >
            {/* Avatar */}
            <Avatar
              src={msg.profilePicture}
              alt={msg.sender}
              sx={{ width: 40, height: 40 }}
            />

            {/* User: show image only */}
            {msg.sender === "user" && msg.image && (
              <img
                src={msg.image}
                alt="user-upload"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
            )}

            {/* Bot: show text only */}
            {msg.sender === "bot" && (
              <Box
                sx={{
                  background: systemPrefersDark ? "#eaf4ff" : "#fff",
                  borderRadius: 2,
                  p: 1.5,
                  maxWidth: "70%",
                  color: systemPrefersDark && "#000",
                }}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            )}
          </Box>
        ))}
        <div ref={scrollAnchorRef} />
      </div>

      {/* Input Section */}
      {/* Input Section */}
      <Box
        sx={{ p: 1, bgcolor: systemPrefersDark && "background.color",borderTop: 1, borderColor: "divider" }}
        display="flex"
        position="sticky"
        bottom="0"
        zIndex="100"
        gap={1}
        alignItems="center"
        pt={1}
        bgcolor="#FFF"
      >
        {/* Image Preview and Remove Button */}
        {previewImage && (
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <img
              src={previewImage}
              alt="preview"
              style={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <IconButton
              size="small"
              onClick={() => {
                setPreviewImage(null);
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              sx={{
                position: "absolute",
                top: 18,
                right: 18,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
              aria-label="Remove image"
            >
              &times;
            </IconButton>
          </Box>
        )}

        {/* Upload Button */}
        <Tooltip title="Add Image">
          <label htmlFor="image-upload" style={{ cursor: "pointer" }}>
            {predictionStatus === "loading" ? (
              <CircularProgress size={24} />
            ) : (
              <InsertPhotoOutlinedIcon />
            )}
          </label>
        </Tooltip>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleMediaUpload}
          ref={fileInputRef}
        />

        {/* Send Button */}
        <IconButton onClick={handleSend} disabled={!previewImage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default PredictDisease;
