import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Predictions.css";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PredictionCard from "../../components/PredictionCard/PredictionCard";
import { getPredictions } from "../../Features/PredictionSlice";
import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../components/Header/Header";
import { setScrolling } from "../../Features/StackSlice";
import PredictionHeader from "./PredictionHeader";
import PredictionList from "./PredictionList";

function Predictions() {
  const { user_id } = useOutletContext();
  const { prediction, predictionStatus, deletePredictionStatus } = useSelector(
    (state) => state.prediction
  );
  const { userDetails } = useSelector((state) => state.auth);
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { darkMode, systemPrefersDark } = useOutletContext();
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolling, setScroll] = useState(0);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    dispatch(setScrolling(true));
    return () => dispatch(setScrolling(false));
  }, []);

  useEffect(() => {
    dispatch(getPredictions({ user_id }));
  }, [dispatch, user_id]);

  //   const lastPostRef = useCallback(
  //     (node) => {
  //       if (observer.current) observer.current.disconnect();
  //       observer.current = new IntersectionObserver((entries) => {
  //         if (entries[0].isIntersecting && hasMore) {
  //           setPageNumber((prev) => prev + 1);
  //         }
  //       });
  //       if (node) observer.current.observe(node);
  //     },
  //     [hasMore]
  //   );

  useEffect(() => {
    const scrollContainer = document.querySelector(".resuable");
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      setScroll((prev) => prev + 1);
      lastScrollTop.current = scrollTop;
      console.log("ddddd");
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  useEffect(() => {
    let searchedData;
    searchedData = searchTerm
      ? prediction?.filter((st) =>
          st.prediction_label
            ?.toLocaleLowerCase()
            ?.includes(searchTerm.toLocaleLowerCase())
        )
      : prediction;
    setFilteredData(searchedData);
  }, [searchTerm, prediction]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box className="predictions">
      <PredictionHeader
        systemPrefersDark={systemPrefersDark}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {predictionStatus === "loading" ? (
        <p className="circular__progress">
          <CircularProgress size={20} />
        </p>
      ) : (
        <PredictionList
          predictionStatus={predictionStatus}
          filteredData={filteredData}
          userDetails={userDetails}
        />
      )}

      {predictionStatus === "failed" && (
        <p className="circular__progress">
          {/* Error message or retry button */}
        </p>
      )}
    </Box>
  );
}

export default Predictions;
