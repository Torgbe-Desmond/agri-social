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

const UserInfo = ({ _userDetails, _userDetailsStatus  }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _user_id } = useParams();

  const { userDetails, isFollowing: following } = useSelector(
    (state) => state.auth
  );
  // const { _userDetails, _userDetailsStatus } = useSelector(
  //   (state) => state.auth
  // );

  // useEffect(() => {
  //   if (_user_id) {
  //     dispatch(_getUser({ user_id: _user_id }));
  //   }
  // }, [dispatch, _user_id]);

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

      <Box sx={{ flex: 1 }}>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 1 }}
        >
          <Button
            onClick={() => navigate(`/chat/${_userDetails?.id}`)}
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

        <Box sx={{ display: "flex", gap: 3, mt: 1, color: "gray" }}>
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
