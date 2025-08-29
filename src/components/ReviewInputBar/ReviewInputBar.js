import { Box, TextField, IconButton } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

const ReviewInputBar = ({ setReview, systemPrefersDark }) => (
  <Box
    sx={{ p: 1 }}
    display="flex"
    position="sticky"
    bottom="0"
    zIndex="100"
    gap={1}
    alignItems="center"
    bgcolor={systemPrefersDark ? "background.paper" : "#FFF"}
    borderTop="1px solid #ddd"
  >
    <TextField
      fullWidth
      placeholder="Write a review..."
      size="small"
      multiline
      minRows={1}
      maxRows={3}
      onChange={(e) => setReview(e.target.value)}
    />
    <IconButton>
      <SendIcon />
    </IconButton>
  </Box>
);

export default ReviewInputBar