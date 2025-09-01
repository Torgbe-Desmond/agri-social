import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  useCreateReviewMutation,
  useGetProductQuery,
  useGetReviewsQuery,
} from "../../Features/productApi";
import ProductPage from "../../Pages/ProductPage/ProductPage";

function ProductDetails() {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const { systemPrefersDark } = useOutletContext();

  // Product state
  const {
    data: product,
    isLoading,
    isFetching,
  } = useGetProductQuery({ product_id }, { skip: !product_id });

  // Review pagination state
  const [offset, setOffset] = useState(0);
  const limit = 10;

  // Fetch reviews with RTK Query
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    isFetching: reviewsFetching,
    refetch: reviewRefetch,
    isError: reviewIsError,
    error: reviewError,
  } = useGetReviewsQuery({ offset, limit, product_id });

  // Mutation for creating review
  const [
    createReview,
    { isLoading: sendReviewLoading, error: sendReviewError },
  ] = useCreateReviewMutation();

  // Local review input state
  const [review, setReview] = useState("");

  // Infinite scroll observer
  const observer = useRef();

  // Flattened reviews array
  const reviewsArray = useMemo(
    () => (Array.isArray(reviewsData?.reviews) ? reviewsData.reviews : []),
    [reviewsData]
  );

  // Determine if more reviews exist
  const hasMore = reviewsArray.length < (reviewsData?.numb_found || 0);

  // Intersection observer for infinite scroll
  const lastReviewRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !reviewsFetching) {
          setOffset((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, reviewsFetching]
  );

  // Handle creating a new review
  const handleCreateReview = async () => {
    if (!review) return;

    const formData = new FormData();
    formData.append("content", review);
    formData.append("product_id", product_id);
    formData.append("hav_video", 0);

    try {
      await createReview({ formData }).unwrap();
      setReview("");
      reviewRefetch();
    } catch (err) {
      console.error("Failed to create review:", err);
    }
  };

  // Image carousel state
  const [selectedIndex, setSelectedIndex] = useState(0);
  const renderImages = (images) =>
    typeof images === "string"
      ? images.split(",").map((img) => img.trim())
      : [];
  const imagesArray = renderImages(product?.product_images);

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? imagesArray.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === imagesArray.length - 1 ? 0 : prev + 1
    );
  };

  const handleGoBack = () => navigate(-1);

  // Pass props to ProductPage
  const productProps = {
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
    reviewMessages: reviewsArray,
    handleCreateReview,
    reviewsLoading,
    reviewsFetching,
    reviewRefetch,
    reviewIsError,
    reviewError,
    lastReviewRef,
    sendReviewLoading,
  };

  return <ProductPage {...productProps} />;
}

export default ProductDetails;
