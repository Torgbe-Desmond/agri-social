import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useDispatch } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import ComponentStack from "../HandleStack/HandleStack";
import {
  useFollowingQuery,
  useFollowMutation,
} from "../../Features/messageApi";
import { setCurrentlyConversingUserInformation } from "../../Features/MessageSlice";

const UserInfo = ({ _userDetails, _userDetailsStatus, _conversation_id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _user_id } = useParams();
  const reference_id = localStorage.getItem("reference_id");
  const { user } = useOutletContext();

  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [follow, { isLoading: isFollowingLoading }] = useFollowMutation();
  const { data: followData } = useFollowingQuery({ user_id: _userDetails?.id });

  console.log("_userDetails", _userDetails);

  useEffect(() => {
    if (followData?.isFollowing !== undefined) {
      setIsFollowingUser(followData.isFollowing);
    }
  }, [followData]);

  const handleCreateConversation = () => {
    dispatch(setCurrentlyConversingUserInformation(_userDetails));
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

  const handleFollow = async () => {
    if (
      !_userDetails?.id ||
      user?.id === _userDetails?.id ||
      isFollowingLoading
    )
      return;

    try {
      const formData = new FormData();
      formData.append("user_id", _userDetails.id);
      const result = await follow({ formData }).unwrap();
      setIsFollowingUser(result.follow);
    } catch (err) {
      console.error("Failed to follow user:", err);
    }
  };

  if (_userDetailsStatus === "loading" || !_userDetails) {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  const joinedDate = new Date(_userDetails.created_at);

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

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
              <Typography variant="body2">{_userDetails.city}</Typography>
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
            <strong>{_userDetails.following ?? 0}</strong> Following
          </Typography>
          <Typography variant="body2">
            <strong>{_userDetails.followers ?? 0}</strong> Followers
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 2,
          }}
        >
          {user?.id !== _userDetails?.id && (
            <Button
              onClick={handleCreateConversation}
              variant="outlined"
              sx={{ borderRadius: 5 }}
            >
              Chat
            </Button>
          )}

          {user?.id !== _userDetails?.id && (
            <Button
              onClick={handleFollow}
              variant="outlined"
              sx={{ borderRadius: 5 }}
              disabled={isFollowingLoading}
            >
              {isFollowingUser ? "Following" : "Follow"}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserInfo;
