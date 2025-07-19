import React from "react";
import PostStatusIcons from "../PostStatusIcons/PostStatusIcons";

function FooterPost({ actions, post_id }) {
  return (
    <div className="post__footer">
      {actions.map((action, index) => (
        <PostStatusIcons
          key={index}
          location={action.location}
          to={action?.to}
          icon={action.icon}
          count={action?.count}
          action={action.action}
          post_id={post_id}
          status={action.status}
        />
      ))}
    </div>
  );
}

export default FooterPost;
