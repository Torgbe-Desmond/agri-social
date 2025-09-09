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
import { updateUsersInfo, updateUsersList } from "../../Features/MessageSlice";
import ErrorInfoAndReload from "../Errors/ErrorInfoAndReload";
import { useSocket } from "../Socket/Socket";
import Container from "../Container/Container";
import ContainerTitle from "../Container/ContainerTitle";
import { Box } from "@mui/material";
import ContainerSearch from "../Container/ContainerSearch";

function Messages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const socket = useSocket();
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      console.log("data", data);
      const message = {
        conversation_id: data?.conversation_id,
        last_message: data?.content,
        created_at: data?.created_at,
      };
      setMessages((prevMessage) =>
        prevMessage?.map((m) =>
          m.conversation_id === message?.conversation_id
            ? {
                ...m,
                last_message: message?.last_message,
                created_at: message?.created_at,
              }
            : m
        )
      );
    };

    socket.on("chat_response", handler);
    return () => {
      socket.off("chat_response", handler);
    };
  }, [socket]);

  // Call RTK Query hook
  const { data, isLoading, isFetching, isSuccess, refetch, error, isError } =
    useGetMessagedUsersQuery();

  const users = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  useEffect(() => {
    setFetchError(isError);
  }, [isError]);

  useEffect(() => {
    setMessages(users);
  }, [users]);

  useEffect(() => {
    if (users?.length > 0) {
      dispatch(updateUsersList({ users }));
    }
  }, [users]);

  useEffect(() => {
    let searchedData = searchTerm
      ? messages?.filter((st) =>
          st?.userName?.toLowerCase()?.includes(searchTerm.toLowerCase())
        )
      : messages;
    setFilteredData(searchedData);
  }, [searchTerm, messages]);

  const reloadAction = () => {
    refetch();
  };

  return (
    <Box>
      <Container>
        <ContainerTitle title="Messages" />
        <ContainerSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="search messages"
        />
      </Container>

      <MessagedUsersList users={filteredData} />
      {fetchError ||
        (isLoading && (
          <ErrorInfoAndReload
            setFetchError={setFetchError}
            isError={fetchError}
            refetch={refetch}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        ))}
    </Box>
  );
}

export default Messages;
