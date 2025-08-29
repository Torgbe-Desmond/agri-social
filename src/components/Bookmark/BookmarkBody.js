import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import FeedImageCard from "../FeedImageCard/FeedImageCard";
import './Bookmark.css'

const BookmarkBody = ({ bookmark }) => {
  const combinedMedia = useMemo(() => {
    const mediaArray = [];
    if (bookmark?.images) {
      mediaArray.push(
        ...bookmark.images.split(",").map((src) => ({
          url: src.trim(),
          type: "image",
        }))
      );
    }
    if (bookmark?.videos) {
      mediaArray.push(
        ...bookmark.videos.split(",").map((src) => ({
          url: src.trim(),
          type: "video",
        }))
      );
    }
    return mediaArray;
  }, [bookmark]);

  const renderTags = (tags) => {
    if (!tags) return null;
    return tags.split(",").map((tag, index) => (
      <Typography
        color="primary"
        sx={{ padding: "0px", pr: 0.5 }}
        variant="body2"
        key={index}
        className="bookmark-tag"
      >
        #{tag.trim()}
      </Typography>
    ));
  };

  return (
    <div className="bookmark-body">
      {/* Bookmark Text Content */}
      {bookmark?.content && (
        <div className="bookmark-content">
          <p>{bookmark.content}</p>
        </div>
      )}

      {/* Media + Tags */}
      <div className="bookmark-media-section">
        {/* Tags */}
        {bookmark?.tags && (
          <div className="bookmark-tags">{renderTags(bookmark.tags)}</div>
        )}

        {/* Images / Videos */}
        {combinedMedia.length > 0 && (
          <Box
            className="bookmark-media-wrapper"
            sx={{
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
            }}
          >
            <FeedImageCard media={combinedMedia && combinedMedia} />
          </Box>
        )}
      </div>
    </div>
  );
};

export default BookmarkBody;
