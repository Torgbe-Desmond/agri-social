import React, { useMemo, useState } from "react";
import { useGetGroupConversationQuery } from "../../Features/messageApi";
import Container from "../Container/Container";
import ContainerTitle from "../Container/ContainerTitle";
import { Box } from "@mui/material";
import GroupConversations from "../GroupConversations/GroupConversations";
import ContainerActions from "../Container/ContainerActions";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import ComponentStack from "../HandleStack/HandleStack";
import ErrorInfoAndReload from "../Errors/ErrorInfoAndReload";

function ConversationGroup() {
  const { data, isLoading, isError, isFetching, refetch } =
    useGetGroupConversationQuery();
  const dispatch = useDispatch();
  const [fetchError, setFetchError] = useState(false);

  const groupData = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const updateProfileImage = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("CreateGroup", {});
  };

  return (
    <Box className="conversations">
      <Container>
        <ContainerTitle title="Group Chat" />
        <ContainerActions
          icons={[
            {
              icon: <AddIcon key="create-group" />,
              action: updateProfileImage,
            },
          ]}
        />
      </Container>
      <GroupConversations groups={groupData} />
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

export default ConversationGroup;
