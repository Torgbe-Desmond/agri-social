import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import "./SwipeableDrawer.css";
// import { useNavigate, useOutletContext } from "react-router-dom";
import { addComment, getComments } from "../../Features/PostSlice";
import { clearComments } from "../../Features/CommentSlice";
import { popComponent } from "../../Features/StackSlice";
import { IconButton, TextField, useMediaQuery } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import Replies from "../Replies/Replies";

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

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: "relative",
  top: 8,
  left: "calc(50% - 15px)",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[900],
  }),
}));

function SwipeableEdgeDrawer(props) {
  const { window, post_id, user_id } = props;
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const [addLocalComment, setAddLocalComment] = useState([]);
  const [data, setData] = useState(null);
  const commentsEndRef = useRef(null);
  const [togetherComments, setTogetherComments] = useState([]);
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const chatContainerRef = useRef(null);
  const scrollAnchorRef = useRef(null);
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  //   const navigate = useNavigate();

  const {
    comments: commentData,
    likeCommentStatus,
    commentStatus,
  } = useSelector((state) => state.comment);


  useEffect(() => {
    if (post_id) {
      dispatch(getComments({ post_id }));
    }
    return () => {
      dispatch(clearComments());
      setTogetherComments([]);
      setAddLocalComment([]);
    };
  }, [dispatch, post_id]);

  useEffect(() => {
    setTogetherComments([...commentData, ...addLocalComment]);
  }, [addLocalComment, commentData]);

  const onEmojiSelect = (emoji) => {
    setComment((prev) => prev + emoji.native);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (scrollAnchorRef.current) {
        scrollAnchorRef.current.scrollIntoView({
          behavior: "smooth",
          ininline: "end",
        });
      }
    }, 10);
  }, [addLocalComment]);

  const handleAddComment = () => {
    if (comment.trim()) {
      const messageData = {
        created_at: new Date().toISOString(),
        content: comment.trim(),
        username: userDetails?.username,
        userId: userDetails?.id,
        user_image: userDetails?.user_image,
        likes: [],
        replies: [],
      };

      const formData = new FormData();
      formData.append("content", comment);
      formData.append("post_owner", user_id);
      dispatch(addComment({ post_id, formData }));
      setAddLocalComment((prev) => [...prev, messageData]);
      setComment("");
    }
  };

  const openEmojiPicker = (e) => setEmojiAnchor(e.currentTarget);
  const closeEmojiPicker = () => setEmojiAnchor(null);

  const handleClose = () => {
    dispatch(popComponent());
  };

  //   const lastPostRef = useCallback(
  //     (node) => {
  //       if (observer.current) observer.current.disconnect();
  //       observer.current = new IntersectionObserver((entries) => {
  //         if (entries[0].isIntersecting && hasMore) {
  //           setPageNumber((prev) => prev + 1);
  //         }
  //       });
  //       if (node) observer.current.observe(node);
  //     },
  //     [hasMore]
  //   );

  // Scroll to bottom when chatMessages change

  useEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [addLocalComment]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  //   useEffect(() => {
  //     if (scrollTo) {
  //       const el = document.getElementById(`post-${scrollTo}`);
  //       if (el) {
  //         el.scrollIntoView({
  //           behavior: "smooth",
  //           block: "center",
  //           inline: "nearest",
  //         });

  //         el.classList.add("highlight-blink");

  //         const timeoutId = setTimeout(() => {
  //           el.classList.remove("highlight-blink");
  //         }, 2000);

  //         return () => clearTimeout(timeoutId);
  //       }
  //     }
  //   }, [togetherComments, scrollTo]);

  // if (commentStatus === "loading") {
  //   return (
  //     <p className="circular__progress">
  //       <CircularProgress size="small" />
  //     </p>
  //   );
  // }

  //   const handleGoBack = () => {
  //     navigate(-1);
  //   };

  useEffect(() => {
    const handleBackdropClick = () => {
      dispatch(popComponent());
    };

    const backdrop = document.querySelector(
      ".css-4nmryk-MuiBackdrop-root-MuiModal-backdrop"
    );

    if (backdrop) {
      backdrop.addEventListener("click", handleBackdropClick);
    }

    // Cleanup on unmount
    return () => {
      if (backdrop) {
        backdrop.removeEventListener("click", handleBackdropClick);
      }
    };
  }, [dispatch]);

  return (
    <Root
      sx={{
        background: "red",
        "& .css-4nmryk-MuiBackdrop-root-MuiModal-backdrop": {
        },
      }}
    >
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
            // background:"red"
          },
        }}
      />
      {/* <Box sx={{ textAlign: 'center', pt: 1 }}>
        <Button onClick={toggleDrawer(true)}>Open</Button>
      </Box> */}
      <SwipeableDrawer
        anchor="bottom"
        open={true}
        onClose={false}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        keepMounted
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            fontSize:"12px",
            right: 0,
            left: 0,
            // background:"red"
          }}
        >
          {/* <Puller /> */}
          <Typography sx={{ p: 2, color: "text.secondary" }}>
            51 results
          </Typography>
          <Button onClick={() => dispatch(popComponent())}>Close</Button>
        </StyledBox>
        <StyledBox
          sx={{ width: "100%", overflow: "auto" }}
        >
          <div className="stream_comment">
            <div ref={chatContainerRef}>
              {togetherComments?.map((reply, index) => (
                <Replies key={index} reply={reply} user_id={userDetails?.id} />
              ))}
              <div ref={scrollAnchorRef} />
            </div>

            <Box
              sx={{
                p: 1,
                bgcolor: systemPrefersDark ? "background.paper" : "#FFF",
              }}
              display="flex"
              position="sticky"
              bottom="0"
              zIndex="100"
              gap={1}
              alignItems="center"
              pt={1}
              borderTop="1px solid #ddd"
            >
              <TextField
                sx={{
                  bgcolor: systemPrefersDark ? "background.paper" : "#FFF",
                }}
                fullWidth
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                size="small"
                multiline
                minRows={1}
                maxRows={3}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={openEmojiPicker}>
                      <InsertEmoticonIcon />
                    </IconButton>
                  ),
                }}
              />

              <IconButton onClick={handleAddComment} disabled={!comment.trim()}>
                <SendIcon />
              </IconButton>
            </Box>
          </div>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

SwipeableEdgeDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default SwipeableEdgeDrawer;
