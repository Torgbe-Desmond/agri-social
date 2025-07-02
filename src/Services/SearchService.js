import axiosInstance from "./AxiosInstance";

async function searchUser(username) {
  const response = await axiosInstance.get("/user-profile/", {
    params: { username },
  });
  return response.data;
}

export const SearchService = {
  searchUser,
};
