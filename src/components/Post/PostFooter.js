import React, { useEffect } from "react";
import StatusIcons from "../StatusIcons/StatusIcons";
import { useSocket } from "../Socket/Socket";
import { useDispatch, useSelector } from "react-redux";
import { updatePostLike } from "../../Features/PostSlice";

function PostFooter(actions) {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (!socket || userDetails?.id) return;
  //   const handleLikeNotification = (data) => {
  //     if (data.type === "like" && data.entity_type === "post") {
  //       dispatch(
  //         updatePostLike({
  //           post_id: data.entity_id,
  //           liked: data.liked,
  //         })
  //       );
  //     }
  //   };

  //   socket.on("foot__notifications", handleLikeNotification);

  //   return () => socket.off("foot__notifications", handleLikeNotification);
  // }, []);

  return (
    <div>
      <div className="post__footer">
        {actions.map((action) => {
          <StatusIcons
            location={action.loaction}
            to={action?.to}
            icon={action.icon}
            count={action?.comments}
            action={action.action}
          />;
        })}
      </div>
    </div>
  );
}

export default PostFooter;
