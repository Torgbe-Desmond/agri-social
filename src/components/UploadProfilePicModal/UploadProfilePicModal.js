import React, { useEffect, useState } from "react";
import {
  Modal,
  Avatar,
  Typography,
  IconButton,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useDispatch, useSelector } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { updateUserImage } from "../../Features/AuthSlice";

const UpdateProfilePicModal = ({ user_id, user_image }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { userImageStatus } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append("file", selectedImage);
    dispatch(updateUserImage({ user_id, formData }));
  };

  const handleClose = () => {
    dispatch(popComponent());
  };

  useEffect(() => {
    if (userImageStatus === "succeeded") {
      window.location.reload();
    }
  }, [userImageStatus]);

  return (
    <Modal open onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 350,
          bgcolor: "background.paper",
          borderRadius: 12,
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
            sx={{
              borderRadius: "32px !important",
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="sidebar__tweet__contained"
            variant="outlined"
            onClick={handleUpload}
            disabled={userImageStatus === "loading"}
          >
            {userImageStatus === "loading" ? (
              <CircularProgress size={20} />
            ) : (
              "Upload"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateProfilePicModal;
