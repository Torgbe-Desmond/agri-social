import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import SearchItem from "../SearchItem/SearchItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import { popComponent } from "../../../Features/StackSlice";
import {
  clearSearch,
  searchUser,
  selectedItem,
} from "../../../Features/SearchSlice";
import handleStack from "../HandleStack/HandleStack";

const style = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "380px", sm: "400px", md: "500px" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
};

export default function SearchModal() {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const dispatch = useDispatch();
  const { searchedUserDetails } = useSelector((state) => state.search);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    dispatch(popComponent());
  };

  React.useEffect(() => {
    if (!searchTerm) return;
    const delayDebounce = setTimeout(() => {
      dispatch(searchUser({ username: searchTerm }));
    }, 800);

    return () => {
      clearTimeout(delayDebounce);
      dispatch(clearSearch());
    };
  }, [searchTerm, dispatch]);

  const handleSelect = (item) => {
    dispatch(selectedItem(item?.id));
    dispatch(popComponent());
  };

  const handleCardClick = (item) => {
    handleAction("CommentDrawer", { selectedItem: item });
  };

  const handleAction = React.useCallback(
    (actionType, props = {}) => {
      handleStack(actionType, dispatch, props);
    },
    [dispatch]
  );

  const filteredData = searchedUserDetails.filter((item) =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <SearchItem
            customWidth={"35ch"}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <List sx={{ pr: 4, pl: 4 }}>
            {filteredData.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemText
                  cursor="pointer"
                  // sx={{ cursor: "ponter", background:"red" }}
                  onClick={() => handleSelect(item)}
                  primary={item.username}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </div>
  );
}
