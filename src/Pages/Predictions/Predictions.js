import React, { useEffect, useRef, useState } from "react";
import "./Predictions.css";
import { useOutletContext } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Header from "../../components/Header/Header";
import PredictionHeader from "./PredictionHeader";
import PredictionList from "./PredictionList";
import { useDispatch, useSelector } from "react-redux";
import { setScrolling } from "../../Features/StackSlice";
import { useGetPredictionsQuery } from "../../Features/predictionApi";
import ErrorInfoAndReload from "../../components/Errors/ErrorInfoAndReload";

function Predictions() {
  const { user_id, systemPrefersDark, user } = useOutletContext();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [scrolling, setScroll] = useState(0);
  const lastScrollTop = useRef(0);

  const { data, isLoading, isFetching, isError, refetch, error } =
    useGetPredictionsQuery();

  useEffect(() => {
    dispatch(setScrolling(true));
    return () => dispatch(setScrolling(false));
  }, []);

  // Scroll tracking (optional logic)
  useEffect(() => {
    const scrollContainer = document.querySelector(".resuable");
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      setScroll((prev) => prev + 1);
      lastScrollTop.current = scrollTop;
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const searchedData = searchTerm
      ? data?.predictions.filter((item) =>
          item.prediction_label
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : data?.predictions;
    setFilteredData(searchedData);
  }, [searchTerm, data?.predictions]);

  return (
    <Box className="predictions">
      <PredictionHeader
        systemPrefersDark={systemPrefersDark}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <PredictionList
        predictionStatus="succeeded"
        filteredData={filteredData}
        userDetails={user}
      />
      <ErrorInfoAndReload
        isLoading={isLoading}
        isFetching={isFetching}
        refetch={refetch}
      />
    </Box>
  );
}

export default Predictions;
