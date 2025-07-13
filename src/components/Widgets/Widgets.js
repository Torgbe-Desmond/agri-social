import "./Widgets.css";
import {
  TwitterTimelineEmbed,
  TwitterShareButton,
  TwitterTweetEmbed,
} from "react-twitter-embed";
import SearchIcon from "@mui/icons-material/Search";
import { Box, List, ListItem, ListItemText, TextField } from "@mui/material";
import {
  clearSearch,
  searchUser,
  selectedItem,
} from "../../Features/SearchSlice";
import { popComponent } from "../../Features/StackSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const style = {
  // position: "absolute",
  // top: "30%",
  // right: "0",
  // transform: "translate(-50%, -50%)",
  width: "100%",
  // bgcolor: "background.paper",
  boxSizing: "border-box",
  // boxShadow: 1,
  gap: 1,
  // p: 1,

  maxHeight: "80vh",
  overflowY: "auto",
};

function Widgets() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchedUserDetails } = useSelector((state) => state.search);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    dispatch(popComponent());
  };

  useEffect(() => {
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

  const handleNavigateToProfile = (user_id) => {
    navigate(`/user/${user_id}`);
    setSearchTerm("");
  };

  const filteredData = searchedUserDetails.filter((item) =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      className="widgets"
    >
      <Box
        sx={{ bgcolor: "background.paper", border: "1px solid #ccc" }}
        className="widgets__input"
      >
        <SearchIcon className="widgets__searchIcon" />
        <TextField
          placeholder="What's happening?"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          inputProps={{ "aria-label": "search" }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "transparent",
              },
              "&.Mui-focused fieldset": {
                borderColor: "transparent",
              },
            },
          }}
        />{" "}
      </Box>

      <div className="widgets__widgetContainer">
        <h2>What's happening</h2>

        <Box sx={style}>
          {/* <SearchItem
            customWidth={"35ch"}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          /> */}
          <List>
            {filteredData.map((item) => (
              <ListItem
                key={item.id}
                divider
                className="search-result-item"
                onClick={() => handleNavigateToProfile(item?.id)}
              >
                <img
                  src={item?.user_image || "/default-profile.png"}
                  alt={item?.username}
                  className="search-result-avatar"
                />
                <ListItemText primary={item?.username} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* <TwitterTweetEmbed tweetId={"858551177860055040"} /> */}

        {/* <TwitterTimelineEmbed
          sourceType="profile"
          screenName="cleverqazi"
          options={{ height: 400 }}
        />

        <TwitterShareButton
          url={"https://facebook.com/cleverprogrammer"}
          options={{ text: "#reactjs is awesome", via: "cleverqazi" }}
        /> */}
      </div>
    </Box>
  );
}

export default Widgets;
