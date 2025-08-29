import React, { useEffect, useMemo, useRef, useState } from "react";
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
import Container from "../../components/Container/Container";
import ContainerTitle from "../../components/Container/ContainerTitle";
import ContainerSearch from "../../components/Container/ContainerSearch";
import PredictionCard from "../../components/PredictionCard/PredictionCard";
import { updatePredictionList } from "../../Features/PredictionSlice";

function Predictions() {
  const { userDetails } = useSelector((state) => state.auth);
  const { prediction } = useSelector((state) => state.prediction);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [scrolling, setScroll] = useState(0);
  const [fetchError, setFetchError] = useState(false);

  const lastScrollTop = useRef(0);
  const predictionRef = useRef(null);

  const { data, isLoading, isFetching, isError, refetch, error } =
    useGetPredictionsQuery();

  const predictionData = useMemo(() => {
    return Array.isArray(data?.predictions) ? data.predictions : [];
  }, [data]);

  console.log("error", error);


  const hasMore = predictionData?.length > 0;

  useEffect(() => {
    setFetchError(isError);
  }, [isError]);

  useEffect(() => {
    if (predictionData?.length > 0) {
      dispatch(updatePredictionList({ predictionData }));
    }
  }, [predictionData, dispatch]);

  // Scroll tracking (optional logic)
  useEffect(() => {
    const scrollContainer = predictionRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setScroll((prev) => prev + 1);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const searchedData = searchTerm
      ? prediction?.filter((item) =>
          item.prediction_label
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : prediction;
    setFilteredData(searchedData);
  }, [searchTerm, prediction]);

  return (
    <Box className="container" ref={predictionRef}>
      <Container>
        <ContainerTitle title={"Predictions"} />
        <ContainerSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search predictions"
        />
      </Container>

      <Box sx={{ p: 1 }} className="scrolling-component">
        {filteredData?.length > 0 &&
          filteredData.map(
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
                key={id}
                userDetails={userDetails}
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
      </Box>

      <ErrorInfoAndReload
        setFetchError={setFetchError}
        isError={fetchError}
        isLoading={isLoading}
        isFetching={isFetching}
        refetch={refetch}
      />
    </Box>
  );
}

export default Predictions;
