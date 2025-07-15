import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Messages.css";
import { useDispatch, useSelector } from "react-redux";
import Chat from "../Chat/Chat";
import { useOutletContext } from "react-router-dom";
import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../Header/Header";
import MessagedUsersList from "./MessagedUsersList";
import { getMessagedUsers } from "../../Features/MessageSlice";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ComponentStack from "../HandleStack/HandleStack";

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
    formData.append("user_id", localStorage.getItem("cc_ft"));
    dispatch(getMessagedUsers({ formData }));
  }, []);

  const reloadAction = () => {
    const formData = new FormData();
    formData.append("user_id", localStorage.getItem("cc_ft"));
    dispatch(getMessagedUsers({ formData }));
  };

  useEffect(() => {
    let searchedData;
    searchedData = searchTerm
      ? users?.filter((st) =>
          st?.userName
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase())
        )
      : users;
    setFilteredData(searchedData);
  }, [searchTerm, users]);

  const handleCreateGroup = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("CreateGroup", {});
  };

  return (
    <Header
      // icons={[
      //   { icon: <GroupsOutlinedIcon key="group" />, action: handleCreateGroup },
      // ]}
      status={getMessagedUsersStatus}
      allowedSearch={true}
      name={"Messages"}
      reloadAction={reloadAction}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      children={<MessagedUsersList users={filteredData} />}
    />
  );
}

export default Messages;
