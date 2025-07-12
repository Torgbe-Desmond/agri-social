import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, List, Slide } from "@mui/material";
import "./Stream.css";
import VideoCard from "../../components/VideoCard/VideoCard";
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { getStreams } from "../../Features/PostSlice";

// Slide transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Streams = () => {
  const [open, setOpen] = useState(true); // Full-screen dialog starts open
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { streamData, hasMoreStreams, streamStatus } = useSelector(
    (state) => state.post
  );
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const observer = useRef();

  // Toggle the full-screen dialog
  const handleToggleDialog = () => {
    setOpen(!open);
  };

  useEffect(() => {
    dispatch(
      getStreams({
        user_id: localStorage.getItem("cc_ft"),
        offset: pageNumber,
        limit: 3,
      })
    );
  }, [pageNumber]);

  // Filter data based on search term
  useEffect(() => {
    const searchedData = searchTerm
      ? streamData.filter((video) =>
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
        if (entries[0].isIntersecting && hasMoreStreams) {
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
      {filteredData.map((file, index) => {
        const isLast = index === streamData.length - 1;
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
