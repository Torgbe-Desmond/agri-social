import { Box } from "@mui/material";
import Replies from "../Replies/Replies";
import ErrorInfoAndReload from "../Errors/ErrorInfoAndReload";

const CommentReplyList = ({
  chatContainerRef,
  commentReplies,
  scrollAnchorRef,
  commentsLoading,
  isFetchingReplies,
  refetchReplies,
}) => {
  return (
    <Box sx={{}} ref={chatContainerRef}>
      {commentReplies?.map((reply, index) => (
        <Replies key={index} reply={reply} />
      ))}
      <ErrorInfoAndReload
        isLoading={commentsLoading}
        isFetching={isFetchingReplies}
        refetch={refetchReplies}
      />
      <div ref={scrollAnchorRef} />
    </Box>
  );
};

export default CommentReplyList;
