import React, { useCallback, useEffect, useRef, useState } from "react";
import "./User.css";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Tab, Box, Typography, CircularProgress } from "@mui/material";
import UserInfo from "../../components/UserInfo/UserInfo";
import UserFeed from "../../components/UserFeed/UserFeed";
import { _getUser } from "../../Features/AuthSlice";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function User() {
  const { _user_id } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { _userDetails, _userDetailsStatus } = useSelector(
    (state) => state.auth
  );
  const { systemPrefersDark } = useOutletContext();
  const navigate = useNavigate();

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

  useEffect(() => {
    dispatch(_getUser({ user_id: _user_id }));
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div className="profile">
      <Box
        sx={{ bgcolor: systemPrefersDark && "background.paper" }}
        className="profile__header"
      >
        <h2>
          {" "}
          <ArrowBackIcon cursor="pointer" onClick={handleGoBack} />
          User
        </h2>

        <UserInfo
          _userDetails={_userDetails}
          _userDetailsStatus={_userDetailsStatus}
        />
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: "50px",
          }}
        >
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Posts" />
            <Tab label="Getto" />
          </Tabs>
        </Box>
      </Box>

      <Box
      // sx={{
      //   height: "calc(100vh - 250px)", // adjust based on your header height
      //   overflowY: "auto",
      // }}
      >
        {tabIndex === 0 && <UserFeed user_id={_userDetails?.id} />}
      </Box>
    </div>
  );
}

export default User;
