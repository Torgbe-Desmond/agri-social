import Replies from "../Replies/Replies";

const CommentReplyList = ({
  chatContainerRef,
  commentReplies,
  scrollAnchorRef,
  user_id,
}) => {
  return (
    <div ref={chatContainerRef}>
      {commentReplies?.map((reply, index) => (
        <Replies key={index} reply={reply} user_id={user_id} />
      ))}
      <div ref={scrollAnchorRef} />
    </div>
  );
};

export default CommentReplyList;
