import { Box, Avatar, Fab } from "@mui/material";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ChatMessageList = ({
  messages,
  userDetails,
  systemPrefersDark,
  scrollRef,
}) => {
  const chatRef = useRef(null);
  const lastScrollTop = useRef(0);
  const [scrolling, setScroll] = useState(false);

  // Detect scroll direction
  useEffect(() => {
    const node = chatRef.current;
    if (!node) return;

    const handleScroll = () => {
      const scrollTop = node.scrollTop;
      setScroll(scrollTop < lastScrollTop.current); // true if user scrolled up
      lastScrollTop.current = scrollTop;
    };

    node.addEventListener("scroll", handleScroll);
    return () => node.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Scroll to bottom on new messages (only if not scrolling up)
  useEffect(() => {
    if (!scrolling) {
      scrollToBottom();
    }
  }, [messages]);

  console.log(scrolling);

  return (
    <Box
      ref={chatRef}
      className="chat__chat-container"
      sx={{
        overflowY: "auto",
        height: "100%",
        position: "relative",
        paddingBottom: "60px", // to avoid overlap with the FAB
      }}
    >
      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          msg={msg}
          isUser={msg.sender_id === userDetails?.id}
          systemPrefersDark={systemPrefersDark}
          userDetails={userDetails}
        />
      ))}

      {/* {scrolling && (
        <Fab
          size="small"
          color="primary"
          onClick={scrollToBottom}
          sx={{
            position: "absolute",
            bottom: 0,
            right: 16,
            // zIndex: 1200,
          }}
          aria-label="Scroll to bottom"
        >
          <KeyboardArrowDownIcon />
        </Fab>
      )} */}
      <div ref={scrollRef} />
    </Box>
  );
};

export default ChatMessageList;
