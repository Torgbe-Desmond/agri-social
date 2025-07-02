import { Box, Grid, TextField, useMediaQuery } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import "./UserProducts.css";
import ProductCard from "../ProductCard/ProductCard";
import SearchIcon from "@mui/icons-material/Search";
import OnlinePredictionOutlinedIcon from "@mui/icons-material/OnlinePredictionOutlined";
import StatusIcons from "../StatusIcons/StatusIcons";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LocalProductCard from "../LocalProductCard/LocalProductCard";
import ComponentStack from "../HandleStack/HandleStack";
import { clearProducts, fetchUserProducts } from "../../Features/ProductSlice";
import { popComponent } from "../../Features/StackSlice";

function UserProducts() {
  const [tabIndex, setTabIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();
  const dispatch = useDispatch();
  const { user_id, darkMode, systemPrefersDark } = useOutletContext();
  const isMobile = useMediaQuery("(max-width:1000px)");
  const { userDetails } = useSelector((state) => state.auth);
  const { products, hasMore, loading } = useSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(fetchUserProducts({ user_id: userDetails?.id }));
  }, [userDetails]);

  const handleCreateProduct = () => {
    const stack = new ComponentStack(dispatch);
    stack.handleStack("CreateProduct", {});
  };

  useEffect(() => {
    let searchedData;
    searchedData = searchTerm
      ? products?.filter((st) =>
          st.title
            ?.toLocaleLowerCase()
            ?.includes(searchTerm.toLocaleLowerCase())
        )
      : products;
    setFilteredData(searchedData);
  }, [searchTerm, products]);

  return (
    <Box
      sx={{
        ...(systemPrefersDark ? darkMode : {}),
        padding: 3,
      }}
      className="market__place"
    >
      <Box className="market__header">
        <div className="user__actions">
          <StatusIcons
            icon={
              <AddOutlinedIcon onClick={handleCreateProduct} fontSize="small" />
            }
          />
        </div>
        <Box
          sx={{ bgcolor: "background.paper", border: "1px solid #ccc" }}
          className="user__products__input"
        >
          <SearchIcon className="market_place__searchIcon" />
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          />{" "}
        </Box>
      </Box>
      <Grid container spacing={3}>
        {filteredData?.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <LocalProductCard {...product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default UserProducts;
