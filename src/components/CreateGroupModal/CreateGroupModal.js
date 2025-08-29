import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Modal,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { useCreateGroupMutation } from "../../Features/messageApi";

const CreateGroupModal = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState(null);
  const [file, setFile] = useState(null);

  const [createGroup, { isLoading, error }] = useCreateGroupMutation();

  const handleMediaUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setMedia(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
      setFile(uploadedFile);
    }
  };

  const handleClearMedia = () => {
    setMedia(null);
    setFile(null);
  };

  const handleCreate = async () => {
    if (!groupName.trim()) return;

    const formData = new FormData();
    formData.append("name", groupName.trim());
    formData.append("description", description.trim());
    formData.append("is_group", "1");
    if (file) {
      formData.append("file", file);
    }

    try {
      await createGroup({ formData }).unwrap();
      dispatch(popComponent());
    } catch (err) {
      console.error("Create group failed:", err);
    }
  };

  const handleCancel = () => {
    dispatch(popComponent());
  };

  return (
    <Modal open onClose={handleCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" mb={2}>
          Create Group
        </Typography>

        <Stack spacing={2}>
          {error && (
            <Alert severity="error">
              {error?.data?.message || "Something went wrong while creating the group."}
            </Alert>
          )}

          <TextField
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            fullWidth
            required
            disabled={isLoading}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
            disabled={isLoading}
          />

          {/* Upload Image */}
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload"
            type="file"
            onChange={handleMediaUpload}
          />
          <label htmlFor="image-upload">
            <Button
              component="span"
              variant="outlined"
              startIcon={<ImageIcon />}
              disabled={isLoading}
              sx={{ borderRadius: "32px" }}
            >
              Upload Image
            </Button>
          </label>

          {/* Image Preview */}
          {media && (
            <Box
              mt={1}
              position="relative"
              display="flex"
              justifyContent="center"
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <IconButton
                size="small"
                color="inherit"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: theme.palette.background.paper,
                  "&:hover": { bgcolor: theme.palette.grey[200] },
                }}
                onClick={handleClearMedia}
                disabled={isLoading}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              <img
                src={media}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={handleCancel}
              variant="outlined"
              color="secondary"
              sx={{ borderRadius: "32px" }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              variant="contained"
              sx={{ borderRadius: "32px" }}
              disabled={!groupName.trim() || isLoading}
            >
              {isLoading ? <CircularProgress size={20} /> : "Create"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CreateGroupModal;
