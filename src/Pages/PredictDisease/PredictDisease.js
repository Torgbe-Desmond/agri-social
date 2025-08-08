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
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { usePredictImageMutation } from "../../Features/predictionApi";
import { useError } from "../../components/Errors/Errors";

function PredictDisease() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const { systemPrefersDark, user } = useOutletContext();
  const { message, setMessage } = useError();
  const fileInputRef = useRef();
  const chatContainerRef = useRef(null);
  const scrollAnchorRef = useRef(null);
  const [predictImage, { isLoading, isError, error: predictionError }] =
    usePredictImageMutation();

  useEffect(() => {
    if (isError && predictionError?.data?.detail) {
      setMessage(predictionError.data.detail);
    }
  }, [isError, predictionError, setMessage]);

  // Auto-scroll to bottom when chat updates
  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Handle file upload and preview
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

  // Send image for prediction
  const handleSend = async () => {
    if (!previewImage || !selectedFile) return;

    const userMessage = {
      sender: "user",
      image: previewImage,
      profilePicture: user?.user_image || "/user-avatar.png",
      text: "",
    };

    setChatMessages((prev) => [...prev, userMessage]);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const result = await predictImage({ formData }).unwrap();
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed:", error);
    }

    // Reset preview
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Display prediction result from API
  useEffect(() => {
    if (prediction) {
      const { prediction_label, confidence } = prediction;
      const responseText = `The uploaded image was predicted as <strong>${prediction_label}</strong> with a confidence of ${(
        confidence * 100
      ).toFixed(2)}%.`;

      const botMessage = {
        sender: "bot",
        image: null,
        profilePicture: require("../../assets/icons8-farmer-64.png"),
        text: responseText,
      };

      setChatMessages((prev) => [...prev, botMessage]);
      setPrediction(null); // Reset after using
    }
  }, [prediction]);

  // Clear chat on unmount
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

      {/* Chat Display */}
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
            <Avatar
              src={msg.profilePicture}
              alt={msg.sender}
              sx={{ width: 40, height: 40 }}
            />
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

      {/* Bottom Input Area */}
      <Box
        sx={{
          p: 1,
          borderTop: 1,
          borderColor: "divider",
        }}
        display="flex"
        position="sticky"
        bottom="0"
        zIndex="100"
        gap={1}
        alignItems="center"
        pt={1}
      >
        {previewImage && (
          <Box sx={{ position: "relative", display: "inline-block" }}>
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
            {isLoading ? (
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
