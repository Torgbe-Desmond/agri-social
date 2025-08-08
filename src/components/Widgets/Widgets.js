import "./Widgets.css";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useGetSuggestedUsersToFollowQuery } from "../../Features/userApi";
import { removeNewlyFollowed, updateUserList } from "../../Features/AuthSlice";
import { useNavigate } from "react-router-dom";
import ErrorInfoAndReload from "../Errors/ErrorInfoAndReload";
import { useFollowMutation } from "../../Features/messageApi";

const Widgets = () => {
  const dispatch = useDispatch();
  const { users: userData } = useSelector((state) => state.auth);
  const reference_id = localStorage.getItem("reference_id");
  const navigate = useNavigate();
  const [follow, { isLoading: isFollowingLoading }] = useFollowMutation();

  const [offset, setOffset] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetSuggestedUsersToFollowQuery({ offset, limit });

  const users = useMemo(() => {
    return Array.isArray(data?.followers) ? data.followers : [];
  }, [data]);

  console.log(users);

  const handleNavigateToProfile = (item) => {
    if (item?.user_id) {
      navigate(`/${reference_id}/user/${item?.user_id}`);
    }
  };

  const handleFollow = async (id) => {
    console.log("inside follow", id);
    const formData = new FormData();
    formData.append("user_id", id);
    const payload = await follow({ formData }).unwrap();
    if (payload.follow) {
      dispatch(removeNewlyFollowed(id));
    }
  };

  // Add new users to Redux store
  useEffect(() => {
    if (users?.length > 0) {
      dispatch(updateUserList({ users }));
    }
  }, [users, dispatch]);

  const observer = useRef();
  const lastUserRef = useCallback(
    (node) => {
      if (isFetching) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && data?.numb_found > userData.length) {
          setOffset((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetching, data?.numb_found, userData.length]
  );

  return (
    <Box className="widgets">
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 2,
          overflowY: "auto",
        }}
      >
        <h2>People</h2>

        <List dense>
          {userData.map((user, index) => {
            const isLast = index === userData.length - 1;
            return (
              <ListItem
                key={user.id || index}
                ref={isLast ? lastUserRef : null}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#e8fef1",
                    color: "#088a6a",
                    cursor: "pointer",
                    borderRadius: 40,
                  },
                }}
              >
                <Box
                  component="img"
                  src={
                    user?.image || user?.user_image || "/default-profile.png"
                  }
                  alt={user?.username}
                  sx={{
                    width: 35,
                    height: 35,
                    borderRadius: "50%",
                    objectFit: "cover",
                    mr: 2,
                  }}
                />
                <ListItemText
                  primary={user?.username}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                />
                <Button
                  sx={{ borderRadius: "20px" }}
                  onClick={() => handleFollow(user?.id)}
                  variant="outlined"
                  size="small"
                >
                  Follow
                </Button>
              </ListItem>
            );
          })}
        </List>

        <ErrorInfoAndReload
          isLoading={isLoading}
          isFetching={isFetching}
          refetch={refetch}
        />

        {/* {isFetching && userData.length > 0 && (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <CircularProgress size={20} />
          </Box>
        )}

        {isError && (
          <Box sx={{ p: 2, textAlign: "center", color: "red" }}>
            Failed to load suggestions.
          </Box>
        )} */}
      </Box>
    </Box>
  );
};

export default Widgets;
