import React, { useEffect, useRef, useState } from "react";
import "./PostHistory.css";
import { useDispatch, useSelector } from "react-redux";
import { getPostHistory } from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";
import { Box, CircularProgress, TextField } from "@mui/material";
import PostHistoryCard from "../PostHistoryCard/PostHistoryCard";
import SearchIcon from "@mui/icons-material/Search";

function PostHistory() {
  const { user_id } = useOutletContext();
  const dispatch = useDispatch();
  const postRef = useRef();
  const { postHistory, postHistoryStatus } = useSelector((state) => state.post);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(getPostHistory({ user_id }));
  }, [dispatch, user_id]);

  useEffect(() => {
    let searchedData;
    searchedData = searchTerm
      ? postHistory?.filter(
          (st) =>
            st.username
              ?.toLocaleLowerCase()
              ?.includes(searchTerm.toLocaleLowerCase()) ||
            st.content
              ?.toLocaleLowerCase()
              ?.includes(searchTerm.toLocaleLowerCase())
        )
      : postHistory;
    setFilteredData(searchedData);
  }, [searchTerm, postHistory]);

  if (postHistoryStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  return (
    <>
      <Box className="post__history__header">
        <Box
          sx={{ bgcolor: "background.paper", border: "1px solid #ccc" }}
          className="user__products__input"
        >
          <SearchIcon className="market_place__searchIcon" />
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a post"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent",
                },
                "& .MuiInputBase-input": {
                  width: { xs: "100%", sm: "100%", md: "500px", lg: "500px" },
                  boxSizing: "border-box",
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent",
                },
              },
            }}
          />{" "}
        </Box>
      </Box>

      {filteredData?.length === 0 ? (
        <p style={{ padding: "1rem", color: "#555" }}>No posts yet.</p>
      ) : (
        filteredData.map((post, index) => (
          <PostHistoryCard key={index} post={post} />
        ))
      )}
    </>
  );
}

export default PostHistory;
