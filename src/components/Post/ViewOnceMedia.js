import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ViewOnceSlider from "./ViewOnceSlider";

export default function ViewOnceMedia({ media }) {
  if (!media || media.length === 0) return null;

  const containerStyles = {
    // width: "100%",
    // height: "100%",
    cursor: "pointer",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
  };

  return (
    <div style={containerStyles}>
      <ViewOnceSlider slides={media} />
    </div>
  );
}
