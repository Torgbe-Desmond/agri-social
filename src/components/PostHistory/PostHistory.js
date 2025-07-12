import React, { useEffect, useRef, useState } from "react";
import "./PostHistory.css";
import { useDispatch, useSelector } from "react-redux";
import { getPostHistory } from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";
import { Box, CircularProgress, TextField } from "@mui/material";
import PostHistoryCard from "../PostHistoryCard/PostHistoryCard";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../Header/Header";

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

  const reloadAction = () => {
    dispatch(getPostHistory({ user_id }));
  };

  return (
    <Header
      status={postHistoryStatus}
      allowedSearch={true}
      name={"Posts"}
      reloadAction={reloadAction}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      children={
        <>
          {filteredData?.length === 0 ? (
            <p style={{ padding: "1rem", color: "#555" }}>No posts yet.</p>
          ) : (
            filteredData.map((post, index) => (
              <PostHistoryCard key={index} post={post} />
            ))
          )}
        </>
      }
    />
  );
}

export default PostHistory;
