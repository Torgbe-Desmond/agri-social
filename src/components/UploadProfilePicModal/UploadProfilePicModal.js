import {
  Modal,
  Avatar,
  Typography,
  IconButton,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { useUpdateUserImageMutation } from "../../Features/userApi";

const UpdateProfilePicModal = ({ user_image }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [updateUserImage, { isLoading }] = useUpdateUserImageMutation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      await updateUserImage(formData).unwrap();
      dispatch(popComponent());
      window.location.reload();
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleClose = () => dispatch(popComponent());

  return (
    <Modal open onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 350,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
          outline: "none",
        }}
      >
        <Typography variant="h6" gutterBottom align="center">
          Update Profile Picture
        </Typography>

        <Box sx={{ textAlign: "center" }}>
          <Avatar
            src={preview || user_image}
            sx={{ width: 100, height: 100, margin: "0 auto", mb: 2 }}
          />
          <Typography variant="body2" sx={{ mb: 2 }}>
            Choose a new profile picture
          </Typography>
          <Box>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="upload-profile-pic"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="upload-profile-pic">
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            color="secondary"
            variant="outlined"
            sx={{ borderRadius: "32px" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            sx={{ borderRadius: "32px" }}
            variant="contained"
            onClick={handleUpload}
            disabled={isLoading || !selectedImage}
          >
            {isLoading ? <CircularProgress size={20} /> : "Upload"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateProfilePicModal;
