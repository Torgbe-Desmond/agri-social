import React, { useRef, useState, useEffect, useCallback } from "react";
import "./GroupConversation.css";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Avatar,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import { useDispatch, useSelector } from "react-redux";
import { predictImage } from "../../Features/PredictionSlice";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
    clearGroups,
  getConversation,
  getdMessages,
  sendMessage,
} from "../../Features/MessageSlice";
import { useSocket } from "../Socket/Socket";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function GroupConversation() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const { predictionStatus, prediction } = useSelector(
    (state) => state.prediction
  );
  const { conversation_id } = useParams();
  const { userDetails } = useSelector((state) => state.auth);
  const { getConversationStatus, messages } = useSelector(
    (state) => state.message
  );
  const navigate = useNavigate();
  const socket = useSocket();

  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const { darkMode, systemPrefersDark } = useOutletContext();
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const { recipient_id } = useParams();

  const chatContainerRef = useRef(null);
  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    if (conversation_id) {
      dispatch(getdMessages({ conversation_id }));
    }
  }, [conversation_id]);

  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  // Scroll to bottom when chatMessages change
  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!files || !message) return;

    const userMessage = {
      sender_id: userDetails?.id,
      conversation_id: conversation_id & conversation_id,
      image: files,
      profilePicture: userDetails?.user_image || "/user-avatar.png",
      content: message,
    };

    setChatMessages((prev) => [...prev, userMessage]);

    const formData = new FormData();
    const member_ids = [recipient_id, userDetails?.id];
    formData.append("member_ids", member_ids);
    formData.append("sender_id", userDetails?.id);
    formData.append("content", message);

    if (conversation_id) {
      formData.append("conversation_id", conversation_id);
    }
    // formData.append("conversation")
    dispatch(sendMessage({ formData }));

    // Clear preview
    setPreviewImage(null);
    setSelectedFile(null);
    setMessage("");
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

      setUploadedFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...newFiles];
        return updatedFiles;
      });

      document.body.removeChild(inputElement);
    });
  }, [uploadedFiles]);

  useEffect(() => {
    if (!socket || !socket.connected) return;

    const handleChatResponse = (data) => {
      const botMessage = {
        sender: "receiver",
        image: null,
        profilePicture: require("../../assets/icons8-farmer-64.png"),
        content: data.content,
      };

      setChatMessages((prev) => [...prev, botMessage]);
    };

    socket.on("chat_response", handleChatResponse);

    return () => {
      socket.off("chat_response", handleChatResponse); // Clean up listener
    };
  }, [socket]);

  useEffect(() => {
    return () => {
      setChatMessages([]);
    };
  }, []);

  // const handleMediaUpload = (e, type) => {
  //   const f = e.target.files[0];
  //   if (f) {
  //     const reader = new FileReader();
  //     reader.onload = () => setMedia(reader.result);
  //     reader.readAsDataURL(f);
  //     setFile(f);
  //     setMediaType(type);
  //   }
  // };

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

      {/* Chat Area */}
      <div
        // ref={chatContainerRef}
        style={{ overflowY: "auto" }}
        className="group__chat-container"
      >
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
            {/* Avatar */}
            <Avatar
              src={msg?.user_image}
              alt={msg?.sender_id}
              sx={{ width: 40, height: 40 }}
            />

            {/* User: show image only */}
            {msg.sender_id === userDetails?.id &&
              msg.image &&
              msg.image.map((img) => {
                <img
                  src={img}
                  alt="user-upload"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    objectFit: "cover",
                  }}
                />;
              })}
            {/* User: show image only */}

            {msg.sender_id === userDetails?.id && msg.content && (
              <Box
                sx={{
                  background: systemPrefersDark ? "#daf4ff" : "#daf4ff",
                  borderRadius: 2,
                  p: 1.5,
                  maxWidth: "70%",
                  color: systemPrefersDark && "#000",
                }}
              >
                {msg?.content}
              </Box>
            )}

            {/* Bot: show text only */}
            {msg.sender_id !== userDetails?.id && (
              <Box
                sx={{
                  background: systemPrefersDark ? "#e8fef1" : "#e8fef1",
                  borderRadius: 2,
                  p: 1.5,
                  maxWidth: "70%",
                  color: systemPrefersDark && "#000",
                }}
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
            )}
          </Box>
        ))}
        <div ref={scrollAnchorRef} />
      </div>

      {/* Image Preview and Remove Button */}
      {files?.map((img, idx) => (
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

      {/* Input Section */}
      <Box
        sx={{ bgcolor: systemPrefersDark && "background.color" }}
        display="flex"
        position="sticky"
        bottom="0"
        zIndex="100"
        gap={1}
        alignItems="center"
        pt={1}
        bgcolor="#FFF"
      >
        <Box
          sx={{
            p: 1,
            bgcolor: systemPrefersDark && "background.paper",
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
            sx={{ bgcolor: systemPrefersDark && "background.paper" }}
            fullWidth
            placeholder="Write a chat..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            size="small"
            multiline
            minRows={1}
            maxRows={3}
            InputProps={
              {
                // endAdornment: (
                //   <IconButton onClick={openEmojiPicker}>
                //     <InsertEmoticonIcon />
                //   </IconButton>
                // ),
                // startAdornment: (
                //   <IconButton ref={fileInputRef} onClick={handleAddFile}>
                //     <InsertPhotoOutlinedIcon />
                //   </IconButton>
                // ),
              }
            }
          />

          <IconButton onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default GroupConversation;

// "Server error: 1 validation error for MessageOut
// username
//   Field required [type=missing, input_value={'id': UUID('d9af8dba-e7f...=datetime.timezone.utc)}, input_type=dict]
//     For further information visit https://errors.pydantic.dev/2.11/v/missing"
