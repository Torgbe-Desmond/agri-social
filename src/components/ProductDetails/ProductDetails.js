import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  useGetProductQuery,
  useGetReviewsQuery,
} from "../../Features/productApi";
import { useDispatch } from "react-redux";
import ProductPage from "../../Pages/ProductPage/ProductPage";

function ProductDetails() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { product_id } = useParams();
  const navigate = useNavigate();
  const { systemPrefersDark } = useOutletContext();
  const [review, setReview] = useState("");
  const [offset, setLocalOffset] = useState(1);
  const reviewRef = useRef();
  const dispatch = useDispatch();
  const lastScrollTop = useRef(0);
  const observer = useRef();

  const [scrolling, setScroll] = useState(0);

  const {
    data: product,
    isLoading,
    isFetching,
  } = useGetProductQuery({ product_id }, { skip: !product_id });

  const {
    data: reviews,
    isLoading: reviewsLoading,
    isFetching: reviewsFetching,
  } = useGetReviewsQuery(
    { offset, limit: 10, product_id },
    { skip: !product_id }
  );

  const reviewsData = useMemo(() => {
    return Array.isArray(reviews?.reviews) ? reviews.reviews : [];
  }, [reviews]);

  const hasMore = reviewsData?.length > 0;

  useEffect(() => {
    const node = reviewRef.current;
    if (!node) return;

    const handleScroll = () => {
      const scrollTop = node.scrollTop;
      lastScrollTop.current = scrollTop;
      setScroll((prev) => prev + 1);
    };

    node.addEventListener("scroll", handleScroll);
    return () => node.removeEventListener("scroll", handleScroll);
  }, [dispatch]);

  const lastReviewRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isFetching) {
          // dispatch(setPostsOffset());
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, isFetching, dispatch]
  );

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) =>
      prev === 0
        ? (renderImages(product?.product_images)?.length || 1) - 1
        : prev - 1
    );
  };

  const handleNext = () => {
    const length = renderImages(product?.product_images)?.length || 1;
    setSelectedIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const renderImages = (images) => {
    return typeof images === "string"
      ? images.split(",").map((img) => img.trim())
      : [];
  };

  const imagesArray = renderImages(product?.product_images);

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
  };

  return <ProductPage {...productProps} />;
}

export default ProductDetails;
