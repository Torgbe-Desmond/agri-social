import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MediaSlider from "../MediaSlider/MediaSlider";

export default function FeedImageCard({ media }) {
  if (!media || media.length === 0) return null;

  const containerStyles = {
    width: "100%",
    height: "100%",
    cursor: "pointer",
  };

  return (
    <div style={containerStyles}>
      <MediaSlider slides={media} />
    </div>
  );
}
