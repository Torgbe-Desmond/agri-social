import { Box } from "@mui/material";
import Replies from "../Replies/Replies";

const CommentReplyList = ({
  chatContainerRef,
  commentReplies,
  scrollAnchorRef,
}) => {
  return (
    <Box sx={{ mt: 1, gap: 1, display: "grid" }} ref={chatContainerRef}>
      {commentReplies?.map((reply, index) => (
        <Replies key={index} reply={reply} />
      ))}
      <div ref={scrollAnchorRef} />
    </Box>
  );
};

export default CommentReplyList;
