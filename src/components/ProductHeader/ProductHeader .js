import { Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const ProductHeader = ({ handleGoBack }) => (
  <Box className="notifications__header">
    <h2>
      <ArrowBackIcon cursor="pointer" onClick={handleGoBack} /> Product
    </h2>
  </Box>
);

export default ProductHeader
