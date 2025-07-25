import React, { useCallback, useEffect, useRef, useState } from "react";
import "./UserFeed.css";
import Avatar from "@mui/material/Avatar";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StatusIcons from "../StatusIcons/StatusIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  getPostHistory,
  getUserPostHistory,
} from "../../Features/PostSlice";
import { useOutletContext, useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Post from "../Post/Post";
import Header from "../Header/Header";
import { setScrolling } from "../../Features/StackSlice";
import UserInfo from "../UserInfo/UserInfo";
import { clearConversationId, conversing } from "../../Features/MessageSlice";
import { _getUser } from "../../Features/AuthSlice";

function UserFeed({ _conversation_id }) {
  const dispatch = useDispatch();
  const postRef = useRef();
  const {
    userPostHistory,
    postDeleteStatus,
    userPostHistoryStatus,
    hasMoreUserPostHistory,
  } = useSelector((state) => state.post);
  const [filteredData, setFilteredData] = useState([]);
  const { _user_id } = useParams();
  const feedRef = useRef(null);
  const lastScrollTop = useRef(0);
  const [scrolling, setScroll] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const isFetchingRef = useRef(false);
  const itemRefs = useRef([]);
  const [visiblePostId, setVisiblePostId] = useState(null);
  const observer = useRef(null);
  const { _userDetails, _userDetailsStatus, userDetails } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(_getUser({ user_id: _user_id }));
    return () => dispatch(clearConversationId());
  }, [dispatch, userDetails, _userDetails]);

  useEffect(() => {
    const member_ids = [userDetails?.id, _userDetails?.id];
    const formData = new FormData();
    member_ids.forEach((member) => formData.append("member_ids", member));
    dispatch(conversing({ formData }));
  }, []);

  useEffect(() => {
    dispatch(
      getUserPostHistory({
        user_id: _userDetails?.id,
        offset: pageNumber,
        limit: 10,
      })
    )
      .unwrap()
      .then(() => {
        isFetchingRef.current = false;
      })
      .catch(() => {
        isFetchingRef.current = false;
      });
  }, [dispatch, _userDetails?.id, pageNumber]);

  const lastPostRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreUserPostHistory &&
          !isFetchingRef
        ) {
          isFetchingRef.current = true;
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMoreUserPostHistory]
  );

  useEffect(() => {
    let searchedData;
    searchedData = searchTerm
      ? userPostHistory?.filter(
          (st) =>
            st.username
              ?.toLocaleLowerCase()
              ?.includes(searchTerm.toLocaleLowerCase()) ||
            st.content
              ?.toLocaleLowerCase()
              ?.includes(searchTerm.toLocaleLowerCase())
        )
      : userPostHistory;
    setFilteredData(searchedData);
  }, [searchTerm, userPostHistory]);

  const reloadAction = () => {
    getUserPostHistory({
      user_id: _userDetails?.id,
      offset: pageNumber,
      limit: 10,
    })
      .then(() => {
        isFetchingRef.current = false;
      })
      .catch(() => {
        isFetchingRef.current = false;
      });
  };

  useEffect(() => {
    itemRefs.current.forEach((el) => {
      el?.classList.remove("visible-post", "visible-post-next");
    });
    onVideoReach(itemRefs);
    onImageReach(itemRefs);
  }, [scrolling, userPostHistory]);

  function onImageReach(itemRefs) {
    const visibleItems = itemRefs.current.filter((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= window.innerHeight / 10 && rect.bottom <= window.innerHeight
      );
    });

    const postIds = visibleItems
      .map((el) =>
        el.querySelector(".post")?.getAttribute("id")?.replace("post-", "")
      )
      .filter(Boolean);

    postIds.forEach((id) => {
      const currentImage = document.querySelector(`#post-${id} img`);
      if (currentImage) {
        currentImage.style.display = "flex";
      }
    });
  }

  function onVideoReach(itemRefs) {
    const visibleItem = itemRefs.current.find((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= window.innerHeight / 10 && rect.bottom <= window.innerHeight
      );
    });

    if (!visibleItem) return;

    const postId = visibleItem.querySelector(".post")?.id?.replace("post-", "");
    if (!postId) return;

    const isVideoPost = userPostHistory.find(
      (p) => p.post_id === postId && p.has_video
    );
    if (!isVideoPost) return;

    // Pause previously playing video
    if (visiblePostId && visiblePostId !== postId) {
      const prev = document.querySelector(`#post-${visiblePostId} video`);

      if (prev) prev.pause();
    }

    const currentVideo = document.querySelector(`#post-${postId} video`);

    if (currentVideo) {
      currentVideo.play().catch((err) => console.warn("Autoplay failed:", err));
    }
    setVisiblePostId(postId);
  }

  if (userPostHistoryStatus === "loading") {
    return (
      <p className="circular__progress">
        <CircularProgress />
      </p>
    );
  }

  return (
    <Header
      status={userPostHistoryStatus}
      allowedSearch={true}
      name={"Posts"}
      setScroll={setScroll}
      reloadAction={reloadAction}
      searchTerm={searchTerm}
      userDetailComponent={
        <>
          <UserInfo
            _userDetails={_userDetails}
            _conversation_id={_conversation_id}
            _userDetailsStatus={_userDetailsStatus}
          />
        </>
      }
      setSearchTerm={setSearchTerm}
      feedRef={feedRef}
      children={
        <Box>
          {filteredData?.length === 0 ? (
            <p style={{ padding: "1rem", color: "#555" }}>No posts yet.</p>
          ) : (
            filteredData.map((post, index) => {
              const isLast = index === userPostHistory.length - 1;
              return (
                <div
                  key={index}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                    if (isLast) lastPostRef(el);
                  }}
                >
                  <Post post={post} />
                </div>
              );
            })
          )}
        </Box>
      }
    />
  );
}

export default UserFeed;
