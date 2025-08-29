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
  const cardRefs = useRef([]);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
            const index = Number(entry.target.dataset.index);
            // If the visible card is the last one, load more
            if (
              index === streamData.length - 1 &&
              hasMoreStreams &&
              !isFetching
            ) {
              setPageNumber((prev) => prev + 1);
            }
          }
        });
      },
      { threshold: 0.9 }
    );

    cardRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => observer.disconnect();
  }, [streamData, hasMoreStreams, isFetching]);

  return (
    <List
      sx={{
        overflowY: "auto",
        padding: "16px",
      }}
      className="list-container"
    >
      {streamData?.map((file, index) => (
        <div
          key={file.post_id || index}
          ref={(el) => (cardRefs.current[index] = el)}
          data-index={index}
          className="video-holder"
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
      ))}
    </List>
  );
};

export default Streams;
