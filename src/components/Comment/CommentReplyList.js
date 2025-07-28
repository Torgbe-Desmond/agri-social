import { Box } from "@mui/material";
import Replies from "../Replies/Replies";

const CommentReplyList = ({
  chatContainerRef,
  commentReplies,
  scrollAnchorRef,
}) => {
  return (
    <Box sx={{ gap: 1 }} ref={chatContainerRef}>
      {commentReplies?.map((reply, index) => (
        <Replies key={index} reply={reply} />
      ))}
      <div ref={scrollAnchorRef} />
    </Box>
  );
};
  
export default CommentReplyList;
