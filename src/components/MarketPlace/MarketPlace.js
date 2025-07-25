import {
  Box,
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import "./MarketPlace.css";
import ProductCard from "../ProductCard/ProductCard";
import SearchIcon from "@mui/icons-material/Search";
import {
  clearProducts,
  fetchProducts,
  searchProducts,
} from "../../Features/ProductSlice";
import ComponentStack from "../HandleStack/HandleStack";
import Header from "../Header/Header";

function MarketPlace() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const { products, hasMore, loading, searchResults, searchResultsStatus } =
    useSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProducts({ offset: pageNumber, limit: 6 }));
  }, [pageNumber]);

  useEffect(() => {
    return () => dispatch(clearProducts());
  }, []);

  const lastProductRef = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  // useEffect(() => {
  //   if (!searchTerm) return;
  //   const delayDebounce = setTimeout(() => {
  //     dispatch(searchProducts({ query: searchTerm }));
  //   }, 800);

  //   return () => {
  //     clearTimeout(delayDebounce);
  //   };
  // }, [searchTerm, dispatch]);

  const handleSearchProduct = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("SearchModal", {});
  };

  const reloadAction = () => {
    dispatch(fetchProducts({ offset: pageNumber, limit: 6 }));
  };

  return (
    <Header
      status={loading}
      allowedSearch={true}
      reloadAction={reloadAction}
      name={"Market Place"}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      children={
        <Box sx={{ padding: 3 }} className="market__place">
          <Grid
            container
            sx={{
              width: "100%",
              justifyContent: "center",
            }}
            spacing={3}
          >
            {products.map((product, index) => {
              const isLast = index === products.length - 1;
              return (
                <Grid
                  sx={{
                    height: "auto",
                    boxSizing: "border-box",
                  }}
                  key={index}
                  ref={isLast ? lastProductRef : null}
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  lg={3}
                >
                  <ProductCard {...product} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      }
    />
  );
}

export default MarketPlace;
