// export function onVisibleImage({
//   itemRefs,
//   containerSelector = ".post-history",
//   replaceStmt = "post-history-",
// }) {
//   if (!itemRefs?.current) return;

//   const visibleItems = itemRefs.current.filter((el) => {
//     if (!el) return false;
//     const rect = el.getBoundingClientRect();
//     return (
//       rect.top >= window.innerHeight / 10 && rect.bottom <= window.innerHeight
//     );
//   });

//   const postIds = visibleItems
//     .map((el) =>
//       el.querySelector(containerSelector)?.id?.replace(replaceStmt, "")
//     )
//     .filter(Boolean);

//   postIds.forEach((id) => {
//     const currentImage = document.querySelector(
//       `#${replaceStmt}${id} img, #${replaceStmt}${id} video`
//     );
//     if (currentImage) {
//       currentImage.style.display = "flex";
//     }
//   });
// }

// export function onVisibleVideo({
//   itemRefs,
//   containerSelector = ".post-history",
//   replaceStmt = "post-history-",
//   data = [],
//   setVisiblePostId = () => {},
// }) {
//   if (!itemRefs?.current) return;

//   const itemsWithCoverage = itemRefs.current
//     .map((el) => {
//       if (!el) return null;
//       const rect = el.getBoundingClientRect();

//       const visibleHeight =
//         Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
//       const clampedHeight = Math.max(0, visibleHeight);

//       const percentOfViewport = (clampedHeight / window.innerHeight) * 100;

//       return { el, percentOfViewport };
//     })
//     .filter((item) => item && item.percentOfViewport > 0);

//   if (!itemsWithCoverage.length) return;

//   const largestItem = itemsWithCoverage.reduce((max, item) =>
//     item.percentOfViewport > max.percentOfViewport ? item : max
//   );

//   // Pause all videos before playing the visible one
//   document.querySelectorAll("video").forEach((video) => video.pause());

//   const postId = largestItem.el
//     .querySelector(containerSelector)
//     ?.id?.replace(replaceStmt, "");

//   if (!postId) return;

//   const isVideoPost = data.find((p) => p.post_id === postId && p.has_video);
//   if (!isVideoPost) return;

//   const currentVideo = document.querySelector(`#${replaceStmt}${postId} video`);

//   if (currentVideo) {
//     console.log(
//       `Playing video for post ${postId} (${largestItem.percentOfViewport.toFixed(
//         1
//       )}% visible)`
//     );
//     currentVideo.classList.add("visible-post");
//     currentVideo.play().catch((err) => console.warn("Autoplay failed:", err));
//   }

//   setVisiblePostId(postId);
// }
