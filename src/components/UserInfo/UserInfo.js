import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch, useSelector } from "react-redux";
import { follow, isFollowing } from "../../Features/AuthSlice";
import { useNavigate } from "react-router-dom";

const UserInfo = ({ _userDetails, _userDetailsStatus }) => {
  const { userDetails, isFollowing: following } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      isFollowing({ user_id: _userDetails?.id, localUser: userDetails?.id })
    );
  }, []);

  if (_userDetailsStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  const handleFollow = () => {
    dispatch(follow({ user_id: _userDetails?.id, localUser: userDetails?.id }));
  };
  // background: ;
  // backdrop-filter: blur(10px);
  // -webkit-backdrop-filter: blur(10px);
  return (
    <Box
      sx={{
        background: "inherit",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        // background: "rgba(255, 255, 255, 0.2)",
        // backdropFilter: "blur(10px)",
      }}
    >
      <Box sx={{ position: "relative", px: 2, pb: 2 }}>
        <Avatar
          src={_userDetails?.user_image}
          sx={{
            width: 100,
            height: 100,
            border: "4px solid black",
            top: 20,
          }}
        />
      </Box>

      <Box sx={{ px: 2, pt: 6 }}>
        <Box sx={{ float: "right", display: "flex", gap: 3, mt: 1 }}>
          <Button
            onClick={() => navigate(`/chat/${_userDetails.id}`)}
            variant="outlined"
            sx={{
              float: "right",
              borderRadius: 5,
            }}
          >
            Chat
          </Button>

          {userDetails?.id !== _userDetails?.id && (
            <Button
              onClick={handleFollow}
              variant="outlined"
              sx={{
                borderRadius: 5,
              }}
            >
              {following ? "Following" : "Follow"}
            </Button>
          )}
        </Box>

        <Typography variant="h6" fontWeight="bold">
          {_userDetails?.username}
        </Typography>
        <Typography color="gray">@{_userDetails?.username}</Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 1,
            color: "gray",
          }}
        >
          {_userDetails?.city && (
            <>
              <LocationOnIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">{_userDetails?.city}</Typography>
            </>
          )}{" "}
          <CalendarTodayIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2">
            Joined{" "}
            {new Date(_userDetails?.created_at).toLocaleString("default", {
              month: "long",
            })}{" "}
            {new Date(_userDetails?.created_at).getFullYear()}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
          <Typography variant="body2">
            <strong>{_userDetails?.following}</strong> Following
          </Typography>
          <Typography variant="body2">
            <strong>{_userDetails?.followers}</strong> Followers
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UserInfo;
