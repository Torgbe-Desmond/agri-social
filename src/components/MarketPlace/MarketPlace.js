import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import "./MarketPlace.css";

import ProductCard from "../ProductCard/ProductCard";
import { clearProducts, fetchProducts } from "../../Features/ProductSlice";
import ComponentStack from "../HandleStack/HandleStack";
import Header from "../Header/Header";

function MarketPlace() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();

  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const { products, hasMore, loading } = useSelector((state) => state.product);

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationId, setNotificationId] = useState(null);

  const openDeleteModal = (id) => {
    setNotificationId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setNotificationId(null);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    dispatch(fetchProducts({ offset: pageNumber, limit: 6 }));
  }, [pageNumber]);

  useEffect(() => {
    return () => dispatch(clearProducts());
  }, []);

  const lastProductRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const handleSearchProduct = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("SearchModal", {});
  };

  const reloadAction = () => {
    dispatch(fetchProducts({ offset: pageNumber, limit: 6 }));
  };

  return (
    <>
      <Header
        status={loading}
        allowedSearch={true}
        reloadAction={reloadAction}
        name={"Market Place"}
        searchTerm={""}
        setSearchTerm={() => {}}
        children={
          <Box sx={{ padding: 3 }} className="market__place">
            <Grid
              container
              sx={{ width: "100%", justifyContent: "center" }}
              spacing={3}
            >
              {products.map((product, index) => {
                const isLast = index === products.length - 1;
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
          </Box>
        }
      />
    </>
  );
}

export default MarketPlace;
