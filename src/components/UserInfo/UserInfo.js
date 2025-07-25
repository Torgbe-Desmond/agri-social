import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useDispatch, useSelector } from "react-redux";
import { _getUser, follow, isFollowing } from "../../Features/AuthSlice";
import { useNavigate, useParams } from "react-router-dom";
import ComponentStack from "../HandleStack/HandleStack";

const UserInfo = ({ _userDetails, _userDetailsStatus, _conversation_id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _user_id } = useParams();
  const reference_id = localStorage.getItem("reference_id");
  const { userDetails, isFollowing: following } = useSelector(
    (state) => state.auth
  );
  // const { _userDetails, _userDetailsStatus } = useSelector(
  //   (state) => state.auth
  // );

  console.log("_conversation_id",_conversation_id)

  // useEffect(() => {
  //   if (_user_id) {
  //     dispatch(_getUser({ user_id: _user_id }));
  //   }
  // }, [dispatch, _user_id]);

  const handleCreateConversation = () => {
    if (_conversation_id) {
      navigate(
        `/${reference_id}/chat/${_conversation_id}/c/${_userDetails?.reference_id}`
      );
    } else {
      const stack = new ComponentStack(dispatch);
      stack.handleStack("CreateConversation", {
        conversee: _userDetails,
      });
    }
  };

  useEffect(() => {
    if (_userDetails?.id && userDetails?.id) {
      dispatch(
        isFollowing({ user_id: _userDetails.id, localUser: userDetails.id })
      );
    }
  }, [dispatch, _userDetails?.id, userDetails?.id]);

  const handleFollow = () => {
    if (_userDetails?.id && userDetails?.id) {
      dispatch(follow({ user_id: _userDetails.id, localUser: userDetails.id }));
    }
  };

  const joinedDate = new Date(_userDetails?.created_at);

  if (_userDetailsStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  return (
    <Box
      sx={{
        background: "inherit",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        gap: 2,
        padding: 2,
      }}
    >
      {_userDetails?.user_image && (
        <Avatar
          src={_userDetails.user_image}
          sx={{
            width: 100,
            height: 100,
            border: "4px solid black",
          }}
        />
      )}

      <Box sx={{ flex: 1, display: "flex" }}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {_userDetails?.username}
          </Typography>
          <Typography color="gray">@{_userDetails?.username}</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mt: 1,
              color: "gray",
            }}
          >
            {_userDetails?.city && (
              <>
                <LocationOnIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">{_userDetails?.city}</Typography>
              </>
            )}
            <CalendarTodayIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2">
              Joined {joinedDate.toLocaleString("default", { month: "long" })}{" "}
              {joinedDate.getFullYear()}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 3, ml: 0.5, mt: 1, color: "gray" }}>
            <Typography variant="body2">
              <strong>{_userDetails?.following}</strong> Following
            </Typography>
            <Typography variant="body2">
              <strong>{_userDetails?.followers}</strong> Followers
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 2,
            mb: 1,
          }}
        >
          <Button
            onClick={() => handleCreateConversation()}
            variant="outlined"
            sx={{ borderRadius: 5 }}
          >
            Chat
          </Button>

          {userDetails?.id !== _userDetails?.id && (
            <Button
              onClick={handleFollow}
              variant="outlined"
              sx={{ borderRadius: 5 }}
            >
              {following ? "Following" : "Follow"}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserInfo;
