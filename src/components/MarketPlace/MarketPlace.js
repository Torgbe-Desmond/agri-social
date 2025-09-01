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
import ErrorInfoAndReload from "../Errors/ErrorInfoAndReload";
import Container from "../Container/Container";
import ContainerTitle from "../Container/ContainerTitle";
import ContainerSearch from "../Container/ContainerSearch";

function MarketPlace() {
  const observer = useRef();
  const [pageNumber, setPageNumber] = useState(1);
  const { darkMode, systemPrefersDark } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const { products: productsData } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const { data, isFetching, isLoading, refetch, isError } = useGetProductsQuery(
    {
      offset: pageNumber,
      limit: 10,
    }
  );

  const products = useMemo(() => {
    return Array.isArray(data?.products) ? data.products : [];
  }, [data]);

  const hasMore = products.length === 10 && products.length > 0;

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
    <Box className="container">
      <Container>
        <ContainerTitle title={"Market Place"} />
        <ContainerSearch
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          placeholder={"Search products"}
        />
      </Container>
      <Box sx={{ padding: 1 }} className="market-place">
        {filteredData.map((product, index) => {
          const isLast = index === productsData.length - 1;
          return (
            <Box key={product.id || index} ref={isLast ? lastProductRef : null}>
              <ProductCard {...product} />
            </Box>
          );
        })}
      </Box>
      {isError && (
        <ErrorInfoAndReload
          setFetchError={setFetchError}
          isError={fetchError}
          isLoading={isLoading}
          isFetching={isFetching}
          refetch={refetch}
        />
      )}
    </Box>
  );
}

export default MarketPlace;
