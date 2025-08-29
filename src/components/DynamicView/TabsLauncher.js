import React, { useState } from "react";
import { Box, Button, Paper, Typography, useTheme } from "@mui/material";
import { Rnd } from "react-rnd";

// Import your real components
import PostHistory from "../../components/PostHistory/PostHistory";
import Group from "../../components/Group/Group";
import Profile from "../../Pages/Profile/Profile";
import Messages from "../Messages/Messages";
import PostComment from "../../components/PostComment/PostComment";
import CommentReplies from "../../components/Comment/CommentReplies";
import Chat from "../Chat/Chat";

const allComponents = [
  {
    label: "Post History",
    id: "postHistory",
    component: <PostHistory />,
    stack: [
      { id: "postComment", label: "Post Comment", component: <PostComment /> },
      //   {
      //     id: "commentReplies",
      //     label: "Comment Replies",
      //     component: <CommentReplies />,
      //   },
    ],
  },
  {
    label: "Groups",
    id: "groups",
    component: <Group />,
    stack: [],
  },
  {
    label: "Messages",
    id: "Messages",
    component: <Messages />,
    stack: [
      { id: "chat", label: "Chat Messages", component: <Chat /> },
    ],
  },
  {
    label: "Profile",
    id: "profile",
    component: <Profile />,
    stack: [],
  },
];

function TabsLauncher() {
  const theme = useTheme();
  const [selectedComponents, setSelectedComponents] = useState([]);

  // Select or remove a component from the desktop
  const handleSelect = (id) => {
    if (selectedComponents.find((c) => c.rootId === id)) {
      setSelectedComponents((prev) => prev.filter((c) => c.rootId !== id));
    } else {
      const compDef = allComponents.find((c) => c.id === id);
      setSelectedComponents((prev) => [
        ...prev,
        {
          rootId: compDef.id,
          title: compDef.label,
          runtimeStack: [compDef.component], // first element is always the root
          position: { x: 50 + prev.length * 30, y: 50 + prev.length * 30 },
          size: { width: 400, height: 500 },
        },
      ]);
    }
  };

  // Open a child component in the same window
  const openChild = (rootId, childId) => {
    setSelectedComponents((prev) =>
      prev.map((win) => {
        if (win.rootId === rootId) {
          const rootDef = allComponents.find((ac) => ac.id === rootId);
          const childDef = rootDef.stack.find((s) => s.id === childId);
          if (childDef) {
            return {
              ...win,
              title: childDef.label,
              runtimeStack: [...win.runtimeStack, childDef.component],
            };
          }
        }
        return win;
      })
    );
  };

  // Go back in runtime stack
  const goBack = (rootId) => {
    setSelectedComponents((prev) =>
      prev.map((win) => {
        if (win.rootId === rootId && win.runtimeStack.length > 1) {
          const newStack = [...win.runtimeStack];
          newStack.pop();
          return {
            ...win,
            runtimeStack: newStack,
          };
        }
        return win;
      })
    );
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      {/* Toolbar */}
      <Box sx={{ display: "flex", gap: 1, p: 1 }}>
        {allComponents.map((tab) => {
          const isActive = selectedComponents.some((c) => c.rootId === tab.id);
          return (
            <Button
              key={tab.id}
              variant={isActive ? "contained" : "outlined"}
              onClick={() => handleSelect(tab.id)}
              size="small"
            >
              {tab.label}
            </Button>
          );
        })}
      </Box>

      {/* Floating windows */}
      {selectedComponents.map((win) => {
        const rootDef = allComponents.find((ac) => ac.id === win.rootId);
        return (
          <Rnd
            key={win.rootId}
            size={{ width: win.size.width, height: win.size.height }}
            position={{ x: win.position.x, y: win.position.y }}
            onDragStop={(e, d) => {
              setSelectedComponents((prev) =>
                prev.map((w) =>
                  w.rootId === win.rootId
                    ? { ...w, position: { x: d.x, y: d.y } }
                    : w
                )
              );
            }}
            onResizeStop={(e, dir, ref, delta, pos) => {
              setSelectedComponents((prev) =>
                prev.map((w) =>
                  w.rootId === win.rootId
                    ? {
                        ...w,
                        size: {
                          width: parseInt(ref.style.width, 10),
                          height: parseInt(ref.style.height, 10),
                        },
                        position: pos,
                      }
                    : w
                )
              );
            }}
          >
            <Paper
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: theme.palette.background.paper + "CC",
                backdropFilter: "blur(6px)",
              }}
            >
              {/* Window Header */}
              <Box
                sx={{
                  p: 1,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1">{win.title}</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {win.runtimeStack.length > 1 && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => goBack(win.rootId)}
                    >
                      Back
                    </Button>
                  )}
                  {rootDef.stack.map((child) => (
                    <Button
                      key={child.id}
                      size="small"
                      variant="outlined"
                      onClick={() => openChild(win.rootId, child.id)}
                    >
                      {child.label}
                    </Button>
                  ))}
                </Box>
              </Box>

              {/* Window Content */}
              <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
                {win.runtimeStack[win.runtimeStack.length - 1]}
              </Box>
            </Paper>
          </Rnd>
        );
      })}
    </Box>
  );
}

export default TabsLauncher;
