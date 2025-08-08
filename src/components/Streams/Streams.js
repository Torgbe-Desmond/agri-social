import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, List, Slide } from "@mui/material";
import "./Stream.css";
import VideoCard from "../../components/VideoCard/VideoCard";
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useGetStreamsQuery } from "../../Features/postApi";
import { updateStreamList } from "../../Features/PostSlice";

const Streams = () => {
  const [open, setOpen] = useState(true); // Full-screen dialog starts open
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const { streamData } = useSelector((state) => state.post);
  const observer = useRef();

  const { data, isLoading, isFetching, error } = useGetStreamsQuery({
    offset: pageNumber,
    limit: 10,
  });

  const hasMoreStreams = data?.posts.length > 0;

  console.log("data", data);

  useEffect(() => {
    if (Array.isArray(data?.posts)) {
      dispatch(updateStreamList({ streamData: data.posts }));
    }
  }, [dispatch, data?.posts]);

  // Toggle the full-screen dialog
  const handleToggleDialog = () => {
    setOpen(!open);
  };

  // Filter data based on search term
  useEffect(() => {
    const searchedData = searchTerm
      ? streamData?.filter((video) =>
          video.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : streamData;
    setFilteredData(searchedData);
  }, [searchTerm, streamData]);

  const lasStreamRef = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreStreams && !isFetching) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMoreStreams]
  );

  return (
    <List
      sx={{
        overflowY: "auto",
        padding: "16px",
      }}
      className="list-container"
    >
      {filteredData?.map((file, index) => {
        const isLast = index === streamData?.length - 1;
        return (
          <div
            ref={isLast ? lasStreamRef : null}
            className="video-holder"
            key={index}
          >
            <VideoCard
              id={index}
              user_image={file.user_image}
              saved={file.saved}
              comments={file.comments}
              post_id={file.post_id}
              likes={file.likes}
              user_id={file.user_id}
              url={file.videos}
              content={file.content}
              username={file.username}
              handleToggleDialog={handleToggleDialog}
            />
          </div>
        );
      })}
    </List>
  );
};

export default Streams;
