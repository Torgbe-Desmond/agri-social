// CommentActions.js
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const CommentActions = ({ handleCommentSubmit, isAddingComment }) => {
  return (
    <IconButton
      disabled={isAddingComment}
      onClick={handleCommentSubmit}
      sx={{ color: "primary.main" }}
    >
      <SendIcon />
    </IconButton>
  );
};

export default CommentActions;
