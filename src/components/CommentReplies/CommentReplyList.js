import Replies from "../Replies/Replies";

const CommentReplyList = ({
  chatContainerRef,
  commentReplies,
  scrollAnchorRef,
}) => {
  return (
    <div ref={chatContainerRef}>
      {commentReplies?.map((reply, index) => (
        <Replies key={index} reply={reply}/>
      ))}
      <div ref={scrollAnchorRef} />
    </div>
  );
};

export default CommentReplyList;
