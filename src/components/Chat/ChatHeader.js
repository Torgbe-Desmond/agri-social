import { Avatar, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ userImage }) => {
  const navigate = useNavigate();
  return (
    <Box className="chat__header">
      <h2>
        <ArrowBackIcon cursor="pointer" onClick={() => navigate(-1)} />
        <Avatar
          src={userImage}
          sx={{
            width: 45,
            height: 45,
            borderBottom: 1,
            borderColor: "divider",
          }}
        />
      </h2>
      <span>Desmond</span>
    </Box>
  );
};

export default ChatHeader;
