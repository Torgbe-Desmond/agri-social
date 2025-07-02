import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../../Features/ProductSlice";
import { popComponent } from "../../Features/StackSlice";

const modalStyle = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  maxHeight: "80vh",
  overflowY: "auto",
  zIndex: 1300,
};

function SearchModal() {
  const [searchTerm, setSearchTerm] = useState("");
  const [queriedData, setQueriedData] = useState([]);
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.product);

  const handleClose = () => {
    dispatch(popComponent());
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setQueriedData([]);
        return;
      }
      dispatch(searchProducts({ query: searchTerm }));
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm, dispatch]);

  useEffect(() => {
    setQueriedData(searchResults);

    return () => setQueriedData([]);
  }, [searchResults]);

  return (
    <Box>
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="search-modal"
        aria-describedby="modal-search-field"
        disableAutoFocus
      >
        <Box sx={modalStyle}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Search</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Modal Input */}
          <TextField
            fullWidth
            label="Type your query..."
            variant="outlined"
            autoFocus
            sx={{ mt: 2, mb: 2 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Search Results List */}
          <List>
            {queriedData.map((item) => (
              <ListItem key={item.id} divider sx={{ cursor: "pointer" }}>
                <ListItemText primary={item?.title} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </Box>
  );
}

export default SearchModal;
