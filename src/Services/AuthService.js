import axiosInstance from "./AxiosInstance";

// Function to handle user login
async function login(formData) {
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  const response = await axiosInstance.post("/login", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// Function to handle user registration
async function register(formData) {
  const response = await axiosInstance.post("/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// Function to delete user
async function deleteUser(token, userId) {
  const response = await axiosInstance.post(`/delete`, { userId });
  return response.data;
}

// Function to send recovery link
async function sendRecoveryLink(email) {
  const response = await axiosInstance.get(`/recovery`, {
    params: { email },
  });
  return response.data;
}

// Function to send logout link
async function logout() {
  const response = await axiosInstance.post(`/logout`);
  return response.data;
}

// Function to send logout link
async function updateUserInformation(formData) {
  const response = await axiosInstance.put(`/update-user`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

async function verifyEmail(email) {
  const response = await axiosInstance.post(`/send-email-verification`, {
    email,
  });
  return response.data;
}

async function getVerificationToken(reference_Id) {
  console.log("reference_Id", reference_Id);
  const response = await axiosInstance.get(
    `/auth/${reference_Id}/get-verification-token`
  );
  return response.data;
}

// Function to handle forgot password
async function updatePassword(newPassword) {
  const token = localStorage.getItem("verificationToken");
  if (!token) {
    throw new Error("User is not authenticated. Token is missing.");
  }
  const response = await axiosInstance.post(
    "/auth/update-password",
    { newPassword },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.stringify(token)}`,
      },
    }
  );

  return response.data;
}

// Function to get all users
async function getUser() {
  const response = await axiosInstance.get(`/user`);
  return response.data;
}

async function getAnotherUser(user_id) {
  const response = await axiosInstance.get(`/another-user/${user_id}`);
  return response.data;
}

// Function to update user imagge
async function updateUserImage(formData) {
  const response = await axiosInstance.put(
    `/update-user-profile-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

// Function to check if following
async function isFollowing(user_id, current_user_id) {
  const response = await axiosInstance.get(`/following/${user_id}`);
  return response.data;
}

// Function to follow
async function follow(user_id) {
  const response = await axiosInstance.post(`/follow/${user_id}`);
  return response.data;
}

// Function to follow people
async function peopleToFollow(offset, limit) {
  const response = await axiosInstance.get(`/new-followers`, {
    params: {
      offset,
      limit,
    },
  });
  return response.data;
}

export const AuthService = {
  login,
  logout,
  register,
  deleteUser,
  verifyEmail,
  sendRecoveryLink,
  updatePassword,
  getVerificationToken,
  getUser,
  updateUserInformation,
  updateUserImage,
  isFollowing,
  follow,
  getAnotherUser,
  peopleToFollow,
};
