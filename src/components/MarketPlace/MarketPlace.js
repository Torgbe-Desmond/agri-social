import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import "./MarketPlace.css";

import ProductCard from "../ProductCard/ProductCard";
import Header from "../Header/Header";
import ComponentStack from "../HandleStack/HandleStack";
import { useGetProductsQuery } from "../../Features/productApi";
import { updateProductList } from "../../Features/ProductSlice";
import { useDispatch, useSelector } from "react-redux";

function MarketPlace() {
  const observer = useRef();
  const [pageNumber, setPageNumber] = useState(1);
  const { darkMode, systemPrefersDark } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { products: productsData } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const { data, isFetching, isLoading, refetch } = useGetProductsQuery({
    offset: pageNumber,
    limit: 10,
  });

  const products = useMemo(() => {
    return Array.isArray(data?.products) ? data.products : [];
  }, [data]);

  const hasMore = products.length > 0;

  useEffect(() => {
    if (Array.isArray(data?.products)) {
      dispatch(updateProductList({ products: data.products }));
    }
  }, [dispatch, data?.products]);

  useEffect(() => {
    let searchedData;
    searchedData = searchTerm
      ? productsData.filter((product) =>
          product.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : productsData;

    setFilteredData(searchedData);
  }, [searchTerm, productsData]);

  const lastProductRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const reloadAction = () => {
    refetch();
  };

  return (
    <Header
      status={isLoading}
      allowedSearch={true}
      reloadAction={reloadAction}
      name={"Market Place"}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      children={
        <Box sx={{ padding: 3 }} className="market__place">
          <Grid
            container
            sx={{ width: "100%", justifyContent: "center" }}
            spacing={3}
          >
            {filteredData.map((product, index) => {
              const isLast = index === productsData.length - 1;
              return (
                <Grid
                  key={product.id || index}
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
          {isFetching && (
            <p className="circular__progress">
              <CircularProgress size={24} />
            </p>
          )}
        </Box>
      }
    />
  );
}

export default MarketPlace;
