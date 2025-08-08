import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import GroupPost from "../Post/GroupPost";
import ComponentStack from "../HandleStack/HandleStack";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Header/Header";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
// import { clearGroups, getGroupConversation } from "../../Features/MessageSlice";

const Group = () => {
  const handleJoin = () => {
    alert("You joined the group!");
  };
  const dispatch = useDispatch();
  const [scrolling, setScroll] = useState();
  const { groups, getGroupConversationStatus } = useSelector(
    (state) => state.message
  );

  // const groups = [
  //   {
  //     id: 1,
  //     title: "React Developers",
  //     description: "A group for sharing React tips, tricks, and tutorials.",
  //     imageUrl: "https://source.unsplash.com/400x180/?reactjs",
  //   },
  //   {
  //     id: 2,
  //     title: "Node.js Enthusiasts",
  //     description: "Backend developers who love Node.js and Express.",
  //     imageUrl: "https://source.unsplash.com/400x180/?nodejs",
  //   },
  //   {
  //     id: 3,
  //     title: "UI/UX Designers",
  //     description: "People who love design systems and user experiences.",
  //     imageUrl: "https://source.unsplash.com/400x180/?design",
  //   },
  //   {
  //     id: 4,
  //     title: "Data Scientists",
  //     description: "ML, AI, and data lovers gather here.",
  //     imageUrl: "https://source.unsplash.com/400x180/?data",
  //   },
  // ];

  // useEffect(() => {
  //   const formData = new FormData();
  //   formData.append("user_id", localStorage.getItem("cc_ft"));
  //   dispatch(getGroupConversation({ formData }));

  //   return () => dispatch(clearGroups());
  // }, []);

  const handleCreateGroup = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("CreateGroup", {});
  };
  return (
    <Header
      icons={[
        { icon: <GroupsOutlinedIcon key="group" />, action: handleCreateGroup },
      ]}
      setScroll={setScroll}
      allowedSearch={false}
      children={
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {groups.map((group) => (
            <GroupPost
              title={group.title}
              description={group.description}
              imageUrl={group.imageUrl}
              onJoin={() => handleJoin(group.title)}
            />
          ))}
        </Box>
      }
    />
  );
};

export default Group;
