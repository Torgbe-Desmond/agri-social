import axiosInstance from "./AxiosInstance";

async function searchUser(username, offset, limit) {
  const response = await axiosInstance.get("/user/profile", {
    params: { username, offset, limit },
  });
  return response.data;
}

export const SearchService = {
  searchUser,
};
