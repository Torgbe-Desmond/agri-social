import {
  Box,
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

function MarketPlace() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const { products, hasMore, loading, searchResults, searchResultsStatus } =
    useSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");

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
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    // p: 1,
    background: "#ccc",
    // maxHeight: "80vh",
    overflowY: "auto",
  };
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

  return (
    <Box
      sx={{
        padding: 3,
      }}
      className="market__place"
    >
      <Box className="market__place__header">
        <Box
          sx={{ bgcolor: "background.paper", border: "1px solid #ccc" }}
          className="market_place__input"
        >
          <SearchIcon
            cursor="pointer"
            className="widgets__searchIcon"
            // onClick={handleSearchProduct}
          />
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // onFocus={() => handleSearchProduct()}
            placeholder="Search for a product"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent",
                },
                "& .MuiInputBase-input": {
                  width: { xs: "100%", sm: "100%", md: "500px", lg: "500px" },
                  boxSizing: "border-box",
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent",
                },
              },
            }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {products.map((product, index) => {
          const isLast = index === products.length - 1;

          return (
            <Grid
              ref={isLast ? lastProductRef : null}
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={index}
            >
              <ProductCard {...product} />
            </Grid>
          );
        })}
      </Grid>
      {loading === "loading" && (
        <p className="circular__progress">
          <CircularProgress fontSize="small" />
        </p>
      )}
    </Box>
  );
}

export default MarketPlace;
