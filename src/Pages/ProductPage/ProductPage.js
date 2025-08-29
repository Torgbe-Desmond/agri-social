import ProductHeader from "../../components/ProductHeader/ProductHeader ";
import ProductImageCarousel from "../../components/ProductImageCarossel/ProductImageCarossel";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import ReviewInputBar from "../../components/ReviewInputBar/ReviewInputBar";
import { Box, CircularProgress } from "@mui/material";

const ProductPage = ({
  handleGoBack,
  isLoading,
  isFetching,
  imagesArray,
  selectedIndex,
  handlePrev,
  handleNext,
  setSelectedIndex,
  product,
  setReview,
  systemPrefersDark,
}) => {
  return (
    <Box className="profile">
      <ProductHeader handleGoBack={handleGoBack} />

      {isLoading || isFetching ? (
        <div className="product_progress">
          <CircularProgress />
        </div>
      ) : (
        <>
          <ProductImageCarousel
            imagesArray={imagesArray}
            selectedIndex={selectedIndex}
            handlePrev={handlePrev}
            handleNext={handleNext}
            setSelectedIndex={setSelectedIndex}
          />
          <ProductInfo product={product} />
        </>
      )}

      <ReviewInputBar
        setReview={setReview}
        systemPrefersDark={systemPrefersDark}
      />
    </Box>
  );
};

export default ProductPage;
