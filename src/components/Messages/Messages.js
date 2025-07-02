import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Messages.css";
import { useDispatch, useSelector } from "react-redux";
import Chat from "../Chat/Chat";
import { useOutletContext } from "react-router-dom";
import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../Header/Header";
import MessagedUsersList from "../MessagedUsersList/MessagedUsersList";
import { getMessagedUsers } from "../../Features/MessageSlice";

function Messages() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { userDetails } = useSelector((state) => state.auth);
  const { users, getMessagedUsersStatus } = useSelector(
    (state) => state.message
  );

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

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    const formData = new FormData();
    formData.append("user_id", userDetails?.id);
    dispatch(getMessagedUsers({ formData }));
  }, []);

  useEffect(() => {
    let searchedData;
    searchedData = searchTerm
      ? users?.filter((st) =>
          st.userName
            ?.toLocaleLowerCase()
            ?.includes(searchTerm.toLocaleLowerCase())
        )
      : users;
    setFilteredData(searchedData);
  }, [searchTerm, users]);

  return (
    <Header
      status={getMessagedUsersStatus}
      name={"Messages"}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      children={<MessagedUsersList users={filteredData} />}
    />
  );
}

export default Messages;
