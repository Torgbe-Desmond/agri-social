import React, { useEffect } from "react";
import PostStatusIcons from "../PostStatusIcons/PostStatusIcons";
import { Box } from "@mui/material";
import { useSocket } from "../Socket/Socket";
import { useDispatch, useSelector } from "react-redux";
import { updatePostLike } from "../../Features/PostSlice";

function FooterPost({ actions }) {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);


  return (
    <Box className="post__footer">
      {actions.map((action, index) => (
        <PostStatusIcons
          id={action.id}
          key={index}
          location={action.location}
          to={action?.to}
          icon={action.icon}
          count={action?.count}
          action={action.action}
          status={action.status}
        />
      ))}
    </Box>
  );
}

export default FooterPost;
