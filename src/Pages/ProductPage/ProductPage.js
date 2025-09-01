import React, { forwardRef } from "react";
import ProductImageCarousel from "../../components/ProductImageCarossel/ProductImageCarossel";
import ProductHeader from "../../components/ProductHeader/ProductHeader";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import ReviewInputBar from "../../components/ReviewInputBar/ReviewInputBar";
import { Box, CircularProgress } from "@mui/material";
import ReviewChat from "../../components/ReviewList/ReviewList";
import ErrorInfoAndReload from "../../components/Errors/ErrorInfoAndReload";
import "./ProductPage.css";

// Forward ref for ReviewChat to support IntersectionObserver
const ReviewChatWithRef = forwardRef(({ msg }, ref) => (
  <div ref={ref}>
    <ReviewChat msg={msg} />
  </div>
));

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
  reviewMessages,
  handleCreateReview,
  reviewsLoading,
  reviewsFetching,
  setFetchError,
  fetchError,
  reviewRefetch,
  reviewIsError,
  lastReviewRef,
  sendReviewLoading,
}) => {
  return (
    <Box className="product">
      {/* Product Header */}
      <ProductHeader handleGoBack={handleGoBack} />

      {/* Product Images & Info */}
      {isLoading || isFetching ? (
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: "8px",
            p: 2,
            m: 2,
          }}
        >
          Product is currently not available
        </Box>
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

      {/* Reviews Section */}
      <Box className="container">
        {reviewMessages?.map((msg, index) => {
          const isLast = index === reviewMessages.length - 1;
          return (
            <ReviewChatWithRef
              key={msg.id || index}
              msg={msg}
              ref={isLast ? lastReviewRef : null}
            />
          );
        })}

        {/* Loader for fetching more reviews */}
        {reviewsFetching && (
          <div className="circular-progress">
            <CircularProgress size={24} />
          </div>
        )}

        {/* Error component */}
        {reviewIsError && (
          <ErrorInfoAndReload
            setFetchError={() => {}}
            isError={reviewIsError}
            isLoading={reviewsLoading}
            isFetching={reviewsFetching}
            refetch={reviewRefetch}
          />
        )}
      </Box>

      {/* Review Input Bar */}
      <ReviewInputBar
        sendReviewLoading={sendReviewLoading}
        setReview={setReview}
        handleCreateReview={handleCreateReview}
        systemPrefersDark={systemPrefersDark}
      />
    </Box>
  );
};

export default ProductPage;
