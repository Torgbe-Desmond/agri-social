import React from "react";
import StatusIcons from "../StatusIcons/StatusIcons";

function PostFooter(actions) {
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
