import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import {
  IconButton,
  TextField,
  useMediaQuery,
  Stack,
  CircularProgress,
} from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";

import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Replies from "../Replies/Replies";
import { popComponent } from "../../Features/StackSlice";
import { useDispatch } from "react-redux";
import {
  useGetCommentsQuery,
  useAddCommentMutation,
} from "../../Features/commentApi";

import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const drawerBleeding = 56;
const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor: grey[100],
  ...theme.applyStyles("dark", {
    backgroundColor: (theme.vars || theme).palette.background.default,
  }),
}));
const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[800],
  }),
}));

function SwipeableEdgeDrawer({ window, post_id }) {
  const dispatch = useDispatch();
  const [open] = useState(true);
  const container = window ? () => window().document.body : undefined;
  const { user } = useOutletContext();
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const [commentText, setCommentText] = useState("");
  const [addLocalComment, setAddLocalComment] = useState([]);

  // RTK Query hooks
  const { data: commentResponse, isLoading: loadingComments } =
    useGetCommentsQuery({ post_id });

  const [addComment, { isLoading: addingComment }] = useAddCommentMutation();

  // Combine server replies with local optimistic replies
  const togetherComments = [
    ...(Array.isArray(commentResponse?.comments)
      ? commentResponse.comments
      : []),
    ...addLocalComment,
  ];

  const scrollAnchorRef = useRef(null);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const messageData = {
      created_at: new Date().toISOString(),
      content: commentText.trim(),
      username: user?.username,
      user_image: user?.user_image,
    };
    const formData = new FormData();
    formData.append("content", commentText.trim());
    formData.append("post_owner", user?.id);

    try {
      const newComment = await addComment({ post_id, formData }).unwrap();
      setAddLocalComment((prev) => [...prev, newComment]);
      setCommentText("");
      scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [addLocalComment]);

  const toggleDrawer = (newOpen) => () => {
    if (!newOpen) dispatch(popComponent());
  };

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />

      <SwipeableDrawer
        anchor="bottom"
        open={open}
        container={container}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen
        keepMounted
        BackdropProps={{ onClick: () => dispatch(popComponent()) }}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            width: "100%",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Typography sx={{ p: 2, color: "text.secondary" }}>
            Comments
          </Typography>
          <Button onClick={() => dispatch(popComponent())}>Close</Button>
        </StyledBox>

        <StyledBox sx={{ width: "100%", overflow: "auto", p: 2 }}>
          <Box display="flex" flexDirection="column" gap={1}>
            {loadingComments && <CircularProgress />}
            {togetherComments.map((reply, idx) => (
              <Replies key={idx} reply={reply} />
            ))}
            <div ref={scrollAnchorRef} />
          </Box>
        </StyledBox>

        <StyledBox
          sx={{
            p: 1,
            borderTop: "1px solid #ddd",
            bgcolor: systemPrefersDark ? "background.paper" : "#fff",
          }}
        >
          <TextField
            fullWidth
            placeholder="Write a comment..."
            value={commentText}
            multiline
            minRows={1}
            maxRows={3}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => {
                    /* placeholder emoji logic */
                  }}
                >
                  <InsertEmoticonIcon />
                </IconButton>
              ),
            }}
          />
          <IconButton
            onClick={handleAddComment}
            disabled={!commentText.trim() || addingComment}
          >
            <SendIcon />
          </IconButton>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

SwipeableEdgeDrawer.propTypes = {
  window: PropTypes.func,
  post_id: PropTypes.string.isRequired,
};

export default SwipeableEdgeDrawer;
