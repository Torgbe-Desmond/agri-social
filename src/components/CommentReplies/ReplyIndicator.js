import { Box } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function ReplyIndicator() {
  return (
    <Box
      sx={{ borderBottom: 1, borderColor: "divider", p: 1 }}
      className="post__comment__replies"
    >
      <h2>
        Replies <KeyboardArrowDownIcon />
      </h2>
    </Box>
  );
}

export default ReplyIndicator;
