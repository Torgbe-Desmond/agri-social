import axiosInstance from "./AxiosInstance";

async function searchUser(username, offset, limit) {
  const response = await axiosInstance.get("/user/profile", {
    params: { username, offset, limit },
  });
  return response.data;
}

async function searchMentionedUsers(formData) {
  const response = await axiosInstance.post("/user/search", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

async function searchMentionedUGroups(formData) {
  const response = await axiosInstance.post("/group/search", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// async function searchMentionedUsers(formData, offset = 0, limit = 10) {
//   // Extract usernames from formData
//   const usernames = formData.get("usernames"); // e.g., "desmond,kate"

//   const response = await axiosInstance.get("/user/search", {
//     params: { usernames, offset, limit },
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//   });

//   return response.data;
// }

export const SearchService = {
  searchUser,
  searchMentionedUsers,
  searchMentionedUGroups,
};
