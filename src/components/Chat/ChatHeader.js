import { Avatar, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import { Socket } from "socket.io-client";

const ChatHeader = ({ userImage, onlineStatus }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{ borderBottom: 1, borderColor: "divider" }}
      className="chat__header"
    >
      <h2>
        <ArrowBackIcon cursor="pointer" onClick={() => navigate(-1)} />
        <Avatar
          src={userImage}
          sx={{
            width: 45,
            height: 45,
          }}
        />
      </h2>
      <span>Desmond</span>
      {/* <CircleIcon sx={{ color: onlineStatus ? "green" : "red" }} /> */}
    </Box>
  );
};

export default ChatHeader;
