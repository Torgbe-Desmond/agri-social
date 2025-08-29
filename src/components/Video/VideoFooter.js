import { useEffect, useMemo, useState } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { IconButton, Slider } from "@mui/material";
import "./Video.css";
import { useDispatch, useSelector } from "react-redux";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import {
  useLikePostMutation,
  useSavePostMutation,
} from "../../Features/postApi";
import { updatePostLike, updatePostSaved } from "../../Features/PostSlice";
import Footer from "./Footer";
import VideoInfo from "./VideoInfo";

const VideoFooter = ({
  toggleMute,
  isMuted,
  isVideoBuffering,
  currentTime,
  videoRef,
  duration,
  commentId,
  isVideoPlaying,
  onSeek,
  postId,
}) => {
  const dispatch = useDispatch();
  const { userDetails: user } = useSelector((state) => state.auth);
  const [media, setMedia] = useState();
  const { posts } = useSelector((state) => state.post);
  const [likePost] = useLikePostMutation();
  const [updatedActions, setUpdatedActions] = useState([]);
  const [savePost] = useSavePostMutation();
  const reference_id = localStorage.getItem("reference_id");
  const { comments, singleComment } = useSelector((state) => state.comment);

  useEffect(() => {
    if (postId && posts?.length > 0) {
      const post = posts.find((p) => p.post_id === postId);
      setMedia(post);
    }

    if (commentId && comments?.length > 0) {
      const comment = comments.find((c) => c.id === commentId);
      setMedia(comment);
    }
  }, [posts, comments, postId, commentId]); // ✅ added deps

  // const combinedMedia = useMemo(() => {
  //   const mediaArray = [];
  //   if (media?.images) {
  //     mediaArray.push(
  //       ...media.images.split(",").map((src) => ({
  //         url: src.trim(),
  //         type: "image",
  //       }))
  //     );
  //   }
  //   if (media?.videos) {
  //     mediaArray.push(
  //       ...media.videos.split(",").map((src) => ({
  //         url: src.trim(),
  //         type: "video",
  //       }))
  //     );
  //   }
  //   return mediaArray;
  // }, [media]);

  const handleLikePost = async () => {
    const formData = new FormData();
    formData.append("post_owner", postId);

    try {
      const payload = await likePost({
        post_id: postId,
        formData,
      }).unwrap();
      dispatch(updatePostLike(payload));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  async function handleSavePost() {
    const formData = new FormData();
    formData.append("user_id", user?.id);
    const payload = await savePost({
      post_id: postId,
      formData,
    }).unwrap();
    dispatch(updatePostSaved(payload));
  }

  const actions = useMemo(() => {
    if (!media) return [];

    const baseActions = [
      {
        id: "comment",
        location: "post",
        to: `/${reference_id}/post/${postId}`,
        icon: <ChatBubbleOutlineIcon fontSize="small" />,
        count: media?.replies ?? media?.comments ?? 0, 
      },
      {
        id: "like",
        location: "post",
        icon: media?.liked ? (
          <FavoriteIcon fontSize="small" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        ),
        count: media?.likes ?? 0, 
        action: handleLikePost,
      },
      {
        id: "bookmark",
        location: "post",
        icon: media?.saved ? (
          <BookmarkIcon fontSize="small" />
        ) : (
          <BookmarkBorderIcon fontSize="small" />
        ),
        count: media?.saves ?? 0, 
        action: handleSavePost,
      },
    ];

    if (commentId && !postId) {
      return baseActions.filter((a) => a.id !== "bookmark");
    }

    return baseActions;
  }, [media, postId, commentId]);

  const iconStyle = {
    filter: "drop-shadow(5px 5px 10px rgba(9, 8, 8, 0.5))",
    color: "white",
  };

  return (
    <div className="footer-wrapper">
      <div className="footer-controls">
        {/* Show mute/unmute + slider only when video is playing */}
        {
          <>
            <div className="footer-actions">
              <IconButton className="footer-volume-button" onClick={toggleMute}>
                {isMuted ? (
                  <VolumeOffIcon style={iconStyle} />
                ) : (
                  <VolumeUpIcon style={iconStyle} />
                )}
              </IconButton>
            </div>

            <VideoInfo media={media} />

            <Slider
              aria-label="video-progress"
              size="small"
              value={currentTime}
              min={0}
              step={1}
              max={duration}
              onChange={(e, newValue) => onSeek(newValue)}
              sx={(t) => ({
                color: "#FFF",
                height: 4,
                flex: 1,
                filter: "drop-shadow(5px 5px 10px rgba(9, 8, 8, 0.5))",
                "& .MuiSlider-thumb": {
                  width: 8,
                  height: 8,
                  transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                  "&::before": {
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  },
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: `0px 0px 0px 8px ${"rgb(0 0 0 / 16%)"}`,
                    ...t.applyStyles("dark", {
                      boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
                    }),
                  },
                  "&.Mui-active": {
                    width: 20,
                    height: 20,
                  },
                },
                "& .MuiSlider-rail": {
                  opacity: 0.28,
                },
                ...t.applyStyles("dark", {
                  color: "#fff",
                }),
              })}
            />

            <Footer actions={actions} />
          </>
        }
      </div>
    </div>
  );
};

export default VideoFooter;
