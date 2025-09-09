import React, { useEffect, useState } from "react";
import PostStatusIcons from "../PostStatusIcons/PostStatusIcons";
import { Box } from "@mui/material";
import { useSocket } from "../Socket/Socket";
import { useSelector } from "react-redux";

function FooterPost({
  actions,
  post_id,
  isLoadingSaved,
  isLoadingLiked,
  flipped,
}) {
  const [updatedActions, setUpdatedActions] = useState([]);
  const { userDetails } = useSelector((state) => state.auth);
  const socket = useSocket();

  useEffect(() => {
    setUpdatedActions(actions);
  }, [actions]);

  useEffect(() => {
    if (!socket) return;

    const handleFootNotification = (data) => {
      if (post_id === data?.entity_id && userDetails?.id !== data?.user_id) {
        setUpdatedActions((prevActions) =>
          prevActions?.map((a) => {
            if (data.type === "like") {
              const currentLikes = Number(a.count ?? 0);
              const liked = data?.liked;
              return {
                ...a,
                count: liked ? currentLikes + 1 : Math.max(currentLikes - 1, 0),
                liked,
                status: !isLoadingSaved,
              };
            } else if (data.type === "bookmark") {
              const currentSaves = Number(a.count ?? 0);
              const saved = data?.saved;
              return {
                ...a,
                count: saved ? currentSaves + 1 : Math.max(currentSaves - 1, 0),
                saved,
                status: !isLoadingLiked,
              };
            }
            return a;
          })
        );
      }
    };

    socket.on("foot_notifications", handleFootNotification);
    return () => {
      socket.off("foot_notifications", handleFootNotification);
    };
  }, [socket, post_id, userDetails?.id]);

  return (
    <Box className={`post__footer ${flipped ? "is-flipped" : ""}`}>
      {updatedActions.map((action, index) => (
        <PostStatusIcons
          id={action?.id}
          key={index}
          location={action?.location}
          to={action?.to}
          icon={action.icon}
          count={action?.count}
          action={action?.action}
          status={action?.status}
          post_id={post_id}
          isLoadingSaved={isLoadingSaved}
          isLoadingLiked={isLoadingLiked}
        />
      ))}
    </Box>
  );
}

export default FooterPost;
