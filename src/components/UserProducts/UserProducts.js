import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditIcon from "@mui/icons-material/Edit";
import "./UserProducts.css";

import Header from "../Header/Header";
import LocalProductCard from "../LocalProductCard/LocalProductCard";
import ComponentStack from "../HandleStack/HandleStack";
import {
  useGetProductsQuery,
  useGetUserProductsQuery,
} from "../../Features/productApi";
import { updateLocalProductList } from "../../Features/ProductSlice";
import { useDispatch } from "react-redux";
import ErrorInfoAndReload from "../Errors/ErrorInfoAndReload";
import Container from "../Container/Container";
import ContainerTitle from "../Container/ContainerTitle";
import ContainerActions from "../Container/ContainerActions";

function UserProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [scrolling, setScroll] = useState(0);
  const { user_id } = useOutletContext();
  const isMobile = useMediaQuery("(max-width:1000px)");
  const observer = useRef();
  const [fetchError, setFetchError] = useState(false);
  const dispatch = useDispatch();

  // 🔍 Fetch user-specific products
  const { data, isLoading, isFetching, refetch, error, isError } =
    useGetUserProductsQuery();

  console.log("error", error);

  const products = useMemo(() => {
    return Array.isArray(data?.products) ? data.products : [];
  }, [data]);

  useEffect(() => {
    if (Array.isArray(products)) {
      dispatch(updateLocalProductList({ products }));
    }
  }, [dispatch, products]);

  useEffect(() => {
    setFetchError(isError);
  }, [isError]);

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
    const stack = new ComponentStack(dispatch);
    stack.handleStack("CreateProduct", {});
  };

  const handleEditUserProductInfo = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("SellerInfo", {});
  };
  // 🔁 Refresh handler
  const reloadAction = () => {
    refetch();
  };

  return (
    <Box>
      <Container>
        <ContainerTitle title="Products" />
        <ContainerActions
          icons={[
            {
              icon: <AddOutlinedIcon key="product" />,
              action: handleCreateProduct,
            },
            {
              icon: <EditIcon key="edit-product" />,
              action: handleEditUserProductInfo,
            },
          ]}
        />
      </Container>
      <Box sx={{ padding: 1 }} className="user__products">
        {Array.isArray(filteredData) &&
          filteredData.map((product, index) => (
            <LocalProductCard {...product} key={product.post_id || index} />
          ))}
      </Box>
      {fetchError ||
        (isLoading && (
          <ErrorInfoAndReload
            isError={fetchError}
            setFetchError={setFetchError}
            isLoading={isLoading}
            isFetching={isFetching}
            refetch={refetch}
          />
        ))}
    </Box>
  );
}

export default UserProducts;
