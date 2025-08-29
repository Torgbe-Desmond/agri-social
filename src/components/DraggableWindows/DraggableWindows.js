import { useTheme, Box, Typography } from "@mui/material";
import { Rnd } from "react-rnd";
import {
  bringToFront,
  updateWindowPosition,
  updateWindowSizeAndPosition,
} from "../../Features/StackSlice";

function DraggableWindows({ stack, dispatch, componentMap }) {
  const theme = useTheme();

  return (
    <>
      {stack.map((item, index) => (
        <Rnd
          key={index}
          dragHandleClassName="tab-header"
          size={{
            width: item.size.width,
            height: item.size.height,
          }}
          position={{
            x: item.position.x,
            y: item.position.y,
          }}
          style={{ zIndex: item.zIndex }}
          onDragStop={(e, d) => {
            dispatch(updateWindowPosition({ index, x: d.x, y: d.y }));
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            dispatch(
              updateWindowSizeAndPosition({
                index,
                width: parseInt(ref.style.width, 10),
                height: parseInt(ref.style.height, 10),
                x: position.x,
                y: position.y,
              })
            );
          }}
          onMouseDown={() => {
            dispatch(bringToFront({ index }));
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              color: "text.primary",
              border: 1,
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              borderRadius: 1,
              boxShadow: theme.shadows[3],
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              className="tab-header"
              sx={{
                bgcolor: theme.palette.grey[900],
                color: theme.palette.common.white,
                px: 1,
                py: 0.5,
                cursor: "move",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" noWrap>
                {item?.props?.title || item.id}
              </Typography>
            </Box>

            {/* Body */}
            <Box
              sx={{
                flex: 1,
                bgcolor: "background.default",
                p: 1,
                overflow: "auto",
              }}
            >
              {item?.component}
              {/* Or use component map */}
              {/* {componentMap[item?.id]?.(item?.props)} */}
            </Box>
          </Box>
        </Rnd>
      ))}
    </>
  );
}

export default DraggableWindows;
