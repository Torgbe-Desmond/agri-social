import { Avatar, Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import { Socket } from "socket.io-client";
import { useGetAnotherUserProfileQuery } from "../../Features/userApi";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ChatHeader = ({
  userImage,
  onlineStatus,
  name,
  userId,
  handleGotBack,
}) => {
  const navigate = useNavigate();
  const reference_id = localStorage.getItem("reference_id");
  localStorage.setItem("recipient_id", userId);
  const { recipient_id } = useParams();

  const {
    data: userDetails,
    isLoading: isUserLoading,
    error: userDetailsError,
    isError,
  } = useGetAnotherUserProfileQuery(
    userId || localStorage.getItem("reference_id")
  );

  const handleGoToUserProfile = () => {
    navigate(`/${reference_id}/user/${userDetails?.id}`);
  };

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: "divider" }}
      className="chat__header"
    >
      <ArrowBackIcon cursor="pointer" onClick={() => handleGotBack()} />

      <h2>
        {!isUserLoading ? (
          <Avatar
            src={userDetails?.user_image}
            sx={{
              width: 45,
              height: 45,
            }}
          />
        ) : (
          <AccountCircleIcon
            sx={{
              width: 45,
              height: 45,
            }}
          />
        )}
      </h2>
      <Button
        disabled={isUserLoading || isError}
        onClick={() => handleGoToUserProfile()}
      >
        {userDetails?.username}
      </Button>
    </Box>
  );
};

export default ChatHeader;
