import { useEffect, useRef, useState } from "react";
import "./Bookmarks.css";
import { useDispatch, useSelector } from "react-redux";
import Saved from "../../components/Saved/Saved";
import { Box, CircularProgress } from "@mui/material";
import { getSavedHistory } from "../../Features/PostSlice";
import { useOutletContext } from "react-router-dom";
import Header from "../../components/Header/Header";
import { setScrolling } from "../../Features/StackSlice";

function Bookmarks() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { darkMode, systemPrefersDark } = useOutletContext();
  const [filteredData, setFilteredData] = useState([]);
  const { savedStatus, savedHistory } = useSelector((state) => state.post);
  const { userDetails } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(setScrolling(true));
    return () => dispatch(setScrolling(false));
  }, []);

  useEffect(() => {
    if (userDetails?.id) {
      dispatch(getSavedHistory({ user_id: userDetails.id }));
    }
  }, [dispatch, userDetails?.id]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    let searchedData;
    searchedData = searchTerm
      ? savedHistory?.filter(
          (st) =>
            st.content
              ?.toLocaleLowerCase()
              ?.includes(searchTerm.toLocaleLowerCase()) ||
            st.username
              ?.toLocaleLowerCase()
              ?.includes(searchTerm.toLocaleLowerCase())
        )
      : savedHistory;
    setFilteredData(searchedData);
  }, [searchTerm, savedHistory]);

  // if (savedStatus === "loading") {
  //   return (
  //     <p className="circular__progress">
  //       <CircularProgress />
  //     </p>
  //   );
  // }

  return (
    <Header
      searchTerm={searchTerm}
      name={"Bookmarks"}
      setSearchTerm={setSearchTerm}
      status={savedStatus}
      children={
        filteredData?.length === 0 && savedStatus === "rejected" ? (
          <p style={{ padding: "1rem", color: "#555" }}>No saved posts yet.</p>
        ) : (
          filteredData.map((saved) => (
            <Saved key={saved.id || saved._id} save={saved} />
          ))
        )
      }
    />
  );
}

export default Bookmarks;
