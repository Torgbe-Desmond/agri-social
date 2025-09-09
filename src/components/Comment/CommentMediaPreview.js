// CommentMediaPreview.js
import { Box, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MentionedUsersList from "../MentionedUsersList/MentionedUsersList";
import MentionedGroupsList from "../MentionedGroupsList/MentionedGroupsList";
import LinksPreview from "../LinksPreview/LinksPreview";

const CommentMediaPreview = ({
  media,
  v_media,
  file,
  setFile,
  setMedia,
  setVMedia,
  users,
  groups,
  links,
}) => {
  const theme = useTheme();

  console.log("users", users);

  const handleRemoveImage = (index) => {
    const updatedFiles = [...file];
    const updatedMedia = [...media];
    updatedFiles.splice(index, 1);
    updatedMedia.splice(index, 1);
    setFile(updatedFiles);
    setMedia(updatedMedia);
  };

  const handleRemoveVideo = (index) => {
    const updatedFiles = [...file];
    const updatedVMedia = [...v_media];
    updatedFiles.splice(index, 1);
    updatedVMedia.splice(index, 1);
    setFile(updatedFiles);
    setVMedia(updatedVMedia);
  };

  return (
    <Box
      sx={{
        p: 0.5,
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        maxWidth: 600,
        borderRadius: 1,
      }}
    >
      {media?.map((m, index) => (
        <Box
          key={`img-${index}`}
          sx={{
            position: "relative",
            display: "inline-block",
            width: 100,
            height: 60,
            border: "1px solid",
            borderColor: theme.palette.divider,
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <img
            src={m}
            alt={`preview-${index}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <IconButton
            size="small"
            onClick={() => handleRemoveImage(index)}
            sx={{
              position: "absolute",
              top: 2,
              right: 2,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
            }}
          >
            &times;
          </IconButton>
        </Box>
      ))}

      {v_media?.map((m, index) => (
        <Box
          key={`vid-${index}`}
          sx={{
            position: "relative",
            display: "inline-block",
            width: 100,
            height: 60,
            border: "1px solid",
            borderColor: theme.palette.divider,
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <video
            controls
            src={m}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <IconButton
            size="small"
            onClick={() => handleRemoveVideo(index)}
            sx={{
              position: "absolute",
              top: 2,
              right: 2,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
            }}
          >
            &times;
          </IconButton>
        </Box>
      ))}

      <MentionedUsersList users={users} />
      <MentionedGroupsList groups={groups} />
      {/* <LinksPreview links={links} /> */}
    </Box>
  );
};

export default CommentMediaPreview;
