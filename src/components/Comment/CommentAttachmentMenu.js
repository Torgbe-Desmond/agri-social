// CommentAttachmentMenu.js
import { Menu, MenuItem } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import VideoCameraBackOutlinedIcon from "@mui/icons-material/VideoCameraBackOutlined";
import { useTheme } from "@mui/material/styles";

const CommentAttachmentMenu = ({
  anchorEl,
  open,
  handleClose,
  handleAddImage,
  handleAddVideo,
}) => {
  const theme = useTheme();

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
      }}
    >
      <MenuItem onClick={handleAddImage}>
        <ImageOutlinedIcon sx={{ mr: 1 }} /> Add Image
      </MenuItem>
      <MenuItem onClick={handleAddVideo}>
        <VideoCameraBackOutlinedIcon sx={{ mr: 1 }} /> Add Video
      </MenuItem>
    </Menu>
  );
};

export default CommentAttachmentMenu;
