import React from "react";
import StatusIcons from "../StatusIcons/StatusIcons";

function FooterPost({ actions }) {
  return (
    <div className="post__footer">
      {actions.map((action, index) => (
        <StatusIcons
          key={index}
          location={action.location}
          to={action?.to}
          icon={action.icon}
          count={action?.count}
          action={action.action}
        />
      ))}
    </div>
  );
}

export default FooterPost;
