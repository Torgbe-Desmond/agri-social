import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import "./UserProducts.css";

import Header from "../Header/Header";
import LocalProductCard from "../LocalProductCard/LocalProductCard";
import ComponentStack from "../HandleStack/HandleStack";
import { useGetProductsQuery } from "../../Features/productApi";
import { updateLocalProductList } from "../../Features/ProductSlice";
import { useDispatch } from "react-redux";
import ErrorInfoAndReload from "../Errors/ErrorInfoAndReload";

function UserProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [scrolling, setScroll] = useState(0);
  const { user_id } = useOutletContext();
  const isMobile = useMediaQuery("(max-width:1000px)");
  const observer = useRef();
  const dispatch = useDispatch();

  // 🔍 Fetch user-specific products
  const { data, isLoading, isFetching, refetch } = useGetProductsQuery({
    user_id,
  });

  const products = useMemo(() => {
    return Array.isArray(data?.products) ? data.products : [];
  }, [data]);

  useEffect(() => {
    if (Array.isArray(products)) {
      dispatch(updateLocalProductList({ products }));
    }
  }, [dispatch, products]);

  // 🔍 Log to verify structure (remove in production)
  useEffect(() => {
    console.log("User products API response:", data);
  }, [data]);

  // 🔍 Search logic (safe)
  useEffect(() => {
    const searched = searchTerm
      ? products.filter((p) =>
          p.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : products;
    setFilteredData(searched);
  }, [searchTerm, products]);

  // ➕ Handle "Create Product" click
  const handleCreateProduct = () => {
    const stack = new ComponentStack();
    stack.handleStack("CreateProduct", {});
  };

  // 🔁 Refresh handler
  const reloadAction = () => {
    refetch();
  };

  return (
    <Header
      icons={[
        {
          icon: <AddOutlinedIcon key="product" />,
          action: handleCreateProduct,
        },
      ]}
      status={isLoading || isFetching}
      allowedSearch
      name="Products"
      reloadAction={reloadAction}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      setScroll={setScroll}
    >
      <Box sx={{ padding: 3 }} className="user__products">
        {Array.isArray(filteredData) && filteredData.length > 0 ? (
          filteredData.map((product, index) => (
            <LocalProductCard {...product} key={product.post_id || index} />
          ))
        ) : (
          <p style={{ padding: "1rem", color: "#777" }}>No products found.</p>
        )}
      </Box>
      <ErrorInfoAndReload
        isLoading={isLoading}
        isFetching={isFetching}
        refetch={refetch}
      />
    </Header>
  );
}

export default UserProducts;
