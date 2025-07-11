import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Predictions.css";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PredictionCard from "../../components/PredictionCard/PredictionCard";
import { getPredictions } from "../../Features/PredictionSlice";
import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../components/Header/Header";
import { setScrolling } from "../../Features/StackSlice";

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
    <Header
      name={"Predictions"}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      status={predictionStatus}
      children={
        <div className="predictions__holder">
          {filteredData.length > 0 &&
            filteredData?.map(
              ({
                created_at,
                user_id,
                generated_name,
                confidence,
                prediction_label,
                image_url,
                id,
              }) => (
                <PredictionCard
                  userDetails={userDetails}
                  key={id}
                  created_at={created_at}
                  user_id={user_id}
                  generated_name={generated_name}
                  confidence={confidence}
                  prediction_label={prediction_label}
                  image_url={image_url}
                  id={id}
                />
              )
            )}
        </div>
      }
    />
  );
}

export default Predictions;
