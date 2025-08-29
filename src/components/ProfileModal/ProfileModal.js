import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { popComponent } from "../../Features/StackSlice";
import ComponentStack from "../HandleStack/HandleStack";
import { useUpdateUserInformationMutation } from "../../Features/userApi";

const ProfileModal = ({ user }) => {
  const theme = useTheme(); // 🔹 Access theme
  const [selectedTags, setSelectedTags] = useState(
    user?.interests?.split(",") || []
  );
  const [updateUserInformation, { isLoading }] =
    useUpdateUserInformationMutation();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    username: user?.username || "",
    email: user?.email || "",
    city: user?.city || "",
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleTagChange = (_, value) => {
    setSelectedTags(value);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });
      if (selectedTags.length > 0) {
        formData.append("interests", selectedTags.join(","));
      }

      await updateUserInformation(formData).unwrap();
      dispatch(popComponent());
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handlePopComponent = () => dispatch(popComponent());

  const updateProfileImage = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("ProfileImage", {
      user_image: user?.user_image,
    });
  };

  return (
    <Modal open={true} onClose={handlePopComponent}>
      <Box
        sx={{
          maxWidth: { xs: "80%", sm: "80%", md: 400, lg: 400 },
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          width: 500,
        }}
      >
        <Stack spacing={3}>
          {/* Avatar + Name */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ position: "relative", mr: 3 }}>
              <Avatar
                alt="User"
                src={user?.user_image}
                sx={{ width: 72, height: 72 }}
              />
              <IconButton
                onClick={updateProfileImage}
                sx={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderRadius: "50%",
                  p: 0.5,
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                <AddCircleIcon />
              </IconButton>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Firstname"
                value={form.firstname}
                onChange={handleChange("firstname")}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Lastname"
                value={form.lastname}
                onChange={handleChange("lastname")}
                margin="dense"
              />
            </Box>
          </Stack>

          {/* City / Username */}
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="City"
              value={form.city}
              onChange={handleChange("city")}
            />
            <TextField
              fullWidth
              label="Username"
              value={form.username}
              onChange={handleChange("username")}
            />
          </Stack>

          {/* Email */}
          <TextField
            fullWidth
            label="Email address"
            value={form.email}
            onChange={handleChange("email")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Interests */}
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={selectedTags}
            onChange={handleTagChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={index}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Interests"
                placeholder="Add interest and press enter"
              />
            )}
          />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              sx={{
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
              }}
              onClick={handlePopComponent}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
