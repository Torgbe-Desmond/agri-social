import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Chat from "../Chat/Chat";
import { useOutletContext } from "react-router-dom";
import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../Header/Header";
import MessagedUsersList from "./MessagedUsersList";
import { clearGroups, getGroupConversation } from "../../Features/MessageSlice";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ComponentStack from "../HandleStack/HandleStack";
import GroupMessageList from "../GroupMesageList/GroupMesageList";
import { useGetGroupConversationQuery } from "../../Features/messageApi";

function GroupMessages() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, refetch, errro } =
    useGetGroupConversationQuery();
  // const { groups, getGroupConversationStatus } = useSelector(
  //   (state) => state.message
  // );

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

  const groups = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const reloadAction = () => {
    refetch();
  };

  useEffect(() => {
    let searchedData;
    searchedData = searchTerm
      ? groups?.filter((st) =>
          st?.group_name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        )
      : groups;
    setFilteredData(searchedData);
  }, [searchTerm, groups]);

  const handleCreateGroup = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("CreateGroup", {});
  };

  return (
    <Header
      icons={[
        { icon: <GroupsOutlinedIcon key="group" />, action: handleCreateGroup },
      ]}
      status={isLoading}
      allowedSearch={true}
      reloadAction={reloadAction}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      children={<GroupMessageList groups={filteredData} />}
    />
  );
}

export default GroupMessages;
