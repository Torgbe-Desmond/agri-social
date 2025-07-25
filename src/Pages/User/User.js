import React, { useCallback, useEffect, useRef, useState } from "react";
import "./User.css";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import UserInfo from "../../components/UserInfo/UserInfo";
import UserFeed from "../../components/UserFeed/UserFeed";
import { _getUser } from "../../Features/AuthSlice";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { clearConversationId, conversing } from "../../Features/MessageSlice";

function User() {
  const { _user_id } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { _userDetails, _userDetailsStatus, userDetails } = useSelector(
    (state) => state.auth
  );
  const { systemPrefersDark } = useOutletContext();
  const navigate = useNavigate();
  const { conversation_id } = useSelector((state) => state.message);

  const areConversingAlready = () => {};

  useEffect(() => {
    dispatch(_getUser({ user_id: _user_id }));
    return () => dispatch(clearConversationId());
  }, [dispatch]);

  useEffect(() => {
    const member_ids = [userDetails?.id, _userDetails?.id];
    const formData = new FormData();
    member_ids.forEach((member) => formData.append("member_ids", member));
    dispatch(conversing({ formData }));
  }, [dispatch, userDetails, _userDetails]);

  //   const lastPostRef = useCallback(
  //     (node) => {
  //       if (observer.current) observer.current.disconnect();
  //       observer.current = new IntersectionObserver((entries) => {
  //         if (entries[0].isIntersecting && hasMore) {
  //           setPageNumber((prev) => prev + 1);
  //         }
  //       });
  //       if (node) observer.current.observe(node);
  //     },
  //     [hasMore]
  //   );

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div className="posts">
      <UserFeed
        _userDetails={_userDetails}
        _conversation_id={conversation_id}
        _userDetailsStatus={_userDetailsStatus}
      />
    </div>
  );
}

export default User;
