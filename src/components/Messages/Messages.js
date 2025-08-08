import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Messages.css";
import { useDispatch, useSelector } from "react-redux";
import Chat from "../Chat/Chat";
import { useOutletContext } from "react-router-dom";
import Header from "../Header/Header";
import MessagedUsersList from "./MessagedUsersList";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ComponentStack from "../HandleStack/HandleStack";
import { useGetMessagedUsersQuery } from "../../Features/messageApi";
import { updateUsersList } from "../../Features/MessageSlice";

function Messages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { user_id, systemPrefersDark } = useOutletContext();
  const dispatch = useDispatch();

  // Call RTK Query hook
  const { data, isLoading, isFetching, isSuccess, refetch, error } =
    useGetMessagedUsersQuery();

  const users = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  useEffect(() => {
    if (users?.length > 0) {
      dispatch(updateUsersList({ users }));
    }
  }, [users]);

  useEffect(() => {
    let searchedData = searchTerm
      ? users?.filter((st) =>
          st?.userName?.toLowerCase()?.includes(searchTerm.toLowerCase())
        )
      : users;
    setFilteredData(searchedData);
  }, [searchTerm, users]);

  const reloadAction = () => {
    refetch();
  };

  return (
    <Header
      status={isLoading ? "loading" : "succeeded"}
      allowedSearch={true}
      reloadAction={reloadAction}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      children={<MessagedUsersList users={filteredData} />}
    />
  );
}

export default Messages;
