import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useOutletContext } from "react-router-dom";
import {
  clearMessages,
  getConversation,
  sendMessage,
} from "../../Features/MessageSlice";
import { useSocket } from "../Socket/Socket";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import ImagePreview from "./ImagePreview";
import "./Chat.css";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "../../Features/messageApi";

function Chat() {
  const { user } = useOutletContext();
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const scrollAnchorRef = useRef(null);
  const socket = useSocket();
  const dispatch = useDispatch();
  const { darkMode, systemPrefersDark } = useOutletContext();
  const { conversation_id, recipient_id } = useParams();
  const [sendMessage, { error: sendMessageError, isLoading:sendMessageLoading }] = useSendMessageMutation();
  const { currentlyConversingUser } = useSelector((state) => state.message);
  const [media, setMedia] = useState([]);
  const [v_media, setVMedia] = useState([]);
  const [file, setFile] = useState([]);
  const [mediaType, setMediaType] = useState(null);

  useEffect(() => {
    return () => dispatch(clearMessages());
  }, []);

  const { data, isFetching, isSuccess, isLoading, error } =
    useGetMessagesQuery(conversation_id);

  const messages = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleMediaUpload = (event, type) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "image") {
          setMedia((prev) => [...prev, reader.result]);
        } else {
          setVMedia((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(selectedFiles[0]);
      setFile((prev) => [...prev, selectedFiles[0]]);
      setMediaType(type);
    }
  };

  const handleSend = async () => {
    if (!message) return;

    const formData = new FormData();
    const member_ids = [recipient_id, user?.refernce_id];
    formData.append("member_ids", member_ids);
    formData.append("content", message);
    file.forEach((file) => formData.append("files", file));
    if (conversation_id) formData.append("conversation_id", conversation_id);

    const payload = await sendMessage({ formData }).unwrap();

    setChatMessages((prev) => [
      ...prev,
      {
        sender_id: payload?.id,
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

  useEffect(() => {
    if (!socket) return;
    socket.on("chat_response", (data) => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender_id: data?.sender_id,
          conversation_id: data?.conversation_id,
          content: data?.content,
          image_urls: data?.image_urls,
          video_urls: data?.video_urls,
          profilePicture: data?.user_image,
        },
      ]);
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
      <ChatHeader
        userImage={currentlyConversingUser?.user_image}
        userId={currentlyConversingUser?.user_id}
        name={currentlyConversingUser?.username}
        onlineStatus={socket}
      />
      <ChatMessageList
        messages={chatMessages}
        userDetails={user}
        systemPrefersDark={systemPrefersDark}
        scrollRef={scrollAnchorRef}
      />
      {/* <ImagePreview
        files={file}
      /> */}
      <ChatInput
        setFile={setFile}
        media={media}
        file={file}
        sendMessageLoading={sendMessageLoading}
        v_media={v_media}
        handleMediaUpload={handleMediaUpload}
        setVMedia={setVMedia}
        mediaType={mediaType}
        setMedia={setMedia}
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
