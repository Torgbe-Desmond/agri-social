import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { useDispatch } from "react-redux";
import { popComponent } from "../../Features/StackSlice";
import { updateUserInformation } from "../../Features/AuthSlice";
import { useOutletContext } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ComponentStack from "../HandleStack/HandleStack";

const ProfileModal = ({ user, systemPrefersDark, darkMode }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const predefinedTags = [];

  const [userData, setUserData] = useState({
    user_image: "",
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    city: "",
    interests: "",
  });

  const interests = [""];

  const dispatch = useDispatch();

  // Populate initial user data
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setUserData({
        user_image: user.user_image || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        username: user.username || "",
        email: user.email || "",
        city: user.city || "",
        interests: user.interests || "",
      });
    }
  }, [user]);

  const handleChange = (field) => (event) => {
    setUserData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleTagChange = (event, value) => {
    if (event && (event.key === "Enter" || event.key === " ")) {
    }
    setSelectedTags(value);
  };

  const handleSave = () => {
    const formData = new FormData();
    if (userData.firstname) formData.append("firstname", userData.firstname);
    if (userData.lastname) formData.append("lastname", userData.lastname);
    if (userData.username) formData.append("username", userData.username);
    if (userData.email) formData.append("email", userData.email);
    if (userData.city) formData.append("city", userData.city);
    if (userData.interests) formData.append("interests", userData.interests);

    dispatch(updateUserInformation({formData }));
    dispatch(popComponent());
  };

  const handlePopComponent = () => {
    dispatch(popComponent());
  };

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
          bgcolor: "background.paper",
          borderRadius: 12,
          boxShadow: 24,
          p: 4,
          width: 500,
        }}
      >
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ position: "relative", mr: 3 }}>
              <Avatar
                alt="Desmond"
                src={userData?.user_image}
                sx={{ width: 72, height: 72 }}
              />
              <IconButton
                onClick={updateProfileImage}
                sx={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  bgcolor: "blue",
                  color: "white",
                  borderRadius: "50%",
                  p: 0.5,
                  "&:hover": { bgcolor: "darkblue" },
                }}
                size="small"
              >
                <AddCircleIcon />
              </IconButton>
            </Box>
            {/* <Avatar src={userData.user_image} sx={{ width: 64, height: 64 }} /> */}
            <Box>
              <TextField
                fullWidth
                label="Firstname"
                value={userData.firstname}
                onChange={handleChange("firstname")}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Lastname"
                value={userData.lastname}
                onChange={handleChange("lastname")}
                margin="dense"
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="City"
              value={userData.city}
              onChange={handleChange("city")}
            />
            <TextField
              fullWidth
              label="Username"
              value={userData.username}
              onChange={handleChange("username")}
            />
          </Stack>

          <TextField
            fullWidth
            label="Email address"
            value={userData.email}
            onChange={handleChange("email")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box mt={2} sx={{ width: "100%" }}>
            <Autocomplete
              multiple
              freeSolo
              options={predefinedTags}
              value={selectedTags}
              onChange={handleTagChange}
              sx={{
                borderRadius: 1,
                padding: "2px",
              }}
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
                  placeholder="Add Interest (Press enter after each interest)"
                  variant="outlined"
                />
              )}
            />
          </Box>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              sx={{
                borderRadius: "32px !important",
              }}
              variant="outlined"
              color="secondary"
              onClick={handlePopComponent}
            >
              Cancel
            </Button>
            <Button
              elevation="none"
              variant="outlined"
              className="sidebar__tweet__contained"
              color="primary"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
