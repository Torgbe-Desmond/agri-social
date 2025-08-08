import { Avatar, Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import { Socket } from "socket.io-client";

const ChatHeader = ({ userImage, onlineStatus, name, userId }) => {
  const navigate = useNavigate();
  const reference_id = localStorage.getItem("reference_id");

  console.log("userId", userId);

  const handleGoToUserProfile = () => {
    navigate(`/${reference_id}/user/${userId}`);
  };
  return (
    <Box
      sx={{ borderBottom: 1, borderColor: "divider" }}
      className="chat__header"
    >
      <ArrowBackIcon cursor="pointer" onClick={() => navigate(-1)} />

      <h2>
        <Avatar
          src={userImage}
          sx={{
            width: 45,
            height: 45,
          }}
        />
      </h2>
      <Button onClick={() => handleGoToUserProfile()}>{name}</Button>
    </Box>
  );
};

export default ChatHeader;
