import { useEffect, useRef, useState } from "react";
import "./Bookmarks.css";
import { useDispatch, useSelector } from "react-redux";
import Saved from "../../components/Saved/Saved";
import { Box, CircularProgress } from "@mui/material";
import { getSavedHistory } from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";
import Header from "../../components/Header/Header";
import { setScrolling } from "../../Features/StackSlice";

function Bookmarks() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { darkMode, systemPrefersDark } = useOutletContext();
  const [filteredData, setFilteredData] = useState([]);
  const { savedStatus, savedHistory } = useSelector((state) => state.post);
  const { userDetails } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");

  const feedRef = useRef(null);
  const lastScrollTop = useRef(0);
  const [scrolling, setScroll] = useState(0);

  const itemRefs = useRef([]);
  const [visiblePostId, setVisiblePostId] = useState(null);

  useEffect(() => {
    dispatch(setScrolling(true));
    return () => dispatch(setScrolling(false));
  }, []);

  useEffect(() => {
    if (localStorage.getItem("cc_ft")) {
      dispatch(getSavedHistory({ user_id: localStorage.getItem("cc_ft") }));
    }
  }, [dispatch, localStorage.getItem("cc_ft")]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    let searchedData;
    searchedData = searchTerm
      ? savedHistory?.filter(
          (st) =>
            st.content
              ?.toLocaleLowerCase()
              ?.includes(searchTerm.toLocaleLowerCase()) ||
            st.username
              ?.toLocaleLowerCase()
              ?.includes(searchTerm.toLocaleLowerCase())
        )
      : savedHistory;
    setFilteredData(searchedData);
  }, [searchTerm, savedHistory]);

  useEffect(() => {
    const visible = itemRefs.current.find((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= parseInt(window.innerHeight / 10) &&
        rect.bottom <= window.innerHeight
      );
    });

    const visibleItems = itemRefs.current.filter((el) => {
      if (!el) return false;

      const rect = el.getBoundingClientRect();
      return (
        rect.top >= window.innerHeight / 10 && rect.bottom <= window.innerHeight
      );
    });

    visibleItems.unshift();

    visibleItems.forEach((el) => {
      const id = el
        ?.querySelector(".post")
        ?.getAttribute("id")
        ?.replace("post-bookmark", "");

      const postEl = document.querySelector(`#post-${id}`);
      // console.log("postEl", postEl);

      if (!id || !postEl) return;

      const hasImage = postEl.querySelector(".post__images .post_media img");

      // const hasVideo = el.querySelector(`#post-${id} video`);

      // postEl.classList.add("visible-post-next");

      if (hasImage) {
        console.log("has image");
        hasImage.style.display = "flex";
      }
    });

    // itemRefs.current.forEach((el) => el?.classList.remove("visible-post"));

    const videoIds = savedHistory
      // .filter((p) => p.has_video)
      .map((p) => p.post_id);

    const id = visible
      ?.querySelector(".post")
      ?.getAttribute("id")
      ?.replace("post-bookmark-", "");

    if (videoIds.includes(id)) {
      // If new post is different from currently playing
      if (visiblePostId && visiblePostId !== id) {
        // Pause the previously playing video
        const oldVideo = document.querySelector(
          `#post-bookmark-${visiblePostId} video`
        );
        if (oldVideo) oldVideo.pause();
      }

      // visible.classList.add("visible-post");

      const newVideo = document.querySelector(`#post-bookmark-${id} video`);
      if (newVideo) {
        newVideo.play().catch((err) => {
          console.warn("Autoplay failed:", err);
        });
      }

      const newImage = document.querySelector(`#post-bookmark-${id} img`);
      if (newImage) {
        newImage.style.display = "flex";
      }

      setVisiblePostId(id); // Update the currently playing video ID
    } else {
      // If visible post is not a video, pause previously playing video
      if (visiblePostId) {
        const prevVideo = document.querySelector(
          `#post-bookmark${visiblePostId} video`
        );
        if (prevVideo) prevVideo.pause();
        setVisiblePostId(null);
      }
    }
  }, [scrolling, savedHistory]);

  return (
    <Header
      searchTerm={searchTerm}
      name={"Bookmarks"}
      setSearchTerm={setSearchTerm}
      status={savedStatus}
      setScroll={setScroll}
      ref={feedRef}
      children={
        filteredData?.length === 0 && savedStatus === "rejected" ? (
          <p style={{ padding: "1rem", color: "#555" }}>No saved posts yet.</p>
        ) : (
          filteredData.map((saved, index) => <Saved key={index} save={saved} />)
        )
      }
    />
  );
}

export default Bookmarks;
